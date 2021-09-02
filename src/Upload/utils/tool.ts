import { TWrapperTask } from 'chunk-file-upload/src';
import { merge } from 'lodash-es';
import { nanoid } from 'nanoid';
import { UploadProps, WrapperFile, PartialWrapperFile } from '../type';
import { DEFAULT_COMPLETE_FILE, DEFAULT_UN_COMPLETE_FILE } from '../constants';

export const generateRemoteTask = (url: string): WrapperFile => {
  return {
    ...DEFAULT_COMPLETE_FILE,
    id: nanoid(),
    local: {
      type: 'url',
      value: {
        fileId: url,
      },
    },
  } as WrapperFile;
};

export const mergeDefaultTask = (task: PartialWrapperFile): WrapperFile => {
  if (task.local?.type === 'url') {
    return merge({}, DEFAULT_COMPLETE_FILE, task, {
      id: nanoid(),
    }) as WrapperFile;
  }
  return merge({}, DEFAULT_UN_COMPLETE_FILE, task, {
    getTask: () => task.task?.status,
    id: nanoid(),
  }) as WrapperFile;
};

export const propsValueFormat = (value: UploadProps['defaultValue']) => {
  let formatValue: any[] = [];
  if (!value) return [];
  if (!Array.isArray(value)) {
    formatValue = [value];
  } else {
    formatValue = value;
  }
  return formatValue.map((item) => {
    if (typeof item === 'string') {
      return generateRemoteTask(item);
    }
    return mergeDefaultTask(item);
  });
};

export const isUploaded = (task: WrapperFile) => {
  return (
    task.local?.type === 'url' ||
    !task.task ||
    task.task.tool.file.isTaskComplete(task.task)
  );
};

export const createPreview = (file: File, task?: TWrapperTask) => {
  const type = file.type;
  if (type.startsWith('image/')) return URL.createObjectURL(file);
  return '';
};
