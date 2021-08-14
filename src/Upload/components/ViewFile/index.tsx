import React, { memo, useCallback, useMemo, useState } from 'react';
import classnames from 'classnames';
import { TWrapperTask } from 'chunk-file-upload/src';
import Card from './CardFile';
import List from './ListFile';
import ViewCard from './ViewListFile';
import { ViewFileProps, WrapperFile } from '@/Upload/type';
import { withTry } from '@/utils';
import styles from '../../index.less';

export type CancelMethod = (task: WrapperFile) => Promise<boolean>;
export type UploadMethod = (task: WrapperFile) => void;
export type StopMethod = UploadMethod;
export type ViewDetailProps = Omit<
  ViewFileProps,
  'viewType' | 'instance' | 'onRemove' | 'onChange'
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
    ...nextProps
  } = props;

  const onCancel: CancelMethod = useCallback(
    async (task) => {
      if (onRemove) {
        const [cancel, isCancel] = await withTry(onRemove)(task);
        if (!!cancel || isCancel === false) return false;
      }
      const { task: fileTask, local } = task;
      if (fileTask) {
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
      const newValue = nextProps.value.filter(
        (item) => item.local?.value?.fileId !== local?.value?.fileId,
      );
      onChange(newValue);
      return true;
    },
    [instance, nextProps.value, onChange, onRemove],
  );

  const onStop: StopMethod = useCallback((task) => {}, []);

  const onUpload: UploadMethod = useCallback((task) => {}, []);

  const viewProps = useMemo(() => {
    return {
      style: style || {},
      className: classnames(styles['chunk-upload-list'], className),
    };
  }, [className, style]);

  const container = useMemo(() => {
    const props = {
      ...nextProps,
      onCancel,
      onStop,
      onUpload,
    };
    switch (viewType) {
      case 'card':
        return <Card {...props} />;
      case 'list':
        return <List {...props} />;
      case 'view-card':
        return <ViewCard {...props} />;
      default:
        return <span></span>;
    }
  }, [viewType, nextProps, onCancel, onStop, onUpload]);

  return <aside {...viewProps}>{container}</aside>;
});
