import React, { 
  memo, 
  forwardRef, 
  useImperativeHandle, 
  useCallback, 
  useMemo,
  useState,
  useEffect
} from 'react'
import { 
  useDropzone, 
  DropzoneOptions 
} from 'react-dropzone'
import { merge } from 'lodash-es'
import classnames from 'classnames'
import { Upload as ChunkFileUpload } from 'chunk-file-upload'
import { 
  TWrapperTask, 
  Upload as UploadInstanceType, 
  TRequestType, 
} from 'chunk-file-upload/src'
import { DEFAULT_DROP_PROPS } from './constants'
import { customAction } from './utils'
import { UploadProps, UploadInstance, WrapperFile } from './type'
import styles from './index.less'

const Upload = memo(forwardRef<UploadInstance, UploadProps>((props, ref) => {

  const [ files, setFiles ] = useState<WrapperFile[]>([])
  const [ uploadInstance, setUploadInstance ] = useState<UploadInstanceType>()

  const { 
    viewClassName, 
    viewStyle, 
    imageView, 
    showUploadList=true,
    immediately=true, 
    request, 
    lifecycle={}, 
    actionUrl, 
    onProgress, 
    method,
    onRemove,
    ...nextProps 
  } = useMemo(() => {
    return props 
  }, [props])

  const uploadFn: TRequestType["uploadFn"] = useCallback((formData, name) => {
    return Promise.resolve({ data: 0 })
  }, [request?.uploadFn])

  const exitDataFn: TRequestType["exitDataFn"] = useCallback(async (params, name) => {
    const { exitDataFn } = request || {}
    if(exitDataFn) return exitDataFn(params, name)
    return {
      data: 0
    }
  }, [request?.exitDataFn])

  const completeFn: TRequestType["completeFn"] = useCallback(() => {

  }, [request?.completeFn])

  const callback: TRequestType["callback"] = useCallback(() => {

  }, [request?.callback])

  const taskGenerate = useCallback((file: File) => {
    if(actionUrl) {
      return {
        ...customAction({
          url: actionUrl,
          instance: uploadInstance!,
          onProgress
        }),
        file: {
          file
        }
      }
    }
    return {
      request: {
        uploadFn,
        completeFn,
        exitDataFn,
        callback
      },
      file: {
        file
      }
    }
  }, [
    uploadFn,
    completeFn,
    exitDataFn,
    callback,
    actionUrl
  ])

  const addTask = useCallback((files: File | File[]) => {
    const realFiles = Array.isArray(files) ? files : [files]
    const wrapperFiles = realFiles.reduce<{
      wrapperFiles: WrapperFile[]
      errorFiles: File[]
    }>((acc, file: File) => {
      const tasks = uploadInstance?.add(taskGenerate(file))
      if(Array.isArray(tasks) && tasks.length === 1) {
        const [ name ] = tasks
        const task = uploadInstance!.getTask(name)
        const wrapperTask: WrapperFile = {
          originFile: file,
          name,
          task: task || undefined,
          preview: imageView ? URL.createObjectURL(file) : undefined,
          local: {
            type: "local"
          }
        }
        acc.wrapperFiles.push(wrapperTask)
      }else {
        acc.errorFiles.push(file)
      }
      return acc 
    }, {
      wrapperFiles: [],
      errorFiles: []
    })
    return wrapperFiles
  }, [uploadInstance, imageView, request, taskGenerate])  

  const onDrop: DropzoneOptions["onDrop"] = useCallback((acceptedFiles, fileRejections) => {
    const { wrapperFiles, errorFiles } = addTask(acceptedFiles)
    if(!!errorFiles.length) console.error("some file error")
    setFiles(prev => {
      return [
        ...prev,
        ...wrapperFiles
      ]
    })
  }, [addTask])

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

  useEffect(() => {
    if(!!uploadInstance) return 
    const instance = new ChunkFileUpload({
      lifecycle
    })
    setUploadInstance(instance)
  }, [lifecycle, uploadInstance])

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
