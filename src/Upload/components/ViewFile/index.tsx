import React, { memo, useCallback, useContext, useMemo, useRef } from 'react';
import { noop } from 'lodash';
import Card from './CardFile';
import List from './ListFile';
import {
  ViewFileProps,
  WrapperFile,
  UploadProps,
  UploadContext,
} from '../../index';
import PreviewModal, { PreviewModalRef } from '../Preview';
import { withTry } from '../../../utils';
import { isUploaded } from '../../utils';

export type CancelMethod = (task: WrapperFile) => Promise<boolean>;
export type UploadMethod = (task: WrapperFile) => Promise<void>;
export type StopMethod = (task: WrapperFile) => void;
export type PreviewMethod = (task: WrapperFile) => void;
export type ViewDetailProps = Omit<
  ViewFileProps,
  'instance' | 'onRemove' | 'onChange' | 'onCancel' | 'onPreviewFile'
> & {
  onCancel: CancelMethod;
  onUpload: UploadMethod;
  onStop: StopMethod;
  onPreview: PreviewMethod;
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
  const {
    viewType,
    onChange,
    onRemove,
    instance,
    value = [],
    onCancel: releasePreviewCache,
    previewFile,
    onPreviewFile,
    ...nextProps
  } = props;
  const { setValue } = useContext(UploadContext);
  const previewModalRef = useRef<PreviewModalRef>(null);

  const onStop: StopMethod = useCallback(
    (task) => {
      if (!isUploaded(task)) {
        const fileTask = task.task!;
        if (!fileTask) return;
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

  const stopActionWhenRequestCancel = useCallback(() => {
    // TODO
    return {
      stop: noop,
      done: noop,
    };
  }, []);

  const onCancel: CancelMethod = useCallback(
    async (task) => {
      if (onRemove) {
        const { stop, done } = stopActionWhenRequestCancel();
        stop();
        const [cancel, isCancel] = await withTry(onRemove)(task);
        if (!!cancel || isCancel === false) return false;
        done();
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
      const unCancelValue = (value: WrapperFile[]) =>
        value.filter(
          (item) => item.local?.value?.fileId !== local?.value?.fileId,
        );
      releasePreviewCache(task);
      setTimeout(onChange.bind(null, unCancelValue), 10);
      return true;
    },
    [instance, onChange, onRemove, releasePreviewCache],
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
          setValue((prev: WrapperFile[]) => {
            return prev.map((item) => {
              if (item.id !== task.id) return item;
              result = instance.uploading(task.task!);
              const [name] = result;
              const newTask = name ? instance.getTask(name) : item.task;
              return {
                ...item,
                get task() {
                  return newTask || item.task;
                },
                getStatus() {
                  return (newTask || item.task)?.status;
                },
                error: null,
              };
            });
          });
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

  const onPreview: PreviewMethod = useCallback(
    (value) => {
      return previewModalRef.current?.open({
        value,
      });
    },
    [previewModalRef],
  );

  const container = useMemo(() => {
    const props = {
      ...nextProps,
      viewType,
      onCancel,
      onStop,
      onUpload,
      onPreview,
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

  return (
    <>
      {container}
      <PreviewModal
        ref={previewModalRef}
        previewFile={previewFile}
        viewType={viewType!}
        onPreviewFile={onPreviewFile}
      />
    </>
  );
});
