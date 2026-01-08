import { useState, useEffect } from 'react';

/**
 * useLocalStorage Hook
 * Đồng bộ state với localStorage
 * 
 * @param {string} key - localStorage key
 * @param {any} initialValue - Giá trị mặc định
 * @returns {[any, function]} - [value, setValue]
 */
export function useLocalStorage(key, initialValue) {
  // State để lưu giá trị
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Lấy từ localStorage
      const item = window.localStorage.getItem(key);
      // Parse JSON nếu có, không thì dùng initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}": `, error);
      return initialValue;
    }
  });

  // Return một wrapped version của useState's setter function
  // để persist giá trị vào localStorage
  const setValue = (value) => {
    try {
      // Cho phép value là một function như useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Lưu vào state
      setStoredValue(valueToStore);
      
      // Lưu vào localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}": `, error);
    }
  };

  // Lắng nghe thay đổi từ tab khác
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;