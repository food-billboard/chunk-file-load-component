import React, { ReactElement } from 'react';
import { ViewDetailProps } from '../components/ViewFile';
import { WrapperFile } from '../type';

function itemRender(
  props: ViewDetailProps,
  file: WrapperFile,
  files: WrapperFile[],
) {
  const { itemRender, onCancel, onStop, onUpload } = props;
  if (!itemRender) return false;
  return function (node: ReactElement) {
    return itemRender(node, file, files, {
      preview() {
        return file.local?.value?.preview;
      },
      cancel: onCancel.bind(null, file),
      stop: onStop.bind(null, file),
      upload: onUpload.bind(null, file),
    });
  };
}

export default itemRender;
