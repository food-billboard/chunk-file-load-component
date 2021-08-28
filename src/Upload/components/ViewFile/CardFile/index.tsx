import React, { memo, useMemo, useState, useContext, useCallback } from 'react';
import { Button } from 'antd';
import classnames from 'classnames';
import {
  PauseCircleOutlined,
  UploadOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import Icon from '../IconRender';
import Progress from '../Progress';
import { UploadContext, WrapperFile, UploadProps } from '@/Upload';
import { itemRender } from '@/Upload/utils';
import {
  ViewDetailProps,
  CancelMethod,
  UploadMethod,
  StopMethod,
} from '../index';
import './index.less';

const ViewItem = memo(
  (props: {
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
      <li className={'chunk-upload-card-item'}>
        {/* <Icon
        className={'chunk-upload-card-item-icon'}
        iconRender={iconRender}
        file={value}
        viewType={viewType!}
      /> */}
        {!isComplete && (
          <Progress
            file={value}
            onChange={onProgressChange}
            className="chunk-upload-card-item-progress"
            style={{ flexDirection: 'column', width: '100%' }}
            showInfo={false}
          />
        )}
        {/* <div className="chunk-upload-card-item-info">
          <Progress file={value} onChange={onProgressChange} />
          <span>{local?.value?.filename || local?.value?.fileId || id}</span>
        </div> */}
        {/* <Button
          style={{ visibility: isComplete ? 'hidden' : 'visible' }}
          loading={cancelLoading}
          type="link"
          icon={uploadButtonAction}
        />
        <Button
          loading={cancelLoading}
          type="link"
          icon={<DeleteOutlined onClick={handleCancel} />}
        /> */}
      </li>
    );
  },
);

const CardFile = memo((props: ViewDetailProps) => {
  const {
    value,
    showUploadList,
    onCancel,
    onUpload,
    onStop,
    iconRender,
    viewType,
    className,
    style,
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
    <ul style={style} className={classnames('chunk-upload-card', className)}>
      {list}
    </ul>
  );
});

export default CardFile;
