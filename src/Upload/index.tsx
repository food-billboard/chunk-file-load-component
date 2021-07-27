import React, { 
  memo, 
  forwardRef, 
  useImperativeHandle, 
  useCallback, 
  CSSProperties, 
  useMemo,
  useState,
  useEffect
} from 'react'
import { useDropzone, DropzoneOptions } from 'react-dropzone'
import { merge } from 'lodash-es'
import classnames from 'classnames'
import { TWrapperTask } from '@/utils/Upload/src'
import { DEFAULT_DROP_PROPS } from './constants'
import styles from './index.less'

type PickDropProps = "accept" | "minSize" | "maxSize" | "maxFiles" | "disabled" | "validator"

export type WrapperFile = {
  originFile?: File 
  local?: {
    type: "local" | "url"
    value?: string 
  }
  task?: TWrapperTask
  preview?: string 
}

export interface UploadProps extends Pick<DropzoneOptions, PickDropProps> {
  value?: string | string[]
  onChange?: (value: File[]) => void 

  viewStyle?: CSSProperties
  viewClassName?: string 
  viewType?: "card" | "list" | "view-card"

  imageView?: boolean 
}

export interface UploadInstance {

}

const Upload = memo(forwardRef<UploadInstance, UploadProps>((props, ref) => {

  const [ files, setFiles ] = useState<WrapperFile[]>([])

  const { viewClassName, viewStyle, imageView, ...nextProps } = useMemo(() => {
    return props 
  }, [props])

  const onDrop: DropzoneOptions["onDrop"] = useCallback((acceptedFiles, fileRejections) => {
    console.log(acceptedFiles, fileRejections, 24444)
    const newFiles = acceptedFiles.map((item: File) => {
      return {
        originFile: item,
        preview: imageView ? URL.createObjectURL(item) : undefined
      }
    })
    setFiles(prev => {
      return [
        ...prev,
        ...newFiles
      ]
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone(merge({}, DEFAULT_DROP_PROPS, {
    onDrop,
    ...nextProps
  }))

  const viewProps = useMemo(() => {
    return {
      style: viewStyle || {},
      className: classnames(styles["chunk-upload-list"], viewClassName)
    }
  }, [viewClassName, viewStyle])

  useImperativeHandle(ref, () => {
    return {

    }
  }, [])

  const dropzoneClassName = useMemo(() => {
    return classnames(styles["chunk-upload-dropzone"], {
      [styles["chunk-upload-dropzone-accept"]]: isDragAccept,
      [styles["chunk-upload-dropzone-active"]]: isDragActive,
      [styles["chunk-upload-dropzone-reject"]]: isDragReject
    })
  }, [isDragAccept, isDragActive, isDragReject])

  const fileDomList = useMemo(() => {
    if(!imageView) return []
    return files.map(item => {
      const {  } = item 
      return (
        <div></div>
      )
    })
  }, [files, imageView])

  useEffect(() => () => {
    files.forEach(file => {
      if(file.preview) URL.revokeObjectURL(file.preview)
    })
  }, [files])

  return (
    <div className={styles["chunk-upload-container"]}>
      <div {...getRootProps({
        className: dropzoneClassName
      })}>
        <input {...getInputProps()} />
        <p>Drop the files here ...</p> :
        <p>Drag 'n' drop some files here, or click to select files</p>
        {/* {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        } */}
      </div>
      {
        !!imageView && (
          <aside {...viewProps}>
            {fileDomList}
          </aside>
        )
      }
    </div>
  )

}))

export default Upload
