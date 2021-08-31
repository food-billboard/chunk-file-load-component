import React, { memo, CSSProperties } from 'react';
import {
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

export const DEFAULT_ICON = FileTwoTone;

const FileImageTwoTone = memo(
  (props: { className?: string; style?: CSSProperties; iconRender?: any }) => {
    return <div></div>;
  },
);

const IconMap = {
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

export default IconMap;

// folder: FolderOutlined
