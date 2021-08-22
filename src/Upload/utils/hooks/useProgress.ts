import { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { merge } from 'lodash-es';
import { TWrapperTask, Upload, ECACHE_STATUS } from 'chunk-file-upload/src';
import { UploadContext, UploadProps } from '@/Upload';

const STATUS_MAP = {
  0: 'pending',
  1: 'waiting',
  2: 'reading',
  3: 'uploading',
  4: 'fulfilled',
  '-3': 'rejected',
  '-2': 'cancel',
  '-1': 'stopping',
};

const DEFAULT_STATUS_LOCALE = {
  pending: '队列中',
  waiting: '等待中',
  reading: '解析中',
  uploading: '上传中',
  fulfilled: '上传完成',
  rejected: '上传失败',
  cancel: '上传取消',
  stopping: '上传暂停',
};

export const getProcessStatusLocale: (
  step: ECACHE_STATUS,
  locale: UploadProps['locale'],
) => string | ReactNode = (step, locale) => {
  const status: any = STATUS_MAP[step];
  return (
    (locale?.progress as any)?.[status] ||
    (DEFAULT_STATUS_LOCALE as any)[status]
  );
};

export type ProgressType = TWrapperTask['process'] & { step: ECACHE_STATUS };

function useProgress(name: Symbol): [number, number, number, ProgressType] {
  const { emitter, instance } = useContext(UploadContext);

  const [progress, setProgress] = useState<ProgressType>({
    current: 0,
    total: 0,
    complete: 0,
    step: 0,
  });

  const action = useCallback(
    (instance: Upload, name: Symbol, params: any, response: any) => {
      const progress = response?.process;
      const status = instance.getStatus(name);
      setProgress((prev) => {
        return merge({}, prev, progress, { step: status ?? -3 });
      });
    },
    [],
  );

  useEffect(() => {
    emitter.on(name, action.bind(null, instance));
  }, [emitter, instance]);

  let { complete, total } = progress;
  complete ||= 0;
  total ||= 0;

  return [complete, total, (complete / total) * 100 || 0, progress];
}

export default useProgress;
