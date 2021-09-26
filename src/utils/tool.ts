export function withTry<T = any>(func: Function) {
  return async function (...args: any[]): Promise<[any, T | null]> {
    try {
      const data = await func(...args);
      return [null, data];
    } catch (err) {
      return [err, null];
    }
  };
}

export const className = (prefix: string, ...args: string[]) => {
  return `${prefix}-${args.join('-')}`;
};
