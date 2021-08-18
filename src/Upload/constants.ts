import { DropzoneOptions } from 'react-dropzone';

export const DEFAULT_DROP_PROPS: Partial<DropzoneOptions> = {};

export const LIFE_CYCLE_ENUM = [
  'beforeRead',
  'reading',
  'beforeCheck',
  'afterCheck',
  'uploading',
  'afterStop',
  'afterCancel',
  'beforeComplete',
  'afterComplete',
  'retry',
];
