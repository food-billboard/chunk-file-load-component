import React, { memo, useMemo } from 'react'
import { WrapperFile, ViewFileProps } from '../../../type'
import styles from './index.less'

export interface NormalViewItemProps {
  value: WrapperFile
}

const ViewItem = memo(() => {
  return (
    <span></span>
  )
})

const ViewListFile = memo((props: Omit<ViewFileProps, "viewType">) => {

  const { value } = useMemo(() => {
    return props 
  }, [props])

  return (
    <div></div>
  )

})

export default ViewListFile