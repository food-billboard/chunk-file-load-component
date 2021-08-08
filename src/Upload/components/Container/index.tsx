import React, { memo, CSSProperties } from 'react'
import { 
  DropzoneState
} from 'react-dropzone'

export interface ContainerProps extends Pick<DropzoneState, "isFocused" | "isDragActive" | "isDragAccept" | "isDragReject" | "isFileDialogActive"> {
  style?: CSSProperties
  className?: string 
}

const Container = memo((props: ContainerProps) => {

  return (
    <div>
              <p>Drop the files here ...</p> :
        <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  )

})

export default Container