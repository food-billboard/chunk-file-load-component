import React, { memo, useMemo } from 'react'
import {  } from '@ant-design/icons'
import { WrapperFile, ViewFileProps } from '../../../type'
import styles from './index.less'
export interface NormalViewItemProps {
  value: WrapperFile
}

const ViewItem = memo((props: WrapperFile) => {

  const { local, name, task, getStatus } = props 

  return (
    <div></div>
  )

})

const ListFile = memo((props: Omit<ViewFileProps, "viewType">) => {

  const { value, showUploadList,  } = props

  const list = useMemo(() => {
    return value.map(item => {
      return (
        <ViewItem {...item} />
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