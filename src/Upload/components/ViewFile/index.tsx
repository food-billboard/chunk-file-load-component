import React, { memo, useCallback, useMemo } from 'react';
import classnames from 'classnames';
import Card from './CardFile';
import List from './ListFile';
import { ViewFileProps, WrapperFile } from '@/Upload/type';
import { withTry } from '@/utils';
import { isUploaded } from '@/Upload/utils';
import styles from '../../index.less';

export type CancelMethod = (task: WrapperFile) => Promise<boolean>;
export type UploadMethod = (task: WrapperFile) => void;
export type StopMethod = UploadMethod;
export type ViewDetailProps = Omit<
  ViewFileProps,
  'instance' | 'onRemove' | 'onChange'
> & {
  onCancel: CancelMethod;
  onUpload: UploadMethod;
  onStop: StopMethod;
};

export default memo((props: ViewFileProps) => {
  const {
    viewType,
    className,
    style,
    onChange,
    onRemove,
    instance,
    value,
    ...nextProps
  } = props;

  const onCancel: CancelMethod = useCallback(
    async (task) => {
      if (onRemove) {
        const [cancel, isCancel] = await withTry(onRemove)(task);
        if (!!cancel || isCancel === false) return false;
      }
      const { local } = task;
      if (!isUploaded(task)) {
        const fileTask = task.task!;
        let result = [];
        if (fileTask.tool.file.isFileUploadStart()) {
          result = instance.cancel(fileTask.symbol);
        } else {
          result = instance.cancelAdd(fileTask.symbol);
        }
        if (!result.length) {
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
    (task) => {
      if (!isUploaded(task)) {
        const fileTask = task.task!;
        let result = [];
        if (task.task?.tool.file.isStop(task.task)) {
          result = instance.start(fileTask.symbol);
        } else {
          result = instance.deal(fileTask.symbol);
        }
        if (!result.length) {
          console.warn(
            'the task is not start upload, please check whether this task is reasonable',
          );
        }
      }
    },
    [instance],
  );

  const viewProps = useMemo(() => {
    return {
      style: style || {},
      className: classnames(styles['chunk-upload-list'], className),
    };
  }, [className, style]);

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

  return <aside {...viewProps}>{container}</aside>;
});
