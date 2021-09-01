import React, {
  forwardRef,
  memo,
  useCallback,
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

    const { value, previewFile, viewType } = props;
    if (previewFile) return <>{previewFile(value, viewType)}</>;
    const preview = get(value, 'local.value.preview');

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
