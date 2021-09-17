import { useCallback, useState } from 'react';
import useUpdateEffect from './useUpdateEffect';

export interface Options<T> {
  defaultValue?: T;
  defaultValuePropName?: string;
  valuePropName?: string;
  trigger?: string;
}

export interface Props {
  [key: string]: any;
}

type ReturnValueType<T = any> = [T, (value: ((val: T) => T) | T) => void];

interface StandardProps<T> {
  value: T;
  defaultValue?: T;
  onChange: (val: T) => void;
}
function useControllableValue<T = any>(
  props: StandardProps<T>,
): ReturnValueType<T>;
function useControllableValue<T = any>(
  props?: Props,
  options?: Options<T>,
): ReturnValueType<T>;
function useControllableValue<T = any>(
  props: Props = {},
  options: Options<T> = {},
) {
  const {
    defaultValue,
    defaultValuePropName = 'defaultValue',
    valuePropName = 'value',
    trigger = 'onChange',
  } = options;

  const value = props[valuePropName] as T;

  const [state, setState] = useState<T>(() => {
    if (valuePropName in props) {
      return value;
    }
    if (defaultValuePropName in props) {
      return props[defaultValuePropName];
    }
    return defaultValue;
  });

  /* init 的时候不用执行了 */
  useUpdateEffect(() => {
    if (valuePropName in props) {
      setState(value);
    }
  }, [value, valuePropName]);

  const handleSetState = useCallback(
    (v: T, ...args: any[]) => {
      if (!(valuePropName in props)) {
        setState(v);
      }
      if (props[trigger]) {
        let realValue = v;
        if (typeof v === 'function') {
          realValue = v(value === undefined ? state : value);
        }
        props[trigger](realValue, ...args);
      }
    },
    [props, valuePropName, trigger, value],
  );

  return [valuePropName in props ? value : state, handleSetState] as const;
}

export default useControllableValue;
