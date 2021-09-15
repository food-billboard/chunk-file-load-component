import React, {
  CSSProperties,
  memo,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { Button } from 'antd';
import classnames from 'classnames';
import {
  PauseCircleOutlined,
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { WrapperFile, UploadProps } from '../../../index';
import { CancelMethod, actionIconPerformance, PreviewMethod } from '../index';

const ActionModal = memo(
  (
    props: {
      style?: CSSProperties;
      className?: string;
      onStop: () => void;
      onCancel: CancelMethod;
      onUpload: () => void;
      onPreview: PreviewMethod;
      isDealing: boolean;
      isComplete: boolean;
      value: WrapperFile;
    } & Pick<UploadProps, 'previewFile' | 'showUploadList' | 'viewType'>,
  ) => {
    const {
      showUploadList,
      onStop,
      onCancel,
      onUpload,
      className,
      style,
      isDealing,
      isComplete,
      value,
      previewFile,
      viewType = 'list',
      onPreview,
    } = props;
    const { error } = value;

    const [cancelLoading, setCancelLoading] = useState<boolean>(false);

    const prefix = 'chunk-upload-action-modal';

    const handleCancel = useCallback(async () => {
      setCancelLoading(true);
      const result = await onCancel?.(value);
      !result && setCancelLoading(false);
    }, [value, onCancel]);

    const handlePreview = useCallback(() => {
      return onPreview?.(value);
    }, [onPreview, value]);

    const uploadButtonAction = useCallback(
      (uploadIcon: any, stopIcon: any) => {
        if (isComplete) return null;
        if (isDealing && !error) {
          return (
            <Button
              onClick={onStop}
              icon={stopIcon || <PauseCircleOutlined />}
              loading={cancelLoading}
              type="link"
            />
          );
        }
        return (
          <Button
            onClick={onUpload}
            icon={uploadIcon || <UploadOutlined />}
            loading={cancelLoading}
            type={'link'}
          />
        );
      },
      [isDealing, onUpload, onStop, isComplete, cancelLoading, error],
    );

    const actionRender = useMemo(() => {
      if (!showUploadList) return null;
      const {
        previewShow,
        previewIconNode,
        deleteIconNode,
        deleteShow,
        uploadShow,
        uploadIconNode,
        stopIconNode,
      } = actionIconPerformance(showUploadList, value);
      return (
        <>
          {uploadShow && uploadButtonAction(uploadIconNode, stopIconNode)}
          {deleteShow && (
            <Button
              loading={cancelLoading}
              onClick={handleCancel}
              icon={deleteIconNode || <DeleteOutlined />}
              type="link"
            />
          )}
          {previewShow && (
            <Button
              onClick={handlePreview}
              icon={previewIconNode || <EyeOutlined />}
              loading={cancelLoading}
              type="link"
              disabled={!value.local?.value?.preview && !previewFile}
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
      handlePreview,
      uploadButtonAction,
      showUploadList,
      previewFile,
    ]);

    return (
      <div style={style} className={classnames(prefix, className)}>
        {actionRender}
      </div>
    );
  },
);

export default ActionModal;
