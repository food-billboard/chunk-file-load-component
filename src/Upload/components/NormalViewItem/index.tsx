import React, { memo, useMemo } from 'react'
import { WrapperFile } from '../../index'
import styles from './index.less'

export interface NormalViewItemProps {
  value: WrapperFile
}

const NormalViewItem = memo((props: NormalViewItemProps) => {

  const { value } = useMemo(() => {
    return props 
  }, [props])

  return (
    <div></div>
  )

})