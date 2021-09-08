import { ReactNode, useContext, useEffect, useState } from 'react';
import { ECACHE_STATUS } from 'chunk-file-upload';
import { UploadContext } from '../../index';
import { getProcessStatusLocale } from '../hooks/useProgress';

function useStatus(step: ECACHE_STATUS) {
  const [status, setStatus] = useState<string | ReactNode>('等待中');

  const { locale } = useContext(UploadContext);

  useEffect(() => {
    const localeText = getProcessStatusLocale(step, locale);
    setStatus(localeText);
  }, [step, locale]);

  return status;
}

export default useStatus;
