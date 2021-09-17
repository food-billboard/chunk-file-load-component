import React, {
  memo,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
  createContext,
} from 'react';
import classnames from 'classnames';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { merge, noop, omit } from 'lodash';
import { nanoid } from 'nanoid';
import {
  Upload as ChunkFileUpload,
  TRequestType,
  TLifecycle,
} from 'chunk-file-upload';
import Container from './components/Container';
import ViewFile from './components/ViewFile';
import { DEFAULT_DROP_PROPS, LIFE_CYCLE_ENUM } from './constants';
import {
  propsValueFormat,
  Emitter,
  createPreview,
  install,
  uninstall,
  getInstallMap,
} from './utils';
import { useControllableValue } from '../utils';
import {
  UploadProps,
  UploadInstanceType,
  WrapperFile,
  UploadContextType,
  CustomAction,
} from './type';
import './index.less';

export * from './type';

const emitter = new Emitter();

function lifecycleFormat(lifecycle: TLifecycle) {
  return LIFE_CYCLE_ENUM.reduce(function (acc, cycle) {
    const action = (lifecycle as any)[cycle];
    acc[cycle] = function (params: any, response: any) {
      emitter.emit(params.name, params, response, this);
      return action?.(params);
    };
    return acc;
  }, {} as any);
}

const UploadInstance = new ChunkFileUpload({
  lifecycle: lifecycleFormat({}),
});

export const UploadContext = createContext<UploadContextType>({
  instance: {} as any,
  emitter,
  locale: {},
  setValue: noop,
});

const { Provider } = UploadContext;

const Upload = memo(
  forwardRef<UploadInstanceType, UploadProps>((props, ref) => {
    const [files, setFiles] = useControllableValue<WrapperFile[]>(
      omit(props, ['defaultValue']),
      {
        defaultValue: (props.defaultValue as WrapperFile[]) || [],
      },
    );

    const {
      className,
      style,
      showUploadList = true,
      immediately = true,
      request = {},
      lifecycle = {},
      actionUrl,
      method,
      headers,
      withCredentials = true,
      containerRender,
      viewType = 'list',
      viewStyle,
      viewClassName,
      defaultValue,
      value,
      onChange,
      onRemove,
      locale,
      iconRender,
      itemRender,
      previewFile,
      onValidator,
      validator: propsValidator,
      onPreviewFile,
      multiple = false,
      limit = -1,
      onError: propsOnError,
      ...nextProps
    } = props;

    const callbackWrapper = (callback: any, error: any, value: any) => {
      if (!!error) {
        let errorFiles: any;
        let dealError = false;
        setFiles((prev) => {
          return prev.map((item) => {
            if (item.name !== value || item.task?.tool.file.isStop())
              return item;
            dealError = true;
            errorFiles = merge({}, item, {
              error,
            });
            return errorFiles;
          });
        });
        dealError && propsOnError?.(error, errorFiles);
      }
      callback?.(error, value);
    };

    const onError = useCallback(
      (request: TRequestType) => {
        const { callback, ...nextRequest } = request;
        return {
          ...nextRequest,
          callback: callbackWrapper.bind(null, callback),
        };
      },
      [files, callbackWrapper],
    );

    const taskGenerate = useCallback(
      (file: File) => {
        const actionRequest = getInstallMap('request');
        if (actionUrl && !!actionRequest && !Object.keys(request).length) {
          const { request, ...nextAction } = actionRequest({
            url: actionUrl,
            instance: UploadInstance,
            withCredentials: !!withCredentials,
            headers,
            method,
          });
          return {
            request: onError(request as TRequestType),
            ...nextAction,
            file: {
              file,
            },
            lifecycle,
          };
        }
        return {
          request: onError(request as TRequestType),
          file: {
            file,
          },
          lifecycle,
        };
      },
      [
        request,
        actionUrl,
        withCredentials,
        onError,
        headers,
        method,
        files,
        lifecycle,
      ],
    );

    const addTask = useCallback(
      (files: File | File[]) => {
        const realFiles = Array.isArray(files) ? files : [files];
        const wrapperFiles = realFiles.reduce<{
          wrapperFiles: WrapperFile[];
          errorFiles: File[];
        }>(
          (acc, file: File) => {
            const tasks = UploadInstance?.add(taskGenerate(file));
            if (Array.isArray(tasks) && tasks.length === 1) {
              const [name] = tasks;
              const task = UploadInstance.getTask(name);
              const id = nanoid();
              const wrapperTask: WrapperFile = {
                originFile: file,
                name,
                id,
                get task() {
                  return UploadInstance.getTask(name) || task || undefined;
                },
                local: {
                  type: 'local',
                  value: {
                    preview: createPreview(file),
                    fileId: id,
                    fileSize: file.size,
                    filename: file.name,
                  },
                },
                getStatus() {
                  return task!.status;
                },
              };
              acc.wrapperFiles.push(wrapperTask);
              if (immediately) UploadInstance.deal(name);
            } else {
              acc.errorFiles.push(file);
            }
            return acc;
          },
          {
            wrapperFiles: [],
            errorFiles: [],
          },
        );
        return wrapperFiles;
      },
      [request, taskGenerate],
    );

    const onDrop: DropzoneOptions['onDrop'] = useCallback(
      (acceptedFiles, fileRejections) => {
        const { wrapperFiles, errorFiles } = addTask(acceptedFiles);
        onValidator?.(
          [
            ...errorFiles.map((item) => {
              return {
                file: item,
                errors: [
                  {
                    message: 'task add error',
                    code: 'task add error',
                  },
                ],
              };
            }),
            ...fileRejections,
          ],
          wrapperFiles.map((item) => item.originFile!),
        );
        setFiles([...files, ...wrapperFiles]);
      },
      [addTask, onValidator, files],
    );

    const validator = useMemo(() => {
      return propsValidator || getInstallMap('validator');
    }, [propsValidator]);

    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
      isFocused,
      isFileDialogActive,
    } = useDropzone(
      merge({}, DEFAULT_DROP_PROPS, {
        onDrop,
        validator,
        multiple,
        ...nextProps,
      }),
    );

    const getTask = useCallback((name) => {
      return UploadInstance!.getTask(name);
    }, []);

    const formatValue = useMemo(() => {
      return propsValueFormat(files);
    }, [files]);

    const getFiles = useCallback(
      (origin: boolean = false) => {
        return origin ? formatValue : files;
      },
      [formatValue, files],
    );

    useImperativeHandle(
      ref,
      () => {
        return {
          getTask,
          getFiles,
        };
      },
      [getTask, getFiles],
    );

    const releasePreviewCache = useCallback(
      (files: WrapperFile | WrapperFile[]) => {
        const realFiles = Array.isArray(files) ? files : [files];
        realFiles.forEach((file) => {
          try {
            URL.revokeObjectURL(file.local?.value?.preview as string);
          } catch (err) {}
        });
      },
      [],
    );

    const fileDomList = useMemo(() => {
      return (
        <ViewFile
          instance={UploadInstance}
          style={viewStyle}
          className={viewClassName}
          value={formatValue || []}
          viewType={viewType}
          showUploadList={showUploadList}
          onChange={setFiles}
          onRemove={onRemove}
          iconRender={iconRender}
          itemRender={itemRender}
          previewFile={previewFile}
          onPreviewFile={onPreviewFile}
          onCancel={releasePreviewCache}
        />
      );
    }, [
      formatValue,
      viewType,
      showUploadList,
      viewClassName,
      viewStyle,
      onRemove,
      itemRender,
      previewFile,
      iconRender,
      onPreviewFile,
      releasePreviewCache,
    ]);

    const contextValue = useMemo(() => {
      return {
        instance: UploadInstance,
        emitter,
        locale,
        setValue: setFiles,
      };
    }, [locale]);

    return (
      <Provider value={contextValue}>
        <div
          className={classnames('chunk-upload-container', {
            ['chunk-upload-container-list']:
              viewType === 'list' && !containerRender,
            ['chunk-upload-container-card']:
              viewType === 'card' && !containerRender,
          })}
        >
          <Container
            viewType={viewType || 'list'}
            isDragAccept={isDragAccept}
            isDragActive={isDragActive}
            isDragReject={isDragReject}
            isFileDialogActive={isFileDialogActive}
            isFocused={isFocused}
            style={style}
            className={className}
            locale={locale}
            containerRender={containerRender}
            root={getRootProps<any>({})}
            input={getInputProps<any>({})}
            currentFiles={files?.length || 0}
            limit={limit}
          />
          {!!showUploadList && fileDomList}
        </div>
      </Provider>
    );
  }),
);

const WrapperUpload: typeof Upload & {
  install: (
    key: keyof CustomAction,
    action: CustomAction[keyof CustomAction],
  ) => void;
  uninstall: (key: keyof CustomAction) => void;
} = Upload as any;

WrapperUpload.install = install;
WrapperUpload.uninstall = uninstall;

export default WrapperUpload;
