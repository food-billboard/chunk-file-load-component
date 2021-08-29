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
import { CancelMethod } from '../index';

export const LoadingIcon = memo(
  (props: {
    loading?: boolean;
    icon: ReactNode;
    onClick?: any;
    loadingProps?: {
      style?: CSSProperties;
      className?: string;
      onClick?: any;
      [key: string]: any;
    };
  }) => {
    const { loading, icon, loadingProps = {}, onClick } = props;

    if (!!loading) {
      return <LoadingOutlined {...loadingProps} />;
    }

    return <span onClick={onClick}>{icon}</span>;
  },
);

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
    } = props;
    const { task, local, id, error } = value;

    const [cancelLoading, setCancelLoading] = useState<boolean>(false);

    const previewRef = useRef<PreviewModalRef>(null);

    const handleCancel = useCallback(async () => {
      setCancelLoading(true);
      const result = await onCancel?.(value);
      !result && setCancelLoading(false);
    }, [value, onCancel]);

    const onPreview = useCallback(() => {
      previewRef.current?.open();
    }, [previewRef]);

    const uploadButtonAction = useCallback(
      (icon: any) => {
        if (isComplete) return null;
        if (isDealing) {
          return (
            <LoadingIcon
              onClick={onStop}
              icon={icon || <PauseCircleOutlined />}
              loading={cancelLoading}
            />
          );
        }
        return (
          <LoadingIcon
            onClick={onUpload}
            icon={icon || <UploadOutlined />}
            loading={cancelLoading}
          />
        );
      },
      [isDealing, onUpload, onStop, isComplete, cancelLoading],
    );

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
          (typeof previewIcon === 'function'
            ? previewIcon(value)
            : previewIcon);
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
          {uploadShow && uploadButtonAction(uploadIconNode)}
          {deleteShow && (
            <LoadingIcon
              loading={cancelLoading}
              onClick={handleCancel}
              icon={deleteIconNode || <DeleteOutlined />}
            />
          )}
          {previewShow && (
            <LoadingIcon
              onClick={onPreview}
              icon={previewIconNode || <EyeOutlined />}
              loading={cancelLoading}
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
      <div
        style={style}
        className={classnames('chunk-upload-action-modal', className)}
      >
        {actionRender}
        <PreviewModal
          ref={previewRef}
          value={value}
          previewFile={previewFile}
        />
      </div>
    );
  },
);

export default ActionModal;
