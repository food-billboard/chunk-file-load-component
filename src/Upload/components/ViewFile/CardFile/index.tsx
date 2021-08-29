import React, { memo, useMemo } from 'react';
import ViewItem from './Item';
import { itemRender } from '@/Upload/utils';
import { ViewDetailProps } from '../index';
import './index.less';

const CardFile = memo((props: ViewDetailProps) => {
  const {
    value,
    showUploadList,
    onCancel,
    onUpload,
    onStop,
    iconRender,
    viewType,
  } = props;

  const list = useMemo(() => {
    return value.map((item) => {
      const node = (
        <ViewItem
          value={item}
          key={item.id}
          showUploadList={showUploadList}
          onCancel={onCancel}
          onUpload={onUpload}
          onStop={onStop}
          iconRender={iconRender}
          viewType={viewType}
        />
      );
      const result = itemRender(props, item, value);
      if (result) return result(node);
      return node;
    });
  }, [value]);

  return <>{list}</>;
});

export default CardFile;
