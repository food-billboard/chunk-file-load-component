import React, { 
  memo, 
  forwardRef, 
  useImperativeHandle, 
  useCallback, 
  useMemo,
  useState,
  useEffect,
} from 'react'
import { 
  useDropzone, 
  DropzoneOptions 
} from 'react-dropzone'
import { merge } from 'lodash-es'
import classnames from 'classnames'
import { nanoid } from 'nanoid'
import { Upload as ChunkFileUpload } from 'chunk-file-upload'
import { 
  Upload as UploadInstanceType, 
  TRequestType,
} from 'chunk-file-upload/src'
import Container from './components/Container'
import ViewFile from './components/ViewFile'
import { DEFAULT_DROP_PROPS } from './constants'
import { customAction } from './utils'
import { propsValueFormat } from './utils/tool'
import { UploadProps, UploadInstance, WrapperFile } from './type'
import styles from './index.less'

export { request } from '../utils/request'

const Upload = memo(forwardRef<UploadInstance, UploadProps>((props, ref) => {

  const [ files, setFiles ] = useState<WrapperFile[]>([])
  const [ uploadInstance, setUploadInstance ] = useState<UploadInstanceType>()

  const { 
    className, 
    style, 
    showUploadList=true,
    immediately=true, 
    request, 
    lifecycle={}, 
    actionUrl, 
    method,
    withCredentials=true,
    containerRender,
    viewType="list",
    viewStyle,
    viewClassName,
    defaultValue,
    value,
    onChange,
    ...nextProps 
  } = props

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
        if(immediately) uploadInstance!.deal(name)
        const task = uploadInstance!.getTask(name)
        const id = nanoid()
        const wrapperTask: WrapperFile = {
          originFile: file,
          name,
          id,
          task: task || undefined,
          local: {
            type: "local",
            value: {
              preview: URL.createObjectURL(file),
              fileId: id,
              fileSize: file.size,
              filename: file.name
            }
          },
          getStatus() {
            return task!.status
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

  const getTask = useCallback((name) => {
    return uploadInstance!.getTask(name)
  }, [uploadInstance])

  useImperativeHandle(ref, () => {
    return {
      getTask
    }
  }, [getTask])

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
    return <ViewFile instance={uploadInstance!} style={viewStyle} className={viewClassName} value={files} viewType={viewType} showUploadList={showUploadList} />
  }, [files, viewType, uploadInstance, showUploadList, viewClassName, viewStyle])

  useEffect(() => () => {
    files.forEach(file => {
      try {
        URL.revokeObjectURL(file.local?.value?.preview as string)
      }catch(err) {}
    })
  }, [files])

  useEffect(() => {
    if(!!uploadInstance) return 
    const instance = new ChunkFileUpload({
      lifecycle
    })
    setUploadInstance(instance)
  }, [lifecycle, uploadInstance])

  useEffect(() => {
    const formatDefaultValue = propsValueFormat(defaultValue)
    setFiles(formatDefaultValue)
  }, [])

  useEffect(() => {
    if(value !== undefined) {
      const formatValue = propsValueFormat(defaultValue)
      setFiles(formatValue)
    }
  }, [value])

  useEffect(() => {
    onChange?.(files)
  }, [files])

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
              style={style}
              className={className}
            />
          )
        }
      </div>
      {
        !!showUploadList && (
          fileDomList
        )
      }
    </div>
  )

}))

export default Upload
