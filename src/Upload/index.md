## Upload

基础:

```tsx
import React, { useRef } from 'react';
import { Upload } from 'chunk-file-load-component';

//mock local server
let mockCache = {};

const sleep = (times = 500) =>
  new Promise((resolve) => setTimeout(resolve, times));

export default () => {
  const uploadRef = useRef();

  const exitDataFn = async (
    params: {
      filename: string;
      md5: string;
      suffix: string;
      size: number;
      chunkSize: number;
      chunksLength: number;
    },
    name: Symbol,
  ) => {
    await sleep();
    console.log('exitDataFn', params);
    mockCache[name] = {
      max: params.chunksLength,
      chunkSize: params.chunkSize,
      size: params.size,
      index: 0,
    };
    //Mock server response
    return {
      data: 0,
    };
  };

  const uploadFn = async (data: FormData, name: Symbol) => {
    await sleep();
    console.log('uploadFn', data, name);
    const size = mockCache[name].size;
    mockCache[name].index++;
    const nextOffset = mockCache[name].index * mockCache[name].chunkSize;
    //Mock server response
    return {
      data: nextOffset >= size ? size : nextOffset,
    };
  };

  const completeFn = async (data: any) => {
    await sleep();
    console.log('completeFn', data);
    mockCache[data.name] = {};
  };

  return (
    <>
      <Upload
        ref={uploadRef}
        immediately={false}
        onRemove={sleep.bind(null, 1000)}
        viewType="list"
        request={{
          exitDataFn,
          uploadFn,
          completeFn,
          callback(err, value) {
            console.log(err, value);
            if (!err) {
              console.log('Upload Done!!');
            }
          },
        }}
      />
    </>
  );
};
```

错误:

```tsx
import React, { useRef } from 'react';
import { Upload } from 'chunk-file-load-component';

//mock local server
let mockCache = {};

const sleep = (times = 500) =>
  new Promise((resolve) => setTimeout(resolve, times));

export default () => {
  const uploadRef = useRef();

  const exitDataFn = async (
    params: {
      filename: string;
      md5: string;
      suffix: string;
      size: number;
      chunkSize: number;
      chunksLength: number;
    },
    name: Symbol,
  ) => {
    await sleep();
    console.log('exitDataFn', params);
    if (!mockCache[name]) {
      mockCache[name] = {
        max: params.chunksLength,
        chunkSize: params.chunkSize,
        size: params.size,
        index: 0,
        error: true,
      };
    } else {
      mockCache[name].error = false;
    }
    //Mock server response
    return {
      data: 0,
    };
  };

  const uploadFn = async (data: FormData, name: Symbol) => {
    await sleep();
    if (mockCache[name].error) {
      return {
        data: -1,
      };
    }
    console.log('uploadFn', data, name);
    const size = mockCache[name].size;
    mockCache[name].index++;
    const nextOffset = mockCache[name].index * mockCache[name].chunkSize;
    //Mock server response
    return {
      data: nextOffset >= size ? size : nextOffset,
    };
  };

  const completeFn = async (data: any) => {
    await sleep();
    console.log('completeFn', data);
    mockCache[data.name] = {};
  };

  return (
    <>
      <Upload
        ref={uploadRef}
        onRemove={sleep.bind(null, 1000)}
        viewType="card"
        immediately={false}
        request={{
          exitDataFn,
          uploadFn,
          completeFn,
          callback(err, value) {
            console.log(err, value);
            if (!err) {
              console.log('Upload Done!!');
            }
          },
        }}
      />
    </>
  );
};
```

<!-- 生命周期:
```tsx

```

自定义请求:
```tsx

```

上传受控:
```tsx

```

自定义上传验证:
```tsx

```

自定义上传样式:
```tsx

``` -->

### API

- tips 部分参数与[antd](https://github.com/ant-design/ant-design)中的`Upload`组件类似

| 参数            | 说明                                                                                                                                            | 类型                                                                                                                                                                                                                                                                                                                                              | 默认值                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| defaultValue    | 默认值                                                                                                                                          | `string` &#124; `string[]` &#124; `WrapperFile` &#124; `WrapperFile[]`                                                                                                                                                                                                                                                                            | -                                       |
| value           | 文件列表                                                                                                                                        | `string` &#124; `string[]` &#124; `WrapperFile` &#124; `WrapperFile[]`                                                                                                                                                                                                                                                                            | -                                       |
| onChange        | 文件列表变化时的回调                                                                                                                            | `(value: WrapperFile[]) => void`                                                                                                                                                                                                                                                                                                                  | -                                       |
| onRemove        | 点击移除文件时的回调，返回值为 false 时不移除。支持返回一个 Promise 对象，Promise 对象 resolve(false) 或 reject 时不移除                        | `(task: WrapperFile) => (boolean \| Promise)`                                                                                                                                                                                                                                                                                                     | -                                       |
| viewStyle       | 自定义文件列表样式                                                                                                                              | `CSSProperties`                                                                                                                                                                                                                                                                                                                                   | -                                       |
| viewClassName   | 自定义文件列表类名                                                                                                                              | `string`                                                                                                                                                                                                                                                                                                                                          | -                                       |
| viewType        | 上传列表的内建样式，支持两种基本样式 `list`, `card`                                                                                             | `list` &#124; `card`                                                                                                                                                                                                                                                                                                                              | `list`                                  |
| iconRender      | 自定义显示 icon                                                                                                                                 | `(file: WrapperFile, viewType: ViewType) => ReactNode`                                                                                                                                                                                                                                                                                            | -                                       |
| itemRender      | 自定义上传列表项                                                                                                                                | `(originNode: ReactElement, file: WrapperFile, fileList: WrapperFile[], actions: { preview: Function, upload: Function, cancel: Function, stop: Function }) => ReactNode`                                                                                                                                                                         | -                                       |
| showUploadList  | 是否展示文件列表, 可设为一个对象，用于单独设定 `showPreviewIcon`, `showRemoveIcon`, `showUploadIcon`, `removeIcon`, `previewIcon`, `uploadIcon` | `boolean \| { showPreviewIcon?: boolean, showRemoveIcon?: boolean, showUploadIcon?: boolean, removeIcon?: ReactNode \| (file: UploadFile) => ReactNode \| previewIcon?: ReactNode \| (file: UploadFile) => ReactNode \| uploadIcon?: ReactNode \| (file: UploadFile) => ReactNode \| uploadIcon?: ReactNode \| (file: UploadFile) => ReactNode }` | `true`                                  |
| previewFile     | 自定义预览(默认情况仅支持图片)                                                                                                                  | `(file: WrapperFile, viewType: ViewType) => ReactNode`                                                                                                                                                                                                                                                                                            | -                                       |
| containerRender | 自定义上传容器渲染                                                                                                                              | `(action: { isDragAccept: boolean, isDragActive: boolean, isDragReject: boolean, isFocused: boolean, isFileDialogActive: boolean, locale?: object, isLimit: boolean }) => ReactNode`                                                                                                                                                              | -                                       |
| immediately     | 是否立即上传                                                                                                                                    | `boolean`                                                                                                                                                                                                                                                                                                                                         | `true`                                  |
| directory       | 支持上传文件夹                                                                                                                                  | `boolean`                                                                                                                                                                                                                                                                                                                                         | `false`                                 |
| actionUrl       | 上传地址                                                                                                                                        | `string`                                                                                                                                                                                                                                                                                                                                          | -                                       |
| method          | 请求方法，分为三阶段(上传前预查，上传，上传完成)                                                                                                | `[string \| false, string, string \| false]`                                                                                                                                                                                                                                                                                                      | `["get", "post", "post]`                |
| headers         | 请求的额外请求头，分为三阶段(上传前预查，上传，上传完成)                                                                                        | `[object \| false, object \| false, object \| false]`                                                                                                                                                                                                                                                                                             | -                                       |
| withCredentials | 上传请求时是否携带 `cookie`                                                                                                                     | `boolean`                                                                                                                                                                                                                                                                                                                                         | `false`                                 |
| request         | 自定义请求逻辑，详情见[chunk-file-upload](https://github.com/food-billboard/chunk-file-load)                                                    | `object`                                                                                                                                                                                                                                                                                                                                          | -                                       |
| lifecycle       | 文件上传生命周期，详情见[chunk-file-upload](https://github.com/food-billboard/chunk-file-load)                                                  | `object`                                                                                                                                                                                                                                                                                                                                          | -                                       |
| accept          | 接受上传的文件类型                                                                                                                              | `string`                                                                                                                                                                                                                                                                                                                                          | -                                       |
| minSize         | 文件上传最小大小                                                                                                                                | `number`                                                                                                                                                                                                                                                                                                                                          | -                                       |
| maxSize         | 文件上传最大大小                                                                                                                                | `number`                                                                                                                                                                                                                                                                                                                                          | -                                       |
| maxFiles        | 文件列表最大数量                                                                                                                                | `number`                                                                                                                                                                                                                                                                                                                                          | -                                       |
| disabled        | 是否禁用                                                                                                                                        | `boolean`                                                                                                                                                                                                                                                                                                                                         | `false`                                 |
| validator       | 自定义文件验证，详情见[react-dropzone](https://github.com/react-dropzone/react-dropzone)                                                        | `Function`                                                                                                                                                                                                                                                                                                                                        | -                                       |
| multiple        | `是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件`                                                                                  | `boolean`                                                                                                                                                                                                                                                                                                                                         | `false`                                 |
| locale          | 默认文案设置                                                                                                                                    | `object`                                                                                                                                                                                                                                                                                                                                          | `{ container: "点击或拖拽文件到此处" }` |
