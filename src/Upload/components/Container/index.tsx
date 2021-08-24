import React, { memo, CSSProperties } from 'react';
import { DropzoneState } from 'react-dropzone';
import { pick } from 'lodash-es';
import { UploadProps, ViewType } from '@/Upload/type';
import ListFile from './ListFile';
import CardFile from './CardFile';
import ViewListFile from './ViewlistFile';

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
    } & ContainerProps,
  ) => {
    const { viewType, containerRender, ...nextProps } = props;

    if (containerRender) {
      const params = pick(nextProps, [
        'isDragAccept',
        'isDragActive',
        'isDragReject',
        'isFileDialogActive',
        'isFocused',
        'locale',
      ]);
      return <>{containerRender(params as any)}</>;
    }

    switch (viewType) {
      case 'list':
        return <ListFile {...nextProps} />;
      case 'card':
        return <CardFile {...nextProps} />;
      case 'view-card':
        return <ViewListFile {...nextProps} />;
    }
  },
);

export default Container;
