import React, { memo, useEffect, useMemo } from 'react';
import { Progress as AntProgress } from 'antd';
import type { ProgressProps } from 'antd';
import classnames from 'classnames';
import { useProgress, useStatus } from '@/Upload/utils';
import { ProgressType } from '@/Upload/utils/hooks/useProgress';
import { WrapperFile } from '@/Upload/type';
import './index.less';

const Progress = memo(
  (
    props: Partial<ProgressProps> & {
      file: WrapperFile;
      onChange?: (progress: ProgressType) => void;
      fixed?: number;
    },
  ) => {
    const { file, className, style, onChange, fixed = 0, ...nextProps } = props;
    const { name, error } = file;

    const [, , progress, origin] = useProgress(name);
    const status = useStatus(origin.step);

    const percent = useMemo(() => {
      const { step } = origin;
      if (step === 2) {
        return progress / 2;
      }
      if (step === 3) {
        return 50 + progress / 2;
      }
      return progress;
    }, [origin, progress, onChange]);

    const realValue = useMemo(() => {
      return parseFloat(percent.toFixed(fixed));
    }, [percent, fixed]);

    useEffect(() => {
      onChange?.(origin);
    }, [origin]);

    return (
      <div
        className={classnames(
          'chunk-upload-list-progress',
          {
            'chunk-upload-list-progress-error': !!error,
          },
          className,
        )}
        style={style}
      >
        <AntProgress
          percent={realValue}
          status={!!error ? 'exception' : undefined}
          {...nextProps}
        />
        <span
          className="chunk-upload-list-progress-status"
          title={origin.step as any}
        >
          {status}
        </span>
      </div>
    );
  },
);

export default Progress;
