import React, {
  memo,
  useCallback,
  useMemo,
  useState,
  useContext,
  useRef,
  useEffect,
} from 'react';
import {
  DeleteOutlined,
  UploadOutlined,
  PauseCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import classnames from 'classnames';
import { Button } from 'antd';
import Icon from '../IconRender';
import Progress from '../Progress';
import PreviewModal, { PreviewModalRef } from '../../Preview';
import { UploadContext, WrapperFile, UploadProps } from '@/Upload';
import {
  CancelMethod,
  UploadMethod,
  StopMethod,
  ViewDetailProps,
  actionIconPerformance,
} from '../index';
import { itemRender, useProgress } from '@/Upload/utils';
import './index.less';
export interface NormalViewItemProps {
  value: WrapperFile;
}

type ViewItemProps = {
  value: WrapperFile;
  onCancel: CancelMethod;
  onUpload: UploadMethod;
  onStop: StopMethod;
} & Pick<
  UploadProps,
  'showUploadList' | 'iconRender' | 'previewFile' | 'viewType'
>;

const ViewItem = (
  props: ViewItemProps & {
    itemRender: any;
  },
) => {
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);
  const [isDealing, setIsDealing] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const { instance } = useContext(UploadContext);
  const previewModalRef = useRef<PreviewModalRef>(null);

  const {
    value,
    viewType = 'list',
    onCancel,
    onUpload,
    onStop,
    iconRender,
    previewFile,
    showUploadList,
    itemRender,
  } = props;
  const { task, local, id, error, name } = value;
  const progressInfo = useProgress(name);
  const [complete, total, current] = progressInfo;

  const handleStop = useCallback(() => {
    onStop(value);
  }, [value, onStop]);

  const handleUpload = useCallback(async () => {
    await onUpload(value);
  }, [value, onUpload]);

  const handleCancel = useCallback(async () => {
    setCancelLoading(true);
    const result = await onCancel?.(value);
    !result && setCancelLoading(false);
  }, [value, onCancel]);

  const uploadButtonAction = useCallback(
    (uploadIcon: any, stopIcon: any) => {
      if (isDealing) {
        return stopIcon || <PauseCircleOutlined />;
      }
      return uploadIcon || <UploadOutlined />;
    },
    [isDealing],
  );

  const onProgressChange = useCallback(() => {
    const isDealing = !!task?.tool.file.isTaskDealing(task);
    const isComplete = !!task?.tool.file.isTaskComplete(task);
    setIsDealing(isDealing);
    setIsComplete(isComplete);
  }, [task, instance]);

  const onPreview = useCallback(() => {
    previewModalRef.current?.open();
  }, []);

  const actionRender = useMemo(() => {
    if (!showUploadList) return null;
    const {
      uploadIconNode,
      uploadShow,
      stopIconNode,
      deleteShow,
      deleteIconNode,
      previewIconNode,
      previewShow,
    } = actionIconPerformance(showUploadList, value);
    return (
      <>
        {uploadShow && (
          <Button
            danger={!!error}
            style={{ visibility: isComplete ? 'hidden' : 'visible' }}
            loading={cancelLoading}
            type="link"
            onClick={isDealing ? handleStop : handleUpload}
            icon={uploadButtonAction(uploadIconNode, stopIconNode)}
          />
        )}
        {deleteShow && (
          <Button
            loading={cancelLoading}
            type="link"
            danger={!!error}
            onClick={handleCancel}
            icon={deleteIconNode || <DeleteOutlined />}
          />
        )}
        {previewShow && (
          <Button
            loading={cancelLoading}
            type="link"
            danger={!!error}
            onClick={onPreview}
            icon={previewIconNode || <EyeOutlined />}
            disabled={!value.local?.value?.preview}
          />
        )}
      </>
    );
  }, [
    error,
    isComplete,
    cancelLoading,
    handleCancel,
    value,
    onPreview,
    uploadButtonAction,
    showUploadList,
    isDealing,
  ]);

  useEffect(() => {
    setIsComplete(value.local?.type === 'url');
  }, [value]);

  const node = (
    <li className={'chunk-upload-list-item'}>
      <Icon
        className={'chunk-upload-list-item-icon'}
        iconRender={iconRender}
        file={value}
        viewType={viewType!}
      />
      <div
        className={classnames('chunk-upload-list-item-info', {
          'chunk-upload-list-item-info-error': !!error,
        })}
      >
        <Progress
          file={value}
          onChange={onProgressChange}
          progress={progressInfo}
        />
        <span>{local?.value?.filename || local?.value?.fileId || id}</span>
      </div>
      {actionRender}
      <PreviewModal
        ref={previewModalRef}
        value={value}
        previewFile={previewFile}
        viewType={viewType}
      />
    </li>
  );

  if (itemRender)
    return itemRender(node, {
      current,
      total,
      complete,
      status: task?.status,
    });

  return node;
};

const ListFile = memo((props: ViewDetailProps) => {
  const {
    value,
    showUploadList,
    onCancel,
    onUpload,
    onStop,
    iconRender,
    viewType,
    style,
    className,
  } = props;

  const list = useMemo(() => {
    return value.map((item) => {
      const result = itemRender(props, item, value);
      return (
        <ViewItem
          value={item}
          key={item.id}
          showUploadList={showUploadList}
          onCancel={onCancel}
          onUpload={onUpload}
          onStop={onStop}
          iconRender={iconRender}
          viewType={viewType}
          itemRender={result}
        />
      );
    });
  }, [value]);

  return (
    <aside style={style} className={className}>
      <ul className={'chunk-upload-list'}>{list}</ul>
    </aside>
  );
});

export default ListFile;
