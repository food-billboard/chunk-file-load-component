import React, { memo, CSSProperties, useMemo } from 'react';
import { DropzoneState } from 'react-dropzone';
import { pick, merge } from 'lodash-es';
import { UploadProps, ViewType } from '@/Upload';
import ListFile from './ListFile';
import CardFile from './CardFile';

export interface ContainerProps
  extends Pick<
    DropzoneState,
    | 'isFocused'
    | 'isDragActive'
    | 'isDragAccept'
    | 'isDragReject'
    | 'isFileDialogActive'
  > {
  style?: CSSProperties;
  className?: string;
  locale?: UploadProps['locale'];
  root: ReturnType<DropzoneState['getRootProps']>;
  input: ReturnType<DropzoneState['getInputProps']>;
}

const Container = memo(
  (
    props: {
      viewType: ViewType;
      containerRender?: UploadProps['containerRender'];
      maxFiles?: number;
      currentFiles: number;
    } & ContainerProps,
  ) => {
    const { viewType, containerRender, maxFiles, currentFiles, ...nextProps } =
      props;

    const isLimit = useMemo(() => {
      if (maxFiles === undefined) return false;
      return maxFiles >= currentFiles;
    }, [maxFiles]);

    if (containerRender) {
      let params: any = pick(nextProps, [
        'isDragAccept',
        'isDragActive',
        'isDragReject',
        'isFileDialogActive',
        'isFocused',
        'locale',
      ]);
      params = merge({}, params, {
        isLimit,
      });
      return <>{containerRender(params as any)}</>;
    }

    if (isLimit) return <span></span>;

    switch (viewType) {
      case 'list':
        return <ListFile {...nextProps} />;
      case 'card':
        return <CardFile {...nextProps} />;
      default:
        return <span></span>;
    }
  },
);

export default Container;
