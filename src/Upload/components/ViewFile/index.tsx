import React, { memo, useCallback, useContext, useMemo } from 'react';
import Card from './CardFile';
import List from './ListFile';
import {
  ViewFileProps,
  WrapperFile,
  UploadProps,
  UploadContext,
} from '../../index';
import { withTry } from '../../../utils';
import { isUploaded } from '../../utils';

export type CancelMethod = (task: WrapperFile) => Promise<boolean>;
export type UploadMethod = (task: WrapperFile) => Promise<void>;
export type StopMethod = (task: WrapperFile) => void;
export type ViewDetailProps = Omit<
  ViewFileProps,
  'instance' | 'onRemove' | 'onChange'
> & {
  onCancel: CancelMethod;
  onUpload: UploadMethod;
  onStop: StopMethod;
};

export const actionIconPerformance = (
  showUploadList: UploadProps['showUploadList'],
  value: WrapperFile,
) => {
  let previewShow = true;
  let previewIconNode: any = null;
  let uploadShow = true;
  let uploadIconNode: any = null;
  let deleteShow = true;
  let deleteIconNode: any = null;
  let stopIconNode: any = null;
  if (typeof showUploadList === 'object') {
    const {
      showPreviewIcon,
      showRemoveIcon,
      showUploadIcon,
      previewIcon,
      removeIcon,
      uploadIcon,
      stopIcon,
    } = showUploadList;
    previewShow = !!showPreviewIcon || !!previewIcon;
    previewIconNode =
      !!previewShow &&
      (typeof previewIcon === 'function' ? previewIcon(value) : previewIcon);
    uploadShow = !!showUploadIcon || !!uploadIcon;
    uploadIconNode =
      !!uploadShow &&
      (typeof uploadIcon === 'function' ? uploadIcon(value) : uploadIcon);
    stopIconNode =
      !!uploadShow &&
      (typeof stopIcon === 'function' ? stopIcon(value) : stopIcon);
    deleteShow = !!showRemoveIcon || !!removeIcon;
    deleteIconNode =
      !!deleteShow &&
      (typeof removeIcon === 'function' ? removeIcon(value) : removeIcon);
  }
  return {
    previewShow,
    previewIconNode,
    uploadShow,
    uploadIconNode,
    deleteShow,
    deleteIconNode,
    stopIconNode,
  };
};

export default memo((props: ViewFileProps) => {
  const { viewType, onChange, onRemove, instance, value, ...nextProps } = props;
  const { setValue } = useContext(UploadContext);

  const onCancel: CancelMethod = useCallback(
    async (task) => {
      if (onRemove) {
        const [cancel, isCancel] = await withTry(onRemove)(task);
        if (!!cancel || isCancel === false) return false;
      }
      const { local, error } = task;
      if (!isUploaded(task)) {
        const fileTask = task.task!;
        let result = [];
        if (fileTask.tool.file.isFileUploadStart()) {
          result = instance.cancel(fileTask.symbol);
        } else {
          result = instance.cancelAdd(fileTask.symbol);
        }
        if (!result.length && !error) {
          console.warn(
            'the task is not cancel, please check whether this task is reasonable',
          );
        }
      }
      const unCancelValue = value.filter(
        (item) => item.local?.value?.fileId !== local?.value?.fileId,
      );
      onChange(unCancelValue);
      return true;
    },
    [instance, value, onChange, onRemove],
  );

  const onStop: StopMethod = useCallback(
    (task) => {
      if (!isUploaded(task)) {
        const fileTask = task.task!;
        const result = instance.stop(fileTask.symbol);
        if (!result.length) {
          console.warn(
            'the task is not stop, please check whether this task is reasonable',
          );
        }
      }
    },
    [instance],
  );

  const onUpload: UploadMethod = useCallback(
    async (task) => {
      if (!isUploaded(task)) {
        const fileTask = task.task!;
        let result = [];
        const { error } = task;
        if (task.task?.tool.file.isStop(task.task)) {
          result = instance.start(fileTask.symbol);
        } else if (!error) {
          result = instance.deal(fileTask.symbol);
        } else if (task.task) {
          setValue(
            (prev: WrapperFile[]) => {
              return prev.map((item) => {
                if (item.id !== task.id) return item;
                return {
                  ...item,
                  error: null,
                };
              });
            },
            () => {},
          );
          result = instance.uploading(task.task);
        }
        if (!result.length) {
          console.warn(
            'the task is not start upload, please check whether this task is reasonable',
          );
        }
      }
    },
    [instance, setValue],
  );

  const container = useMemo(() => {
    const props = {
      ...nextProps,
      viewType,
      onCancel,
      onStop,
      onUpload,
    };
    switch (viewType) {
      case 'card':
        return <Card {...props} value={value} />;
      case 'list':
        return <List {...props} value={value} />;
      default:
        return <span></span>;
    }
  }, [viewType, nextProps, onCancel, onStop, onUpload, value]);

  return container;
});
