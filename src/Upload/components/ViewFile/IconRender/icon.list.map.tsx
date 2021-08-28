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

export const DEFAULT_ICON = FileTwoTone;

const iconValidatorMap = {
  image(type: string) {
    return type.startsWith('image/');
  },
  video(type: string) {
    return type.startsWith('video/');
  },
  markdown(type: string) {
    return type === 'text/markdown';
  },
  pdf(type: string) {
    return type === 'application/pdf';
  },
  ppt(type: string) {
    return (
      type === 'application/vnd.ms-powerpoint' ||
      type ===
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    );
  },
  text(type: string) {
    return type === 'text/plain';
  },
  word(type: string) {
    return (
      type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      type === 'application/msword'
    );
  },
  zip(type: string) {
    return type === 'application/zip';
  },
};

export const formatType = (type: string) => {
  if (!type) return;
  const lowerType = type.toLowerCase();
  let result: any;
  Object.entries(iconValidatorMap).some((item) => {
    const [key, validator] = item;
    if (validator(lowerType)) {
      result = key;
      return true;
    }
    return false;
  });
  return result;
};

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
