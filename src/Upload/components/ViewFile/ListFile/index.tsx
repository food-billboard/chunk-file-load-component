import React, { memo, useCallback, useMemo } from 'react'
import { DeleteOutlined, UploadOutlined, PauseCircleOutlined } from '@ant-design/icons'
import { Upload } from 'chunk-file-upload/src'
import { WrapperFile, ViewFileProps, UploadProps } from '../../../type'
import styles from './index.less'
export interface NormalViewItemProps {
  value: WrapperFile
}

const ViewItem = memo((props: WrapperFile & { instance: Upload, showUploadList: UploadProps["showUploadList"] }) => {

  const { local, name, task, getStatus, instance, showUploadList } = props 

  const isStop = !!(task?.tool.file.isStop())

  const handleStop = useCallback(() => {
    instance.stop(name)
  }, [instance, name, getStatus])

  const handleUpload = useCallback(() => {
    instance.deal(name)
  }, [instance, name])

  const handleCancel = useCallback(() => {
    instance.cancel(name)
  }, [instance, name])

  const uploadButtonAction = useMemo(() => {
    if(isStop) {
      return (
        <UploadOutlined onClick={handleUpload} />
      )
    }
    return (
      <PauseCircleOutlined onClick={handleStop} />
    )
  }, [isStop, handleUpload, handleStop])

  const progress = useMemo(() => {
    const complete = task?.process.complete || 0
    const total = task?.process.total
    if(!total) return 0
    return (complete / total) * 100 
  }, [task])

  return (
    <div>
      {name}
      进度{progress}-----
      {
        uploadButtonAction
      }
      <DeleteOutlined onClick={handleCancel} />
    </div>
  )

})

const ListFile = memo((props: Omit<ViewFileProps, "viewType">) => {

  const { value, showUploadList, instance } = props

  const list = useMemo(() => {
    return value.map(item => {
      return (
        <ViewItem instance={instance} {...item} key={item.id} showUploadList={showUploadList} />
      )
    })
  }, [value])

  return (
    <div
      className={styles["image-view-item"]}
    >
      <ul>
        {
          list 
        }
      </ul>
    </div>
  )

})

export default ListFile