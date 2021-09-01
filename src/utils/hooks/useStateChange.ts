import { useState, useEffect, useCallback, useRef } from 'react';

type StateChangeReturnType<T> = [
  T,
  (value: T | ((prev: T) => T), callback?: () => void) => void,
];

function useStateChange<T = any>(initialValue: T): StateChangeReturnType<T> {
  const [value, setValue] = useState<T>(initialValue);
  const callbackRef = useRef<any>();

  const realSetValue = useCallback(
    (value: T | ((prev: T) => T), callback?: () => void) => {
      callbackRef.current = callback;
      setValue((prev) => {
        const result =
          typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
        return result;
      });
    },
    [],
  );

  useEffect(() => {
    callbackRef.current?.();
  }, [value]);

  return [value, realSetValue];
}

export default useStateChange;
