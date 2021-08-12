import React, { memo } from 'react'
import { ViewFileProps } from '../../../type'
import styles from './index.less'

const ViewItem = memo(() => {
  return (
    <span></span>
  )
})

const CardFile = memo((props: Omit<ViewFileProps, "viewType">) => {

  return (
    <div></div>
  )

})

export default CardFile