import { useRef } from 'react';

function useThrottle<A extends unknown[]>(callback: (...args: A) => void, delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return function throttledCallback(...args: A) {
    if (!timer.current) {
      timer.current = setTimeout(() => {
        callback(...args);
        timer.current = null;
      }, delay);
    }
  };
}

export default useThrottle;
