import { useEffect, useCallback, useRef } from 'react';
import { useControllableValue as aUserControlLabelValue } from 'ahooks';
import { Options } from 'ahooks/es/useControllableValue';
import { propsValueFormat } from '../tool';

type StateChangeReturnType<T> = [
  T,
  (value: T | ((prev: T) => T), callback?: (value: T) => void) => void,
];

function useControllableValue<T = any>(
  props: any,
  options: Options<T>,
): StateChangeReturnType<T> {
  const [value, setValue] = aUserControlLabelValue<T>(props, options);
  const callbackRef = useRef<any>();

  const realSetValue = useCallback(
    (newValue: T | ((prev: T) => T), callback?: (value: T) => void) => {
      callbackRef.current = callback;
      const result =
        typeof newValue === 'function'
          ? (newValue as (prev: T) => T)(value)
          : newValue;
      setValue(result);
    },
    [value],
  );

  useEffect(() => {
    const newValue = propsValueFormat(value);
    callbackRef.current?.(newValue);
  }, [value]);

  return [value, realSetValue];
}

export default useControllableValue;
