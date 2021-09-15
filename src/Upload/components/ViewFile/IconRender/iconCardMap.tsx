import React, { memo, CSSProperties } from 'react';
import classnames from 'classnames';
import { get } from 'lodash-es';
import FileImageTwoTone from '@ant-design/icons/FileImageTwoTone';
import { className, IMAGE_FALLBACK } from '../../../../utils';
import { WrapperFile } from '../../../index';
import './index.less';

export const DEFAULT_ICON: any = null;

const PREFIX = 'chunk-upload-icon-card';

const FileImageTwoToneNode = memo(
  (props: {
    className?: string;
    style?: CSSProperties;
    iconRender?: any;
    file: WrapperFile;
  }) => {
    const { className: propsClassName, style, file } = props;
    const viewUrl = get(file, 'local.value.preview');
    return (
      <div
        style={style}
        className={classnames(className(PREFIX, 'image'), propsClassName)}
      >
        <FileImageTwoTone />
        <img
          src={viewUrl || IMAGE_FALLBACK}
          className={classnames(className(PREFIX, 'image', 'cover'))}
        />
      </div>
    );
  },
);

const IconCardMap = {
  image: FileImageTwoToneNode,
};

export default IconCardMap;

// folder: FolderOutlined
