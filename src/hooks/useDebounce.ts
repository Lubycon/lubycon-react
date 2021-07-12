import { useRef } from 'react';

export default function useDebounce<A extends unknown[]>(
  callback: (...args: A) => void,
  delay: number
) {
  const argsRef = useRef<A>();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);


  function cleanup() {
    if (timer.current) clearTimeout(timer.current);
  };

  return function debouncedCallback(...args: A) {
    argsRef.current = args;
    cleanup();
    timer.current = setTimeout(() => {
      if (argsRef.current) {
        callback(...argsRef.current);
        timer.current = null;
      }
    }, delay);
  };
}
