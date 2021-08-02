import React, { memo, useMemo } from 'react'
import { WrapperFile } from '../../type'
import styles from './index.less'

export interface NormalViewItemProps {
  value: WrapperFile
}

const ViewListFile = memo((props: NormalViewItemProps) => {

  const { value } = useMemo(() => {
    return props 
  }, [props])

  return (
    <div></div>
  )

})

export default ViewListFile