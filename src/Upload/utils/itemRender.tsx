import React, { ReactElement } from 'react';
import { ECACHE_STATUS } from 'chunk-file-upload';
import { ViewDetailProps } from '../components/ViewFile';
import { WrapperFile } from '../type';

function itemRender(
  props: ViewDetailProps,
  file: WrapperFile,
  files: WrapperFile[],
) {
  const { itemRender, onCancel, onStop, onUpload } = props;
  if (!itemRender) return false;
  return function (
    node: ReactElement,
    progress: Partial<{
      complete: number;
      current: number;
      total: number;
      status: ECACHE_STATUS;
    }>,
  ) {
    return itemRender(
      node,
      file,
      files,
      {
        preview() {
          return file.local?.value?.preview;
        },
        cancel: onCancel.bind(null, file),
        stop: onStop.bind(null, file),
        upload: onUpload.bind(null, file),
      },
      progress,
    );
  };
}

export default itemRender;
