import React, { CSSProperties, memo, useMemo } from 'react';
import classnames from 'classnames';
import { merge } from 'lodash-es';
import FileImageTwoTone from '@ant-design/icons/FileImageTwoTone';
import FileMarkdownTwoTone from '@ant-design/icons/FileMarkdownTwoTone';
import FilePdfTwoTone from '@ant-design/icons/FilePdfTwoTone';
import FilePptTwoTone from '@ant-design/icons/FilePptTwoTone';
import FileTextTwoTone from '@ant-design/icons/FileTextTwoTone';
import FileUnknownTwoTone from '@ant-design/icons/FileUnknownTwoTone';
import FileWordTwoTone from '@ant-design/icons/FileWordTwoTone';
import FileZipTwoTone from '@ant-design/icons/FileZipTwoTone';
import FolderOutlined from '@ant-design/icons/FolderOutlined';
import VideoCameraTwoTone from '@ant-design/icons/VideoCameraTwoTone';
import FileOutlined from '@ant-design/icons/FileOutlined';
import FileTwoTone from '@ant-design/icons/FileTwoTone';
import IconListMap, {
  DEFAULT_ICON as DEFAULT_LIST_ICON,
  formatType as listFormatType,
} from './iconListMap';
import IconCardMap, { DEFAULT_ICON as DEFAULT_CARD_ICON } from './iconCardMap';
import { UploadProps, ViewType, WrapperFile } from '../../../type';
import './index.less';

export interface IconProps extends Pick<UploadProps, 'iconRender'> {
  style?: CSSProperties;
  className?: string;
  file: WrapperFile;
  viewType: ViewType;
  onClick?: (e: any) => void;
}

const DefaultIconMap = {
  image: FileImageTwoTone,
  video: VideoCameraTwoTone,
  markdown: FileMarkdownTwoTone,
  pdf: FilePdfTwoTone,
  ppt: FilePptTwoTone,
  text: FileTextTwoTone,
  unknown: FileUnknownTwoTone,
  word: FileWordTwoTone,
  zip: FileZipTwoTone,
};

const DEFAULT_SET_ICON = FileTwoTone;

const Icon = memo((props: IconProps) => {
  const { iconRender, file, viewType, className, style } = props;

  const fileType: any = useMemo(() => {
    const type = file.task?.tool.file.getFileType(file.task);
    return listFormatType(type);
  }, [file]);

  const IconMap = useMemo(() => {
    switch (viewType) {
      case 'card':
        return merge({}, DefaultIconMap, IconCardMap);
      case 'list':
      default:
        return merge({}, DefaultIconMap, IconListMap);
    }
  }, []);

  const DEFAULT_ICON = useMemo(() => {
    switch (viewType) {
      case 'card':
        return DEFAULT_CARD_ICON || DEFAULT_SET_ICON;
      case 'list':
      default:
        return DEFAULT_LIST_ICON || DEFAULT_SET_ICON;
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
