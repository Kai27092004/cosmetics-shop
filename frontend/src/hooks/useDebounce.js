import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * Trì hoãn việc update value để tránh gọi API quá nhiều lần
 * 
 * @param {any} value - Giá trị cần debounce
 * @param {number} delay - Thời gian delay (ms)
 * @returns {any} - Giá trị đã debounced
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set timeout để update giá trị sau `delay` ms
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup:  Xóa timeout cũ nếu value thay đổi trước khi timeout chạy
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;