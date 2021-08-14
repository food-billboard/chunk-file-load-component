import React, { memo, useMemo } from 'react';
import { WrapperFile, ViewFileProps } from '../../../type';
import { ViewDetailProps } from '../index';
import styles from './index.less';

export interface NormalViewItemProps {
  value: WrapperFile;
}

const ViewItem = memo(() => {
  return <span></span>;
});

const ViewListFile = memo((props: ViewDetailProps) => {
  const { value } = useMemo(() => {
    return props;
  }, [props]);

  return <div></div>;
});

export default ViewListFile;
