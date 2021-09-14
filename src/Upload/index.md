## Upload

基础:

```tsx
import React, { useState } from 'react';
import { Upload } from 'chunk-file-load-component';
import { Radio } from 'antd';

//mock local server
let mockCache = {};

const sleep = (times = 500) =>
  new Promise((resolve) => setTimeout(resolve, times));

export default () => {
  const [viewType, setViewType] = useState('list');

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

  const onRadioChange = (e) => {
    const value = e.target.value;
    setViewType(value);
  };

  return (
    <>
      <Radio.Group value={viewType} onChange={onRadioChange}>
        <Radio key="list" value="list">
          列表
        </Radio>
        <Radio key="card" value="card">
          卡片
        </Radio>
      </Radio.Group>
      <Upload
        immediately={false}
        onRemove={sleep.bind(null, 1000)}
        viewType={viewType}
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

立即上传:

```tsx
import React from 'react';
import { Upload } from 'chunk-file-load-component';

//mock local server
let mockCache = {};

const sleep = (times = 500) =>
  new Promise((resolve) => setTimeout(resolve, times));

export default () => {
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
        immediately
        onRemove={sleep.bind(null, 1000)}
        viewType="list"
        request={
          {
            // exitDataFn,
            // uploadFn,
            // completeFn,
            // callback(err, value) {
            //   console.log(err, value);
            //   if (!err) {
            //     console.log('Upload Done!!');
            //   }
            // },
          }
        }
      />
    </>
  );
};
```

错误:

```tsx
import React from 'react';
import { Upload } from 'chunk-file-load-component';

//mock local server
let mockCache = {};

const sleep = (times = 500) =>
  new Promise((resolve) => setTimeout(resolve, times));

export default () => {
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
        onRemove={sleep.bind(null, 1000)}
        viewType="list"
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

上传受控:

```tsx
import React, { useState } from 'react';
import { Upload } from 'chunk-file-load-component';

//mock local server
let mockCache = {};

const sleep = (times = 500) =>
  new Promise((resolve) => setTimeout(resolve, times));

export default () => {
  const [uploadValue, setUploadValue] = useState([]);

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

  const onChange = (value) => {
    setUploadValue(value);
    console.log('upload value changed', value);
  };

  return (
    <>
      <Upload
        immediately={false}
        onRemove={sleep.bind(null, 1000)}
        viewType="list"
        value={uploadValue}
        onChange={onChange}
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

预定义请求:

- 可以使用[默认请求](https://github.com/food-billboard/chunk-upload-request)

1. 此需要单独安装模块 `npm install chunk-upload-request`
2. 使用

```tsx | pure
import React from 'react';
import request from 'chunk-upload-request';
import { Upload } from 'chunk-file-load-component';

Upload.install('request', request());

const App = () => {
  return (
    <Upload
      immediately={false}
      actionUrl={['/api/check', '/api/load', '/api/complete']}
      lifecycle={{
        afterComplete() {
          console.log('upload complete');
        },
      }}
    />
  );
};
export default App;
```

- 注册`request`插件后，组件则不需要传递`request`参数，如果传递，则使用`props`的`request`
- 也可以自己实现自定义的`request`插件，参数及实现与[chunk-file-load](https://github.com/food-billboard/chunk-file-load)的`request`一致

生命周期:

```tsx | pure
const App = () => {
  return (
    <Upload
      lifecycle={{
        beforeRead() {
          console.log('beforeRead');
        },
      }}
    />
  );
};
```

自定义上传容器:

```tsx
import React from 'react';
import { Upload } from 'chunk-file-load-component';

//mock local server
let mockCache = {};

const sleep = (times = 500) =>
  new Promise((resolve) => setTimeout(resolve, times));

export default () => {
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

  const containerRender = ({
    isDragAccept,
    isDragActive,
    isDragReject,
    isFocused,
    isFileDialogActive,
    isLimit,
    locale,
  }) => {
    return <button>点击上传</button>;
  };

  return (
    <>
      <Upload
        containerRender={containerRender}
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

自定义上传列表

```tsx
import React from 'react';
import { Upload } from 'chunk-file-load-component';

//mock local server
let mockCache = {};

const sleep = (times = 500) =>
  new Promise((resolve) => setTimeout(resolve, times));

export default () => {
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

  const itemRender = (
    originNode,
    file,
    fileList,
    { preview, upload, cancel, stop },
    { complete, status, total },
  ) => {
    const fileName = file.task.file.name;
    return (
      <div>
        {fileName}- 进度: {(complete / total) * 100 || 0}- 状态: {status}-
        <span onClick={upload}>上传</span>-<span onClick={cancel}>取消</span>
      </div>
    );
  };

  return (
    <>
      <Upload
        itemRender={itemRender}
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

自定义预览

```tsx
import React, { useState } from 'react';
import { Upload } from 'chunk-file-load-component';
import { Modal } from 'antd';

//mock local server
let mockCache = {};

const sleep = (times = 500) =>
  new Promise((resolve) => setTimeout(resolve, times));

export default () => {
  const [previewVisible, setPreviewVisible] = useState(false);

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

  function previewFile(file) {
    console.log('wrapperFile', file);
    return (
      <Modal
        footer={null}
        closable
        onCancel={setPreviewVisible.bind(null, false)}
        visible={previewVisible}
      >
        自定义预览
      </Modal>
    );
  }

  const onPreview = () => {
    setPreviewVisible(true);
    return true;
  };

  return (
    <>
      <Upload
        previewFile={previewFile}
        onPreviewFile={onPreview}
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

自定义上传验证:

```tsx
import React from 'react';
import { Upload } from 'chunk-file-load-component';

//mock local server
let mockCache = {};

const sleep = (times = 500) =>
  new Promise((resolve) => setTimeout(resolve, times));

export default () => {
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

  const validator = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return null;
    return {
      message: 'file-invalid-type',
      code: 'file-invalid-type',
    };
  };

  const onValidator = (errorFiles: File[], fulFiles: File[]) => {
    if (errorFiles.length) {
      console.error('there file is error');
    }
    console.log('errorFiles: ', errorFiles, 'fulFiles: ', fulFiles);
  };

  return (
    <>
      <Upload
        immediately={false}
        onValidator={onValidator}
        onRemove={sleep.bind(null, 1000)}
        validator={validator}
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

自定义文件图标:

```tsx
import React from 'react';
import { Upload } from 'chunk-file-load-component';

//mock local server
let mockCache = {};

const sleep = (times = 500) =>
  new Promise((resolve) => setTimeout(resolve, times));

export default () => {
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

  const iconRender = (file, viewType, originNode) => {
    console.log(file, viewType);
    const type = file.originFile.type;
    if (type.startsWith('image/')) {
      return <span>自定义图标</span>;
    }
    return originNode;
  };

  return (
    <>
      <Upload
        immediately={false}
        onRemove={sleep.bind(null, 1000)}
        iconRender={iconRender}
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

自定义 uploadListIcon

```tsx
import React, { useState } from 'react';
import { Upload } from 'chunk-file-load-component';
import { Radio } from 'antd';

//mock local server
let mockCache = {};

const sleep = (times = 500) =>
  new Promise((resolve) => setTimeout(resolve, times));

export default () => {
  const [removeIcon, setRemoveIcon] = useState('true');

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

  const onRadioChange = (e) => {
    const value = e.target.value;
    setRemoveIcon(value);
  };

  const showUploadList = () => {
    switch (removeIcon) {
      case 'true':
        return { showRemoveIcon: true };
      case 'false':
        return { showRemoveIcon: false };
      case 'custom':
        return {
          removeIcon: () => <span>delete</span>,
        };
    }
  };

  return (
    <>
      <Radio.Group value={removeIcon} onChange={onRadioChange}>
        <Radio key="true" value="true">
          显示默认删除图标
        </Radio>
        <Radio key="false" value="false">
          不显示删除图标
        </Radio>
        <Radio key="custom" value="custom">
          自定义删除图标
        </Radio>
      </Radio.Group>
      <Upload
        immediately={false}
        onRemove={sleep.bind(null, 1000)}
        viewType="list"
        showUploadList={showUploadList()}
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

文件大小限制

```tsx
import React from 'react';
import { Upload } from 'chunk-file-load-component';

//mock local server
let mockCache = {};

const sleep = (times = 500) =>
  new Promise((resolve) => setTimeout(resolve, times));

export default () => {
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

  const onValidator = (errorFiles: File[], fulFiles: File[]) => {
    if (errorFiles.length) {
      console.error('there file is error');
    }
    console.log('errorFiles: ', errorFiles, 'fulFiles: ', fulFiles);
  };

  return (
    <>
      <h3>限制上传在10-100</h3>
      <Upload
        immediately={false}
        onValidator={onValidator}
        onRemove={sleep.bind(null, 1000)}
        viewType="list"
        minSize={10}
        maxSize={100}
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

自定义文案

```tsx
import React, { useState } from 'react';
import { Upload } from 'chunk-file-load-component';
import { Radio } from 'antd';

//mock local server
let mockCache = {};

const sleep = (times = 500) =>
  new Promise((resolve) => setTimeout(resolve, times));

export default () => {
  const [viewType, setViewType] = useState('list');

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

  const onRadioChange = (e) => {
    const value = e.target.value;
    setViewType(value);
  };

  return (
    <>
      <Radio.Group value={viewType} onChange={onRadioChange}>
        <Radio key="list" value="list">
          列表
        </Radio>
        <Radio key="card" value="card">
          卡片
        </Radio>
      </Radio.Group>
      <Upload
        immediately={false}
        onRemove={sleep.bind(null, 1000)}
        viewType={viewType}
        locale={{
          container: '自定义容器文案',
          progress: {
            pending: '队列',
            waiting: '等待',
            reading: '解析',
            uploading: '上传',
            fulfilled: '完成',
            rejected: '失败',
            cancel: '取消',
            stopping: '暂停',
          },
        }}
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

多选

```tsx
import React from 'react';
import { Upload } from 'chunk-file-load-component';

//mock local server
let mockCache = {};

const sleep = (times = 500) =>
  new Promise((resolve) => setTimeout(resolve, times));

export default () => {
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
      <h4>可同时选择多个文件</h4>
      <Upload
        immediately={false}
        onRemove={sleep.bind(null, 1000)}
        viewType={'list'}
        multiple
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

### API

- tips 部分参数与[antd](https://github.com/ant-design/ant-design)中的`Upload`组件类似

| 参数            | 说明                                                                                                                                            | 类型                                                                                                                                                                                                                                                                                                                                              | 默认值                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| defaultValue    | 默认值                                                                                                                                          | `string` &#124; `string[]` &#124; `PartialWrapperFile` &#124; `PartialWrapperFile[]`                                                                                                                                                                                                                                                              | -                                       |
| value           | 文件列表                                                                                                                                        | `string` &#124; `string[]` &#124; `PartialWrapperFile` &#124; `PartialWrapperFile[]`                                                                                                                                                                                                                                                              | -                                       |
| onChange        | 文件列表变化时的回调                                                                                                                            | `(value: WrapperFile[]) => void`                                                                                                                                                                                                                                                                                                                  | -                                       |
| onValidator     | 文件验证                                                                                                                                        | `(errorFile: File[], fulfilledFile: File[]) => void`                                                                                                                                                                                                                                                                                              | -                                       |
| onRemove        | 点击移除文件时的回调，返回值为 false 时不移除。支持返回一个 Promise 对象，Promise 对象 resolve(false) 或 reject 时不移除                        | `(task: WrapperFile) => (boolean \| Promise)`                                                                                                                                                                                                                                                                                                     | -                                       |
| onError         | 文件上传出错时(注意，取消或暂停时也会触发此方法)                                                                                                | `(error: any, task: WrapperFile) => void`                                                                                                                                                                                                                                                                                                         | -                                       |
| viewStyle       | 自定义文件列表样式                                                                                                                              | `CSSProperties`                                                                                                                                                                                                                                                                                                                                   | -                                       |
| viewClassName   | 自定义文件列表类名                                                                                                                              | `string`                                                                                                                                                                                                                                                                                                                                          | -                                       |
| viewType        | 上传列表的内建样式，支持两种基本样式 `list`, `card`                                                                                             | `list` &#124; `card`                                                                                                                                                                                                                                                                                                                              | `list`                                  |
| iconRender      | 自定义显示 icon                                                                                                                                 | `(file: WrapperFile, viewType: ViewType, originNode: ReactNode) => ReactNode`                                                                                                                                                                                                                                                                     | -                                       |
| itemRender      | 自定义上传列表项                                                                                                                                | `(originNode: ReactElement, file: WrapperFile, fileList: WrapperFile[], actions: { preview: Function, upload: Function, cancel: Function, stop: Function }, progress: Partial<{ complete: number, total: number, status: any, current: number }>) => ReactNode`                                                                                   | -                                       |
| showUploadList  | 是否展示文件列表, 可设为一个对象，用于单独设定 `showPreviewIcon`, `showRemoveIcon`, `showUploadIcon`, `removeIcon`, `previewIcon`, `uploadIcon` | `boolean \| { showPreviewIcon?: boolean, showRemoveIcon?: boolean, showUploadIcon?: boolean, removeIcon?: ReactNode \| (file: UploadFile) => ReactNode \| previewIcon?: ReactNode \| (file: UploadFile) => ReactNode \| uploadIcon?: ReactNode \| (file: UploadFile) => ReactNode \| uploadIcon?: ReactNode \| (file: UploadFile) => ReactNode }` | `true`                                  |
| previewFile     | 自定义预览(默认情况仅支持图片)，返回`false`表示使用默认预览                                                                                     | `(file: WrapperFile, viewType: ViewType) => Promise<ReactNode \| false>`                                                                                                                                                                                                                                                                          | -                                       |
| onPreviewFile   | 当文件预览时，返回`boolean`控制是否预览                                                                                                         | `(file: WrapperFile) => Promise<boolean>`                                                                                                                                                                                                                                                                                                         | -                                       |
| containerRender | 自定义上传容器渲染                                                                                                                              | `(action: { isDragAccept: boolean, isDragActive: boolean, isDragReject: boolean, isFocused: boolean, isFileDialogActive: boolean, locale?: object, isLimit: boolean }) => ReactNode`                                                                                                                                                              | -                                       |
| immediately     | 是否立即上传                                                                                                                                    | `boolean`                                                                                                                                                                                                                                                                                                                                         | `true`                                  |
| limit           | 限制上传的文件数量，只在新增时限制，设置`-1`则不限制                                                                                            | `number`                                                                                                                                                                                                                                                                                                                                          | `-1`                                    |
| actionUrl       | 上传地址                                                                                                                                        | `string\|[string, string, string?]`                                                                                                                                                                                                                                                                                                               | -                                       |
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
