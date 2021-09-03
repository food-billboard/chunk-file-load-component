import React, {
  forwardRef,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Modal, Empty } from 'antd';
import { get } from 'lodash-es';
import { WrapperFile, UploadProps, ViewType } from '@/Upload';
import { IMAGE_FALLBACK } from '@/utils';
import './index.less';

export interface PreviewModalRef {
  open: () => void;
}

export interface PreviewProps {
  value: WrapperFile;
  viewType: ViewType;
  previewFile: UploadProps['previewFile'];
}

const PreviewModal = memo(
  forwardRef<PreviewModalRef, PreviewProps>((props, ref) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [customPreview, setCustomPreview] = useState<ReactNode | false>();

    const { value, previewFile, viewType } = props;
    const preview = get(value, 'local.value.preview');

    const fetchPreviewFile = useCallback(
      async (
        value: WrapperFile,
        previewFile: UploadProps['previewFile'],
        viewType: ViewType,
      ) => {
        let result: false | ReactNode = false;
        if (previewFile) result = await previewFile?.(value, viewType);
        setCustomPreview(result);
      },
      [],
    );

    const open = useCallback(() => {
      setVisible(true);
    }, []);

    useImperativeHandle(
      ref,
      () => {
        return {
          open,
        };
      },
      [],
    );

    useEffect(() => {
      fetchPreviewFile(value, previewFile, viewType);
    }, [value, viewType, previewFile]);

    if (customPreview !== false && customPreview !== undefined)
      return <>{customPreview}</>;

    return (
      <Modal
        visible={visible}
        footer={null}
        onCancel={setVisible.bind(null, false)}
      >
        <img
          className="chunk-upload-preview-image"
          src={preview || IMAGE_FALLBACK}
        />
      </Modal>
    );
  }),
);

export default PreviewModal;
