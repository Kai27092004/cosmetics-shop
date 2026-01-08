import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Tự động scroll lên đầu trang khi chuyển route
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top ngay lập tức khi pathname thay đổi
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Component này không render gì
}