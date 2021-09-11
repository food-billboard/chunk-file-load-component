import { DropzoneOptions } from 'react-dropzone';
import { noop } from 'lodash-es';

export const DEFAULT_DROP_PROPS: Partial<DropzoneOptions> = {};

export const DEFAULT_UN_COMPLETE_FILE = {
  name: Symbol(Date.now().toString()),
  getStatus: noop,
};

export const DEFAULT_COMPLETE_FILE = {
  getStatus: () => 4,
};

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
