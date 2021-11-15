import { useEffect, useState } from 'react';

export default function useDebounce(value: number | string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedValue(value),
      delay
    );

    return () => clearTimeout(handler);
  }, [value]);

  return debouncedValue;
}
