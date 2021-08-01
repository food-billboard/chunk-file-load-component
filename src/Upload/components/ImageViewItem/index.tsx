import React, { memo, useMemo } from 'react'
import { List, Avatar, Skeleton } from 'antd'
import styles from './index.less'

const { Item } = List

export interface ImageViewItem {
  value: any[]
}

const ImageViewItem = memo((props: ImageViewItem) => {

  const { value } = useMemo(() => {
    return props 
  }, [props])

  return (
    <List
        className={styles["image-view-item"]}
        itemLayout="horizontal"
        dataSource={value}
        renderItem={item => (
          <List.Item
            actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                avatar={
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                }
                title={<a href="https://ant.design">{item.name.last}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
              <div>content</div>
            </Skeleton>
          </List.Item>
        )}
      />
  )

})