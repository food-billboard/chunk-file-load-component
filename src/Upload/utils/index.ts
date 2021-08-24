import { get, merge } from 'lodash-es';
import { AxiosResponse } from 'axios';
import { TRequestType, Upload } from 'chunk-file-upload/src';
import {
  request,
  requestCacheSchemaGet,
  requestCacheSchemaSet,
  IRequestOptions,
} from '@/utils/request';
import { withTry } from '@/utils/tool';
import { UploadProps } from '../type';

export * from './tool';
export * from './hooks';
export { default as Emitter } from './emitter';
export { default as itemRender } from './itemRender';

const { BODY_SCHEMA_CACHE, EXIST_DATA_SCHEMA_CACHE, UPLOAD_DATA_SCHEMA_CACHE } =
  requestCacheSchemaGet();

const SCHEMA_CACHE = {
  BODY_SCHEMA_CACHE: BODY_SCHEMA_CACHE || '',
  EXIST_DATA_SCHEMA_CACHE: EXIST_DATA_SCHEMA_CACHE || '',
  UPLOAD_DATA_SCHEMA_CACHE: UPLOAD_DATA_SCHEMA_CACHE || '',
};

const BODY_TRY_SCHEMA_ORIGIN = [
  'data',
  'res',
  'response',
  'offset',
  'index',
  'result',
  'current',
];

const BODY_TRY_SCHEMA = new Proxy(BODY_TRY_SCHEMA_ORIGIN, {
  set(target, property, value, receiver) {
    const prevValue = Reflect.get(target, property, receiver);
    if (prevValue === value) return true;
    requestCacheSchemaSet(
      merge({}, SCHEMA_CACHE, {
        [property]: value,
      }) as any,
    );
    return Reflect.set(target, property, value, receiver);
  },
});

const EXIT_DATA_FN_RES_TRY_SCHEMA = ['', ...BODY_TRY_SCHEMA];

const UPLOAD_DATA_FN_RES_TRY_SCHEMA = [...EXIT_DATA_FN_RES_TRY_SCHEMA];

const isValidNumber = (value: any) => {
  if (typeof value === 'number') return true;
  if (typeof value === 'string' && value !== 'true' && value !== 'false') {
    const formatValue = parseInt(value);
    return !Number.isNaN(formatValue) && Number.isFinite(formatValue);
  }
  return false;
};

const dataGetTry = <O extends object = any>(
  origin: O,
  schema: keyof typeof SCHEMA_CACHE,
  schemaMap: string[],
) => {
  let response: any;
  try {
    if (isValidNumber(origin)) {
      response = origin;
      SCHEMA_CACHE[schema] = '';
    } else {
      response = get(origin, SCHEMA_CACHE[schema]);
      if (!response) {
        throw new Error();
      }
    }
  } catch (err) {
    schemaMap.some((curSchema) => {
      response = get(origin, curSchema);
      const isExists = !!response;
      if (isExists) {
        SCHEMA_CACHE[schema] = curSchema;
      }
      return isExists;
    });
  }
  return response;
};

function bodyGetTry(body: AxiosResponse) {
  const { data } = body;
  return dataGetTry(data, 'BODY_SCHEMA_CACHE', BODY_TRY_SCHEMA);
}

async function exitDataFnResponseTry(
  params: any,
  _: any,
  url: string,
  __: Upload,
  requestSetting: IRequestOptions,
) {
  const response = await request(url, {
    method: 'GET',
    params,
    ...requestSetting,
  });
  const responseBody = bodyGetTry(response);
  return dataGetTry(
    responseBody,
    'EXIST_DATA_SCHEMA_CACHE',
    EXIT_DATA_FN_RES_TRY_SCHEMA,
  );
}

async function uploadFnResponseTry(
  formData: any,
  _: any,
  url: string,
  __: Upload,
  requestSetting: IRequestOptions,
) {
  const response = await request(url, {
    method: 'POST',
    data: formData,
    ...requestSetting,
  });
  const responseBody = bodyGetTry(response);
  return dataGetTry(
    responseBody,
    'UPLOAD_DATA_SCHEMA_CACHE',
    UPLOAD_DATA_FN_RES_TRY_SCHEMA,
  );
}

const methodGetTry = (
  requestData: TRequestType,
  method: (string | false)[],
) => {
  const [exitDataFnMethod, _, completeFnMethod] = method;
  if (exitDataFnMethod === false) {
    delete requestData.exitDataFn;
  }
  if (completeFnMethod === false) {
    delete requestData.completeFn;
  }
  return requestData;
};

export function customAction({
  url,
  instance,
  method,
  headers,
  withCredentials = true,
}: {
  url: string;
  instance: Upload;
  method?: UploadProps['method'];
  headers?: UploadProps['headers'];
  withCredentials?: UploadProps['withCredentials'];
}) {
  const [
    exitDataFnMethod = 'GET',
    uploadFnMethod = 'POST',
    completeFnMethod = 'POST',
  ] = method || [];
  const [exitDataFnHeaders, uploadFnHeaders, completeFnHeaders] = headers || [];

  let requestData: TRequestType = {
    async exitDataFn(params, name) {
      const [err, value] = await withTry(exitDataFnResponseTry)(
        params,
        name,
        url,
        instance,
        {
          headers: exitDataFnHeaders || {},
          withCredentials: !!withCredentials,
          method: exitDataFnMethod,
        },
      );
      if (err || !value) {
        console.warn(
          'exitDataFn exist check request fail and will restart the task',
        );
        return {
          data: 0,
        };
      }
      return value;
    },
    async uploadFn(formData, name) {
      return uploadFnResponseTry(formData, name, url, instance, {
        headers: uploadFnHeaders || {},
        withCredentials: !!withCredentials,
        method: uploadFnMethod as any,
      });
    },
    async completeFn(params) {
      const [err] = await withTry(request)(url, {
        params,
        method: (completeFnMethod as any) || 'PUT',
        headers: completeFnHeaders || {},
        withCredentials: !!withCredentials,
      });
      if (!!err) {
        console.warn('completeFn complete request fail');
      }
    },
    callback(error, value) {},
  };

  requestData = methodGetTry(requestData, [
    exitDataFnMethod,
    uploadFnMethod,
    completeFnMethod,
  ]);

  return {
    request: requestData,
  };
}
