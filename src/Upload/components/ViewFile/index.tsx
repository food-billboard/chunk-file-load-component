import React, { memo, useCallback, useMemo } from 'react'
import classnames from 'classnames'
import Card from './CardFile'
import List from './ListFile'
import ViewCard from './ViewListFile'
import { ViewFileProps } from '../../type'
import styles from '../../index.less'

export default memo((props: ViewFileProps) => {

  const { viewType, className, style, ...nextProps } = props

  const onCancel = useCallback(() => {

  }, [])

  const onStop = useCallback(() => {

  }, [])

  const onUpload = useCallback(() => {

  }, [])

  const viewProps = useMemo(() => {
    return {
      style: style || {},
      className: classnames(styles["chunk-upload-list"], className)
    }
  }, [className, style])
  
  const container = useMemo(() => {
    switch(viewType) {
      case "card":
        return <Card {...nextProps} />
      case "list":
        return <List {...nextProps} />
      case "view-card":
        return <ViewCard {...nextProps} />
      default:
        return (
          <span></span>
        )
    }
  }, [viewType, nextProps])

  return (
    <aside {...viewProps}>
      {container}
    </aside>
  )

})