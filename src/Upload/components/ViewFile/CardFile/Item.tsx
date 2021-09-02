import React, {
  memo,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import Progress from '../Progress';
import ActionModal from './Action';
import { UploadContext, WrapperFile, UploadProps } from '@/Upload';
import Icon from '../IconRender';
import { CancelMethod, UploadMethod, StopMethod } from '../index';
import './index.less';

const ViewItem = memo(
  (
    props: {
      value: WrapperFile;
      onCancel: CancelMethod;
      onUpload: UploadMethod;
      onStop: StopMethod;
    } & Pick<
      UploadProps,
      'showUploadList' | 'iconRender' | 'viewType' | 'previewFile'
    >,
  ) => {
    const [isDealing, setIsDealing] = useState<boolean>(false);
    const [isComplete, setIsComplete] = useState<boolean>(false);

    const { instance } = useContext(UploadContext);

    const {
      value,
      viewType,
      onCancel,
      onUpload,
      onStop,
      previewFile,
      iconRender,
      showUploadList,
    } = props;
    const { task, local, id } = value;

    const handleStop = useCallback(() => {
      onStop(value);
    }, [value, onStop]);

    const handleUpload = useCallback(async () => {
      await onUpload(value);
    }, [value, onUpload]);

    const onProgressChange = useCallback(() => {
      const isDealing = !!task?.tool.file.isTaskDealing(task);
      const isComplete = !!task?.tool.file.isTaskComplete(task);
      setIsDealing(isDealing);
      setIsComplete(isComplete);
    }, [task, instance]);

    useEffect(() => {
      setIsComplete(value.local?.type === 'url');
    }, [value]);

    return (
      <div className={'chunk-upload-card-item'}>
        <Icon
          className={'chunk-upload-card-item-icon'}
          iconRender={iconRender}
          file={value}
          viewType={viewType!}
        />
        {!isComplete && (
          <Progress
            file={value}
            onChange={onProgressChange}
            className="chunk-upload-card-item-progress"
            style={{ flexDirection: 'column', width: '100%' }}
            showInfo={false}
            strokeWidth={5}
          />
        )}
        <div className="chunk-upload-card-item-info">
          <span>{local?.value?.filename || local?.value?.fileId || id}</span>
        </div>
        <ActionModal
          onCancel={onCancel}
          onStop={handleStop}
          onUpload={handleUpload}
          isDealing={isDealing}
          isComplete={isComplete}
          value={value}
          previewFile={previewFile}
          showUploadList={showUploadList}
          viewType={viewType}
        />
      </div>
    );
  },
);

export default ViewItem;
