import { CSSProperties, ReactNode, ReactElement } from 'react';
import { DropzoneOptions, FileRejection } from 'react-dropzone';
import {
  TWrapperTask,
  Ttask,
  Upload,
  ECACHE_STATUS,
  TRequestType,
} from 'chunk-file-upload';
import { Emitter } from './utils';

export type WrapperFile = {
  originFile?: File;
  id: string;
  local?: {
    type: 'local' | 'url';
    value?: {
      filename?: string;
      fileId?: string;
      fileSize?: number;
      preview?: string;
      [key: string]: any;
    };
  };
  name: Symbol;
  task?: TWrapperTask;
  getStatus: () => ECACHE_STATUS;
  getProgress: () => (TWrapperTask["process"] | undefined)
  error?: any;
};

export type PartialWrapperFile = Partial<WrapperFile>;

export type ViewType = 'card' | 'list';

type PickDropProps =
  | 'accept'
  | 'minSize'
  | 'maxSize'
  | 'maxFiles'
  | 'disabled'
  | 'validator'
  | 'multiple';

export interface UploadProps
  extends Pick<DropzoneOptions, PickDropProps>,
    Partial<Pick<Ttask, 'request' | 'lifecycle'>> {
  defaultValue?: string | string[] | PartialWrapperFile | PartialWrapperFile[];
  value?: UploadProps['defaultValue'];
  onChange?: (value: WrapperFile[]) => void;
  onRemove?: (task: WrapperFile) => boolean | Promise<boolean>;
  onValidator?: (errorFile: FileRejection[], fulfilledFile: File[]) => void;
  onError?: (error: any, task: WrapperFile) => void;

  style?: CSSProperties;
  className?: string;

  viewStyle?: CSSProperties;
  viewClassName?: string;
  viewType?: ViewType;
  iconRender?: (
    file: WrapperFile,
    viewType: ViewType,
    originNode: ReactNode,
  ) => ReactNode;
  itemRender?: (
    originNode: ReactElement,
    file: WrapperFile,
    fileList: WrapperFile[],
    actions: {
      preview: Function;
      upload: Function;
      cancel: Function;
      stop: Function;
    },
    progress: Partial<{
      current: number;
      total: number;
      complete: number;
      status: ECACHE_STATUS;
    }>,
  ) => ReactNode;
  previewFile?: (
    file: WrapperFile,
    viewType: ViewType,
  ) => Promise<ReactNode | false>;
  onPreviewFile?: (file: WrapperFile) => Promise<boolean>;
  showUploadList?:
    | boolean
    | {
        showPreviewIcon?: boolean;
        showRemoveIcon?: boolean;
        showUploadIcon?: boolean;
        removeIcon?: ReactNode | ((file: WrapperFile) => ReactNode);
        previewIcon?: ReactNode | ((file: WrapperFile) => ReactNode);
        uploadIcon?: ReactNode | ((file: WrapperFile) => ReactNode);
        stopIcon?: ReactNode | ((file: WrapperFile) => ReactNode);
      };
  containerRender?: (action: {
    isDragAccept: boolean;
    isDragActive: boolean;
    isDragReject: boolean;
    isFocused: boolean;
    isFileDialogActive: boolean;
    isLimit: boolean;
    locale: UploadProps['locale'];
  }) => ReactNode;

  immediately?: boolean;
  limit?: number;

  actionUrl?: string | [string, string, string?];
  method?: [string | false, string, string | false];
  headers?: [object | false, object | false, object | false];
  withCredentials?: boolean;

  locale?: {
    container?: string | ReactNode;
    containerIcon?: string | ReactNode;
    progress?: {
      pending?: string | ReactNode;
      waiting?: string | ReactNode;
      reading?: string | ReactNode;
      uploading?: string | ReactNode;
      fulfilled?: string | ReactNode;
      rejected?: string | ReactNode;
      cancel?: string | ReactNode;
      stopping?: string | ReactNode;
    };
  };
}

export interface UploadInstanceType {
  getTask?: Upload['getTask'];
  getFiles?: (origin?: boolean) => WrapperFile[];
}

export interface ViewFileProps
  extends Pick<
    UploadProps,
    | 'viewType'
    | 'showUploadList'
    | 'iconRender'
    | 'itemRender'
    | 'onRemove'
    | 'previewFile'
    | 'onPreviewFile'
  > {
  instance: Upload;
  value: WrapperFile[];
  className?: string;
  style?: CSSProperties;
  onChange: (
    files: WrapperFile[] | ((prev: WrapperFile[]) => WrapperFile[]),
  ) => void;
  onCancel: (files: WrapperFile | WrapperFile[]) => void;
}

export interface UploadContextType {
  instance: Upload;
  emitter: Emitter;
  locale: UploadProps['locale'];
  setValue: any;
  getValue: () => WrapperFile[]
}

export type FileTaskProgress = Map<Symbol, Required<TWrapperTask['process']>>;

export type CustomActionRequest = (params: {
  url: string | [string, string, string | undefined];
  instance: Upload;
  method?: [string | false, string, string | false];
  headers?: [object | false, object | false, object | false];
  withCredentials?: boolean;
}) => {
  request: TRequestType;
  [key: string]: any;
};

export type CustomAction = {
  request: CustomActionRequest;
  validator: DropzoneOptions['validator'];
};
