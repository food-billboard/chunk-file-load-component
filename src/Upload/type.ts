import { 
  CSSProperties, ReactNode, 
} from 'react'
import { 
  DropzoneOptions 
} from 'react-dropzone'
import { 
  TWrapperTask, 
  Ttask 
} from 'chunk-file-upload/src'

export type WrapperFile = {
  originFile?: File 
  local?: {
    type: "local" | "url"
    value?: string 
  }
  name: Symbol
  task?: TWrapperTask
  preview?: string 
}

type PickDropProps = "accept" | "minSize" | "maxSize" | "maxFiles" | "disabled" | "validator" | "multiple"

export interface UploadProps extends Pick<DropzoneOptions, PickDropProps>, Partial<Pick<Ttask, "request" | "lifecycle">> {
  defaultValue?: string | string[]
  value?: string | string[]
  onChange?: (value: File[]) => void 
  // onRemove?: (task: TWrapperTask) => (boolean | PromiseFulfilledResult<boolean> | PromiseRejectedResult)

  viewStyle?: CSSProperties
  viewClassName?: string 
  viewType?: "card" | "list" | "view-card"
  iconRender?: (file: TWrapperTask, viewType: UploadProps["viewType"]) => ReactNode
  showUploadList?: boolean 
  containerRender?: (action: {
    isDragAccept: boolean 
    isDragActive: boolean 
    isDragReject: boolean 
    isFocused: boolean 
    isFileDialogActive: boolean 
  }) => ReactNode

  immediately?: boolean 

  director?: boolean 

  actionUrl?: string 
  method?: [string | false, string, string?]
  headers?: [object | false, object | false, object | false]
  withCredentials?: boolean 
}

export interface UploadInstance {

}