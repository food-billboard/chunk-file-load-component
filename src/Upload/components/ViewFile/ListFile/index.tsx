import React, {
  memo,
  useCallback,
  useMemo,
  useState,
  useContext,
  useRef,
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
} from '../index';
import { itemRender } from '@/Upload/utils';
import './index.less';
export interface NormalViewItemProps {
  value: WrapperFile;
}

const ViewItem = (
  props: {
    value: WrapperFile;
    onCancel: CancelMethod;
    onUpload: UploadMethod;
    onStop: StopMethod;
  } & Pick<
    UploadProps,
    'showUploadList' | 'iconRender' | 'previewFile' | 'viewType'
  >,
) => {
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);
  const [isDealing, setIsDealing] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const { instance } = useContext(UploadContext);
  const previewModalRef = useRef<PreviewModalRef>(null);

  const {
    value,
    viewType,
    onCancel,
    onUpload,
    onStop,
    iconRender,
    previewFile,
    showUploadList,
  } = props;
  const { task, local, id, error } = value;

  const handleStop = useCallback(() => {
    onStop(value);
  }, [value, onStop]);

  const handleUpload = useCallback(() => {
    onUpload(value);
  }, [value, onUpload]);

  const handleCancel = useCallback(async () => {
    setCancelLoading(true);
    const result = await onCancel?.(value);
    !result && setCancelLoading(false);
  }, [value, onCancel]);

  const uploadButtonAction = useMemo(() => {
    if (isDealing) {
      return <PauseCircleOutlined onClick={handleStop} />;
    }
    return <UploadOutlined onClick={handleUpload} />;
  }, [isDealing, handleUpload, handleStop]);

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
    let previewShow = true;
    let previewIconNode: any = null;
    let uploadShow = true;
    let uploadIconNode: any = null;
    let deleteShow = true;
    let deleteIconNode: any = null;
    if (!showUploadList) return null;
    if (typeof showUploadList === 'object') {
      const {
        showPreviewIcon,
        showRemoveIcon,
        showUploadIcon,
        previewIcon,
        removeIcon,
        uploadIcon,
      } = showUploadList;
      previewShow = !!showPreviewIcon;
      previewIconNode =
        !!previewShow &&
        (typeof previewIcon === 'function' ? previewIcon(value) : previewIcon);
      uploadShow = !!showUploadIcon;
      uploadIconNode =
        !!uploadShow &&
        (typeof uploadIcon === 'function' ? uploadIcon(value) : uploadIcon);
      deleteShow = !!showRemoveIcon;
      deleteIconNode =
        !!deleteShow &&
        (typeof removeIcon === 'function' ? removeIcon(value) : removeIcon);
    }
    return (
      <>
        {uploadShow && (
          <Button
            danger={!!error}
            style={{ visibility: isComplete ? 'hidden' : 'visible' }}
            loading={cancelLoading}
            type="link"
            icon={uploadIconNode || uploadButtonAction}
          />
        )}
        {deleteShow && (
          <Button
            loading={cancelLoading}
            type="link"
            danger={!!error}
            icon={deleteIconNode || <DeleteOutlined onClick={handleCancel} />}
          />
        )}
        {previewShow && (
          <Button
            loading={cancelLoading}
            type="link"
            danger={!!error}
            icon={previewIconNode || <EyeOutlined onClick={onPreview} />}
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
  ]);

  return (
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
        <Progress file={value} onChange={onProgressChange} />
        <span>{local?.value?.filename || local?.value?.fileId || id}</span>
      </div>
      {actionRender}
      <PreviewModal
        ref={previewModalRef}
        value={value}
        previewFile={previewFile}
      />
    </li>
  );
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
      const node = (
        <ViewItem
          value={item}
          key={item.id}
          showUploadList={showUploadList}
          onCancel={onCancel}
          onUpload={onUpload}
          onStop={onStop}
          iconRender={iconRender}
          viewType={viewType}
        />
      );
      const result = itemRender(props, item, value);
      if (result) return result(node);
      return node;
    });
  }, [value]);

  return (
    <aside style={style} className={className}>
      <ul className={'chunk-upload-list'}>{list}</ul>
    </aside>
  );
});

export default ListFile;
