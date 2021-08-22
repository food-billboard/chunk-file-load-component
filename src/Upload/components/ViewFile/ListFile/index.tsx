import React, { memo, useCallback, useMemo, useState, useContext } from 'react';
import {
  DeleteOutlined,
  UploadOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import Icon from '../IconRender';
import Progress from '../Progress';
import { UploadContext } from '@/Upload';
import { WrapperFile, UploadProps } from '@/Upload/type';
import {
  CancelMethod,
  UploadMethod,
  StopMethod,
  ViewDetailProps,
} from '../index';
import './index.less';
export interface NormalViewItemProps {
  value: WrapperFile;
}

const ViewItem = (props: {
  value: WrapperFile;
  showUploadList: UploadProps['showUploadList'];
  onCancel: CancelMethod;
  onUpload: UploadMethod;
  onStop: StopMethod;
  iconRender: UploadProps['iconRender'];
  viewType: UploadProps['viewType'];
}) => {
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);
  const [isDealing, setIsDealing] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const { instance } = useContext(UploadContext);

  const { value, viewType, onCancel, onUpload, onStop, iconRender } = props;
  const { task, local, id } = value;

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

  return (
    <li className={'chunk-upload-list-item'}>
      <Icon
        className={'chunk-upload-list-item-icon'}
        iconRender={iconRender}
        file={value}
        viewType={viewType!}
      />
      <div className="chunk-upload-list-item-info">
        <Progress file={value} onChange={onProgressChange} />
        <span>{local?.value?.filename || local?.value?.fileId || id}</span>
      </div>
      {!isComplete && (
        <Button loading={cancelLoading} type="link" icon={uploadButtonAction} />
      )}
      <Button
        loading={cancelLoading}
        type="link"
        icon={<DeleteOutlined onClick={handleCancel} />}
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
  } = props;

  const list = useMemo(() => {
    return value.map((item) => {
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
        />
      );
    });
  }, [value]);

  return <ul className={'chunk-upload-list'}>{list}</ul>;
});

export default ListFile;
