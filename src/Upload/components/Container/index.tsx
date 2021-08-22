import React, { memo, CSSProperties, useMemo } from 'react';
import { DropzoneState } from 'react-dropzone';
import { FileTwoTone } from '@ant-design/icons';
import classnames from 'classnames';
import { UploadProps } from '@/Upload/type';
import './index.less';

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
  containerRender?: UploadProps['containerRender'];
  root: ReturnType<DropzoneState['getRootProps']>;
  input: ReturnType<DropzoneState['getInputProps']>;
}

const Container = memo((props: ContainerProps) => {
  const {
    locale,
    isFocused,
    isDragAccept,
    isDragActive,
    isDragReject,
    isFileDialogActive,
    className,
    input,
    root,
    containerRender,
  } = props;

  const dropzoneClassName = useMemo(() => {
    return classnames(
      'chunk-upload-dropzone',
      {
        'chunk-upload-dropzone-accept': isDragAccept,
        'chunk-upload-dropzone-active': isDragActive,
        'chunk-upload-dropzone-reject': isDragReject,
      },
      className,
    );
  }, [isDragAccept, isDragActive, isDragReject, className]);

  const container = useMemo(() => {
    if (containerRender) {
      return containerRender({
        isDragAccept,
        isDragActive,
        isDragReject,
        isFileDialogActive,
        isFocused,
        locale,
      });
    }
    return (
      <>
        <span className={'chunk-upload-container-icon'}>
          {locale?.containerIcon || (
            <FileTwoTone className={'chunk-upload-container-icon-main'} />
          )}
        </span>
        <span>{locale?.container || '点击或拖拽文件到此处'}</span>
      </>
    );
  }, [
    locale,
    isDragAccept,
    isDragActive,
    isDragReject,
    isFileDialogActive,
    isFocused,
  ]);

  return (
    <div className={dropzoneClassName} {...root}>
      <input {...input} />
      {container}
    </div>
  );
});

export default Container;
