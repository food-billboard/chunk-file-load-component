import React, { CSSProperties, memo, useMemo } from 'react';
import classnames from 'classnames';
import IconMap, { DEFAULT_ICON, formatType } from './icon.map';
import { UploadProps, ViewType, WrapperFile } from '../../../type';
import styles from './index.less';

export interface IconProps extends Pick<UploadProps, 'iconRender'> {
  style?: CSSProperties;
  className?: string;
  file: WrapperFile;
  viewType: ViewType;
}

const Icon = memo((props: IconProps) => {
  const { iconRender, file, viewType, className, style } = props;

  if (iconRender) {
    return <>{iconRender(file, viewType)}</>;
  }

  const fileType: any = useMemo(() => {
    const type = file.task?.tool.file.getFileType();
    return formatType(type);
  }, [file]);

  const icon = useMemo(() => {
    const Icon = (IconMap as any)[fileType] || DEFAULT_ICON;
    return (
      <Icon
        style={style}
        className={classnames(styles['chunk-upload-view-icon'], className)}
      />
    );
  }, [fileType]);

  return icon;
});

export default Icon;
