import React, { CSSProperties, memo, useMemo } from 'react';
import classnames from 'classnames';
import IconListMap, {
  DEFAULT_ICON as DEFAULT_LIST_ICON,
  formatType as listFormatType,
} from './icon.list.map';
import IconCardMap, {
  DEFAULT_ICON as DEFAULT_CARD_ICON,
} from './icon.card.map';
import { UploadProps, ViewType, WrapperFile } from '../../../type';
import './index.less';

export interface IconProps extends Pick<UploadProps, 'iconRender'> {
  style?: CSSProperties;
  className?: string;
  file: WrapperFile;
  viewType: ViewType;
  onClick?: (e: any) => void;
}

const Icon = memo((props: IconProps) => {
  const { iconRender, file, viewType, className, style } = props;

  const fileType: any = useMemo(() => {
    const type = file.task?.tool.file.getFileType(file.task);
    return listFormatType(type);
  }, [file]);

  const IconMap = useMemo(() => {
    switch (viewType) {
      case 'card':
        return IconCardMap;
      case 'list':
      default:
        return IconListMap;
    }
  }, []);

  const DEFAULT_ICON = useMemo(() => {
    switch (viewType) {
      case 'card':
        return DEFAULT_CARD_ICON;
      case 'list':
      default:
        return DEFAULT_LIST_ICON;
    }
  }, []);

  const icon = useMemo(() => {
    const Icon = (IconMap as any)[fileType] || DEFAULT_ICON;
    return (
      <Icon
        style={style}
        className={classnames(
          {
            ['chunk-upload-view-list-icon']: viewType === 'list',
            ['chunk-upload-view-card-icon']: viewType === 'card',
          },
          className,
        )}
        file={file}
      />
    );
  }, [fileType, IconMap, DEFAULT_ICON]);

  if (iconRender) {
    return <>{iconRender(file, viewType, icon)}</>;
  }

  return icon;
});

export default Icon;