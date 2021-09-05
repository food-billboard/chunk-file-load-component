import React, { memo, useMemo } from 'react';
import { FileTwoTone } from '@ant-design/icons';
import classnames from 'classnames';
import { ContainerProps } from '../index';
import './index.less';

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
  } = props;

  const dropzoneClassName = useMemo(() => {
    return classnames(
      'chunk-upload-dropzone-list',
      {
        'chunk-upload-dropzone-accept': isDragAccept,
        'chunk-upload-dropzone-active': isDragActive,
        'chunk-upload-dropzone-reject': isDragReject,
      },
      className,
    );
  }, [isDragAccept, isDragActive, isDragReject, className]);

  const container = useMemo(() => {
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
