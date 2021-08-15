import { CSSProperties, ReactNode, ReactElement } from 'react';
import { DropzoneOptions } from 'react-dropzone';
import {
  TWrapperTask,
  Ttask,
  Upload,
  ECACHE_STATUS,
} from 'chunk-file-upload/src';

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
};

export type ViewType = 'card' | 'list' | 'view-card';

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
  defaultValue?: string | string[] | WrapperFile | WrapperFile[];
  value?: UploadProps['defaultValue'];
  onChange?: (value: WrapperFile[]) => void;
  onRemove?: (task: WrapperFile) => boolean | Promise<boolean>;

  style?: CSSProperties;
  className?: string;

  viewStyle?: CSSProperties;
  viewClassName?: string;
  viewType?: ViewType;
  iconRender?: (file: TWrapperTask, viewType: ViewType) => ReactNode;
  itemRender?: (
    originNode: ReactElement,
    file: WrapperFile,
    fileList: WrapperFile[],
    actions: { preview: Function; remove: Function },
  ) => ReactNode;
  showUploadList?:
    | boolean
    | {
        showPreviewIcon?: boolean;
        showRemoveIcon?: boolean;
        removeIcon?: ReactNode | ((file: WrapperFile) => ReactNode);
      };
  containerRender?: (action: {
    isDragAccept: boolean;
    isDragActive: boolean;
    isDragReject: boolean;
    isFocused: boolean;
    isFileDialogActive: boolean;
  }) => ReactNode;

  immediately?: boolean;

  directory?: boolean;

  actionUrl?: string;
  method?: [string | false, string, string | false];
  headers?: [object | false, object | false, object | false];
  withCredentials?: boolean;
}

export interface UploadInstance {
  getTask?: Upload['getTask'];
}

export interface ViewFileProps
  extends Pick<
    UploadProps,
    'viewType' | 'showUploadList' | 'iconRender' | 'itemRender' | 'onRemove'
  > {
  instance: Upload;
  value: WrapperFile[];
  className?: string;
  style?: CSSProperties;
  onChange: (files: WrapperFile[]) => void;
}

export interface UploadContextType {
  instance: Upload;
}

export type FileTaskProgress = Map<Symbol, Required<TWrapperTask['process']>>;
