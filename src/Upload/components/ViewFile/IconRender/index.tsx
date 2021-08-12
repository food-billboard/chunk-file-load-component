import React, { memo } from 'react'
import IconMap from './icon.map'
import { UploadProps } from '../../../type'

export interface IconProps extends Pick<UploadProps, "showUploadList" | "iconRender"> {

}

const Icon = memo((props: IconProps) => {

  const {  } = props 

  return (
    <div></div>
  )

})