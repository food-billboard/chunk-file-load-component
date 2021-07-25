import React, { memo, forwardRef, useImperativeHandle, useCallback } from 'react'
import { useDropzone, DropzoneOptions } from 'react-dropzone'
import { merge } from 'lodash-es'
import { DEFAULT_DROP_PROPS } from './constants'

type PickDropProps = "accept" | "minSize" | "maxSize" | "maxFiles" | "disabled" | "validator"

export type WrapperFile = {
  originFile?: File 
  local: ""
}

export interface UploadProps extends Pick<DropzoneOptions, PickDropProps> {
  value?: string | string[]
  onChange?: (value: File[]) => void 
}

export interface UploadInstance {

}

const Upload = memo(forwardRef<UploadInstance, UploadProps>((props, ref) => {

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone(merge({}, DEFAULT_DROP_PROPS, {
    onDrop
  }))

  useImperativeHandle(ref, () => {
    return {

    }
  }, [])

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )

}))

export default Upload
