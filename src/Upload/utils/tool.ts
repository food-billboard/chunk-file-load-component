import { UploadProps, WrapperFile } from '../type';

export const generateRemoteTask = (url: string) => {
  return {
    local: {
      type: 'url',
      value: url,
    },
  };
};

export const propsValueFormat = (value: UploadProps['defaultValue']) => {
  let formatValue: any[] = [];
  if (!value) return [];
  if (!Array.isArray(value)) formatValue = [value];
  return formatValue.map((item) => {
    if (typeof item === 'string') {
      return generateRemoteTask(item);
    }
    return item;
  });
};

export const isUploaded = (task: WrapperFile) => {
  return task.local?.type === 'url' && !task.task;
};
