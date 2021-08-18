import { useCallback, useContext, useEffect, useState } from 'react';
import { merge } from 'lodash-es';
import { TWrapperTask } from 'chunk-file-upload/src';
import { UploadContext } from '@/Upload';

function useProgress(name: Symbol): [number, number, number] {
  const { emitter } = useContext(UploadContext);

  const [progress, setProgress] = useState<TWrapperTask['process']>({
    current: 0,
    total: 0,
    complete: 0,
  });

  const action = useCallback((name: Symbol, params: any, response: any) => {
    const progress = response?.process;
    setProgress((prev) => {
      return merge({}, prev, progress);
    });
  }, []);

  useEffect(() => {
    emitter.on(name, action);
  }, [emitter]);

  let { complete, total } = progress;
  complete ||= 0;
  total ||= 0;

  return [complete, total, (complete / total) * 100 || 0];
}

export default useProgress;
