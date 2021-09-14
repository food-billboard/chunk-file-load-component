import React, {
  memo,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import Progress from '../Progress';
import ActionModal from './Action';
import { UploadContext, WrapperFile, UploadProps } from '../../../index';
import Icon from '../IconRender';
import {
  CancelMethod,
  UploadMethod,
  StopMethod,
  PreviewMethod,
} from '../index';
import { useProgress } from '../../../utils';
import './index.less';

const ViewItem = memo(
  (
    props: {
      value: WrapperFile;
      onCancel: CancelMethod;
      onUpload: UploadMethod;
      onStop: StopMethod;
      onPreview: PreviewMethod;
      itemRender: any;
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
      itemRender,
      onPreview,
    } = props;
    const { task, local, id, name } = value;
    const progressInfo = useProgress(name);
    const [complete, total, current] = progressInfo;

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

    const node = (
      <div className={'chunk-upload-card-item'}>
        <Icon iconRender={iconRender} file={value} viewType={viewType!} />
        <Progress
          file={value}
          onChange={onProgressChange}
          className="chunk-upload-card-item-progress"
          style={{
            flexDirection: 'column',
            width: '100%',
            visibility: isComplete ? 'hidden' : 'visible',
          }}
          showInfo={false}
          strokeWidth={5}
          progress={progressInfo}
        />
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
          onPreview={onPreview}
        />
      </div>
    );

    if (itemRender)
      return itemRender(node, {
        complete,
        current,
        total,
        status: task?.status,
      });
    return node;
  },
);

export default ViewItem;
