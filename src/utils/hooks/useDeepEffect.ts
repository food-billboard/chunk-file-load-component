import { useEffect, useRef, EffectCallback, DependencyList } from 'react';
import { isEqual } from 'lodash-es';

function useDeepEffect(fn: EffectCallback, deps: DependencyList) {
  const isFirst = useRef(true);
  const prevDeps = useRef(deps);

  useEffect(() => {
    const isSame = prevDeps.current.every((obj, index) =>
      isEqual(obj, deps[index]),
    );

    if (isFirst.current || !isSame) {
      fn();
    }

    isFirst.current = false;
    prevDeps.current = deps;
  }, deps);
}

export default useDeepEffect;
