/**
 * Get full image URL
 * @param {string} imageUrl - Image path from database
 * @returns {string} - Full image URL
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    // Placeholder image nếu không có ảnh
    return 'https://via.placeholder.com/300? text=No+Image';
  }

  // Nếu đã là URL đầy đủ (http: // hoặc https://)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Nếu là đường dẫn tương đối, ghép với backend URL
  const BACKEND_URL = import.meta.env.VITE_API_URL?. replace('/api', '') || 'http://localhost:8080';
  
  // Xử lý đường dẫn
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  
  return `${BACKEND_URL}${cleanPath}`;
};

/**
 * Generate slug from text
 * @param {string} text
 * @returns {string}
 */
export const generateSlug = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Copy text to clipboard
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Download file
 * @param {string} url - File URL
 * @param {string} filename - Download filename
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Check if user is on mobile
 * @returns {boolean}
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator. userAgent);
};

/**
 * Debounce function
 * @param {function} func
 * @param {number} wait
 * @returns {function}
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};