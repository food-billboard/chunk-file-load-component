import React, { forwardRef, memo, useImperativeHandle, useRef } from 'react';
import { WrapperFile, UploadProps } from '@/Upload';

export interface PreviewModalRef {
  open: () => void;
}

export interface PreviewProps {
  value: WrapperFile;
  previewFile: UploadProps['previewFile'];
}

const PreviewModal = memo(
  forwardRef<PreviewModalRef, PreviewProps>((props, ref) => {
    return <div></div>;
  }),
);

export default PreviewModal;
