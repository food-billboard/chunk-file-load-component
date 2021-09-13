export const sleep = async (times = 1000) =>
  new Promise((resolve) => setTimeout(resolve, times));

//mock local server
let mockCache = {};

export const exitDataFn = async (params, name) => {
  mockCache[name] = {
    max: params.chunksLength,
    chunkSize: params.chunkSize,
    size: params.size,
    index: 0,
  };
  return {
    data: 0,
  };
};

export const uploadFn = async (data, name) => {
  const size = mockCache[name].size;
  mockCache[name].index++;
  const nextOffset = mockCache[name].index * mockCache[name].chunkSize;
  //Mock server response
  return {
    data: nextOffset >= size ? size : nextOffset,
  };
};

export const completeFn = async (data) => {
  mockCache[data.name] = {};
};

export const FILE_SIZE = 1024 * 1024 * 20;
export const FILE_NAME = 'test-file-name.png';
export const FILE_TYPE = 'image/png';
export const FILE_ID = Math.random().toString();

export const generateMockWrapperFile = (task) => {
  const file = task.file.file;
  return {
    originFile: file,
    id: FILE_ID,
    local: {
      type: 'local',
      value: {
        filename: file.name,
        fileId: FILE_ID,
        fileSize: file.size,
      },
    },
    name: task.symbol,
    task,
    getStatus: () => task.status,
    error: null,
  };
};

export const triggerUploadClick = (dom) => {
  const target = dom.find('input');
  target.simulate('click');
  return target;
};

export const uploadTask = (dom) => {
  const target = dom.find('.chunk-upload-list-item button');
  target.at(0).simulate('click');
  return target;
};

export const stopTask = (dom) => {
  const target = dom.find('.chunk-upload-list-item button');
  target.at(0).simulate('click');
  return target;
};

export const deleteTask = (dom) => {
  const target = dom.find('.chunk-upload-list-item button');
  target.at(1).simulate('click');
  return target;
};

export const previewTask = (dom) => {
  const target = dom.find('.chunk-upload-list-item button');
  target.at(2).simulate('click');
  return target;
};
