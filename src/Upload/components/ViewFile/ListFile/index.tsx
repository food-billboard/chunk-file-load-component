import React, {
  memo,
  useCallback,
  useMemo,
  useState,
  useContext,
  useEffect,
} from 'react';
import {
  DeleteOutlined,
  UploadOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { Upload } from 'chunk-file-upload/src';
import { UploadContext } from '@/Upload';
import { WrapperFile, ViewFileProps, UploadProps } from '@/Upload/type';
import {
  CancelMethod,
  UploadMethod,
  StopMethod,
  ViewDetailProps,
} from '../index';
import { useProgress } from '@/Upload/utils';
import styles from './index.less';
export interface NormalViewItemProps {
  value: WrapperFile;
}

const ViewItem = (props: {
  value: WrapperFile;
  showUploadList: UploadProps['showUploadList'];
  onCancel: CancelMethod;
  onUpload: UploadMethod;
  onStop: StopMethod;
}) => {
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);
  const { instance } = useContext(UploadContext);

  const { value, showUploadList, onCancel, onUpload, onStop } = props;
  const { name, task } = value;
  const [, , progress] = useProgress(name);

  const isStop = !!task?.tool.file.isStop();

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
    if (isStop) {
      return <PauseCircleOutlined onClick={handleStop} />;
    }
    return <UploadOutlined onClick={handleUpload} />;
  }, [isStop, handleUpload, handleStop]);

  return (
    <div>
      {name}
      进度{progress}-----
      <Button loading={cancelLoading} type="link" icon={uploadButtonAction} />
      <Button
        loading={cancelLoading}
        type="link"
        icon={<DeleteOutlined onClick={handleCancel} />}
      />
    </div>
  );
};

const ListFile = memo((props: ViewDetailProps) => {
  const { value, showUploadList, onCancel, onUpload, onStop } = props;

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
        />
      );
    });
  }, [value]);

  return (
    <div className={styles['image-view-item']}>
      <ul>{list}</ul>
    </div>
  );
});

export default ListFile;
