import React, {
  CSSProperties,
  memo,
  useState,
  useCallback,
  useMemo,
  ReactNode,
  useRef,
} from 'react';
import classnames from 'classnames';
import {
  PauseCircleOutlined,
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { WrapperFile, UploadProps } from '@/Upload';
import PreviewModal, { PreviewModalRef } from '../../Preview';
import { CancelMethod, actionIconPerformance } from '../index';
import { className } from '@/utils';
import { Button } from 'antd';

const ActionModal = memo(
  (props: {
    style?: CSSProperties;
    className?: string;
    onStop: () => void;
    onCancel: CancelMethod;
    onUpload: () => void;
    isDealing: boolean;
    isComplete: boolean;
    value: WrapperFile;
    previewFile: UploadProps['previewFile'];
    showUploadList: UploadProps['showUploadList'];
    viewType: UploadProps['viewType'];
  }) => {
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
    } = props;
    const { error } = value;

    const [cancelLoading, setCancelLoading] = useState<boolean>(false);

    const previewRef = useRef<PreviewModalRef>(null);

    const prefix = 'chunk-upload-action-modal';

    const handleCancel = useCallback(async () => {
      setCancelLoading(true);
      const result = await onCancel?.(value);
      !result && setCancelLoading(false);
    }, [value, onCancel]);

    const onPreview = useCallback(() => {
      previewRef.current?.open();
    }, [previewRef]);

    const uploadButtonAction = useCallback(
      (uploadIcon: any, stopIcon: any) => {
        if (isComplete) return null;
        if (isDealing) {
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
      [isDealing, onUpload, onStop, isComplete, cancelLoading],
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
              onClick={onPreview}
              icon={previewIconNode || <EyeOutlined />}
              loading={cancelLoading}
              type="link"
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
    ]);

    return (
      <div style={style} className={classnames(prefix, className)}>
        {actionRender}
        <PreviewModal
          ref={previewRef}
          value={value}
          previewFile={previewFile}
          viewType={viewType}
        />
      </div>
    );
  },
);

export default ActionModal;
