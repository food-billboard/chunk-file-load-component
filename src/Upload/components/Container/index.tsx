import React, { memo, CSSProperties, useMemo } from 'react';
import { DropzoneState } from 'react-dropzone';
import { pick, merge } from 'lodash';
import { UploadProps, ViewType } from '../../index';
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
      currentFiles: number;
      limit?: UploadProps['limit'];
    } & ContainerProps,
  ) => {
    const { viewType, containerRender, currentFiles, limit, ...nextProps } =
      props;

    const isLimit = useMemo(() => {
      if (limit === undefined || !~limit) return false;
      return limit >= currentFiles;
    }, [limit]);

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
      return (
        <span {...nextProps.root}>
          <input {...nextProps.input} />
          {containerRender(params as any)}
        </span>
      );
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
