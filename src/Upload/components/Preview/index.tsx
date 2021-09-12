import React, {
  forwardRef,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Modal } from 'antd';
import { get } from 'lodash-es';
import { WrapperFile, UploadProps, ViewType } from '../../index';
import { IMAGE_FALLBACK, withTry } from '../../../utils';
import './index.less';

export interface PreviewModalRef {
  open: (params: { value: WrapperFile }) => void;
}

export interface PreviewProps
  extends Pick<UploadProps, 'onPreviewFile' | 'previewFile'> {
  viewType: ViewType;
}

const PreviewModal = memo(
  forwardRef<PreviewModalRef, PreviewProps>((props, ref) => {
    const [value, setValue] = useState<WrapperFile>();
    const [visible, setVisible] = useState<boolean>(false);
    const [customPreview, setCustomPreview] = useState<ReactNode | false>();

    const { previewFile, viewType, onPreviewFile } = props;
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

    const open = useCallback(
      async ({ value }) => {
        const [, result] = onPreviewFile
          ? await withTry(onPreviewFile)(value)
          : [, true];
        if (result) {
          setValue(value);
          setVisible(true);
        }
      },
      [onPreviewFile],
    );

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
      if (visible && !!value) fetchPreviewFile(value, previewFile, viewType);
    }, [value, viewType, previewFile, visible]);

    if (customPreview !== false && customPreview !== undefined && visible) {
      return <>{customPreview}</>;
    }

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
