import React, { memo, useMemo } from 'react';
import classnames from 'classnames';
import { PlusOutlined } from '@ant-design/icons';
import { ContainerProps } from '../index';
import './index.less';

const CardFileContainer = memo((props: ContainerProps) => {
  const { root, input, className, locale } = props;

  const dropzoneClassName = useMemo(() => {
    return classnames('chunk-upload-dropzone-card', className);
  }, [className]);

  const container = useMemo(() => {
    const prefix = 'chunk-upload-dropzone-card-content';
    return (
      <div className={prefix}>
        <span className={`${prefix}-icon-content`}>
          {locale?.containerIcon || (
            <PlusOutlined className={`${prefix}-icon-content-main`} />
          )}
        </span>
        <span>{locale?.container}</span>
      </div>
    );
  }, [locale]);

  return (
    <div className={dropzoneClassName} {...root}>
      <input {...input} />
      {container}
    </div>
  );
});

export default CardFileContainer;
