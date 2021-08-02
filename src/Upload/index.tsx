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
  Upload as UploadInstanceType, 
  TRequestType, 
} from 'chunk-file-upload/src'
import Container from './components/Container'
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
    showUploadList=true,
    immediately=true, 
    request, 
    lifecycle={}, 
    actionUrl, 
    method,
    withCredentials=true,
    containerRender,
    ...nextProps 
  } = useMemo(() => {
    return props 
  }, [props])

  const taskGenerate = useCallback((file: File) => {
    if(actionUrl) {
      return {
        ...customAction({
          url: actionUrl,
          instance: uploadInstance!,
          withCredentials: !!withCredentials,
        }),
        file: {
          file
        }
      }
    }
    return {
      request: request as TRequestType,
      file: {
        file
      }
    }
  }, [
    request,
    actionUrl,
    withCredentials
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
          preview: URL.createObjectURL(file),
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
  }, [uploadInstance, request, taskGenerate])  

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

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, isFocused, isFileDialogActive } = useDropzone(merge({}, DEFAULT_DROP_PROPS, {
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
    const _isDragAccept = isDragAccept && !!containerRender
    const _isDragActive = isDragActive && !!containerRender
    const _isDragReject = isDragReject && !!containerRender
    return classnames(styles["chunk-upload-dropzone"], {
      [styles["chunk-upload-dropzone-accept"]]: _isDragAccept,
      [styles["chunk-upload-dropzone-active"]]: _isDragActive,
      [styles["chunk-upload-dropzone-reject"]]: _isDragReject
    })
  }, [isDragAccept, isDragActive, isDragReject, containerRender])

  const fileDomList = useMemo(() => {
    return files.map(item => {
      const {  } = item 
      return (
        <div></div>
      )
    })
  }, [files])

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
        {
          containerRender ? containerRender({
            isDragAccept,
            isDragActive,
            isDragReject,
            isFileDialogActive,
            isFocused
          }) : (
            <Container 
              isDragAccept={isDragAccept} 
              isDragActive={isDragActive} 
              isDragReject={isDragReject} 
              isFileDialogActive={isFileDialogActive} 
              isFocused={isFocused} 
            />
          )
        }
      </div>
      {
        !!showUploadList && (
          <aside {...viewProps}>
            {fileDomList}
          </aside>
        )
      }
    </div>
  )

}))

export default Upload
