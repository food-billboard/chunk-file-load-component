import React, { memo, useMemo } from 'react';
import ViewItem from './Item';
import { itemRender } from '../../../utils';
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
    onPreviewFile,
  } = props;

  const list = useMemo(() => {
    return value.map((item) => {
      const result = itemRender(props, item, value);
      return (
        <ViewItem
          value={item}
          key={item.id}
          showUploadList={showUploadList}
          onCancel={onCancel}
          onUpload={onUpload}
          onStop={onStop}
          iconRender={iconRender}
          viewType={viewType}
          itemRender={result}
          onPreviewFile={onPreviewFile}
        />
      );
    });
  }, [
    value,
    showUploadList,
    onCancel,
    onUpload,
    onStop,
    iconRender,
    viewType,
    onPreviewFile,
  ]);

  return <>{list}</>;
});

export default CardFile;
