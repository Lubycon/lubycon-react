import { useEffect, useRef } from 'react';

export default function useDebounce<A extends unknown[]>(
  callback: (...args: A) => void,
  delay: number
) {
  const argsRef = useRef<A>();
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return function cleanup() {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  return function debouncedCallback(...args: A) {
    argsRef.current = args;
    cleanup();
    timeout.current = setTimeout(() => {
      if (argsRef.current) {
        callback(...argsRef.current);
      }
    }, delay);
  };
}
