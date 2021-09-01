import React, { memo, CSSProperties } from 'react';
import {
  FileImageTwoTone,
  FileMarkdownTwoTone,
  FilePdfTwoTone,
  FilePptTwoTone,
  FileTextTwoTone,
  FileUnknownTwoTone,
  FileWordTwoTone,
  FileZipTwoTone,
  FolderOutlined,
  VideoCameraTwoTone,
  FileOutlined,
  FileTwoTone,
} from '@ant-design/icons';
import classnames from 'classnames';
import { get } from 'lodash-es';
import { className, IMAGE_FALLBACK } from '@/utils';
import { WrapperFile } from '@/Upload';
import './index.less';

export const DEFAULT_ICON = FileTwoTone;

const PREFIX = 'chunk-upload-icon-card';

const FileImageTwoToneNode = memo(
  (props: {
    className?: string;
    style?: CSSProperties;
    iconRender?: any;
    file: WrapperFile;
  }) => {
    const { className: propsClassName, style, file } = props;
    const viewUrl = get(file, 'local.value.preview');
    return (
      <div
        style={style}
        className={classnames(className(PREFIX, 'image'), propsClassName)}
      >
        <FileImageTwoTone />
        <img
          src={viewUrl || IMAGE_FALLBACK}
          className={classnames(className(PREFIX, 'image', 'cover'))}
        />
      </div>
    );
  },
);

const IconMap = {
  image: FileImageTwoToneNode,
  video: VideoCameraTwoTone,
  markdown: FileMarkdownTwoTone,
  pdf: FilePdfTwoTone,
  ppt: FilePptTwoTone,
  text: FileTextTwoTone,
  unknown: FileUnknownTwoTone,
  word: FileWordTwoTone,
  zip: FileZipTwoTone,
};

export default IconMap;

// folder: FolderOutlined
