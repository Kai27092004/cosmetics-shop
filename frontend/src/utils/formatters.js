/**
 * Format số tiền thành VNĐ
 * @param {number} amount - Số tiền
 * @returns {string} - Chuỗi tiền đã format (VD: "150. 000 ₫")
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 ₫';
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Format số
 * @param {number} number - Số cần format
 * @returns {string} - Chuỗi số đã format (VD: "1. 000")
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }

  return new Intl.NumberFormat('vi-VN').format(number);
};

/**
 * Format ngày tháng
 * @param {string|Date} date - Ngày cần format
 * @param {string} format - Định dạng ('dd/MM/yyyy', 'dd/MM/yyyy HH:mm', 'yyyy-MM-dd')
 * @returns {string} - Chuỗi ngày đã format
 */
export const formatDate = (date, format = 'dd/MM/yyyy') => {
  if (!date) return '';

  const d = new Date(date);
  
  // Kiểm tra ngày hợp lệ
  if (isNaN(d.getTime())) return '';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  switch (format) {
    case 'dd/MM/yyyy': 
      return `${day}/${month}/${year}`;
    case 'dd/MM/yyyy HH:mm':
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case 'dd/MM/yyyy HH:mm:ss':
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    case 'yyyy-MM-dd': 
      return `${year}-${month}-${day}`;
    case 'MM/dd/yyyy':
      return `${month}/${day}/${year}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

/**
 * Format thời gian tương đối (vừa xong, 5 phút trước...)
 * @param {string|Date} date - Ngày cần format
 * @returns {string} - Chuỗi thời gian tương đối
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';

  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 0) {
    return 'Trong tương lai';
  } else if (diffInSeconds < 60) {
    return 'Vừa xong';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} phút trước`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} giờ trước`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ngày trước`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} tháng trước`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} năm trước`;
  }
};

/**
 * Cắt văn bản dài
 * @param {string} text - Văn bản cần cắt
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} - Văn bản đã cắt
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format file size
 * @param {number} bytes - Kích thước file (bytes)
 * @returns {string} - Chuỗi kích thước đã format (VD: "1.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  if (! bytes) return 'N/A';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Capitalize first letter
 * @param {string} text - Văn bản
 * @returns {string} - Văn bản với chữ cái đầu viết hoa
 */
export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Format phone number
 * @param {string} phone - Số điện thoại
 * @returns {string} - Số điện thoại đã format (VD: "0123 456 789")
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Loại bỏ ký tự không phải số
  const cleaned = phone.replace(/\D/g, '');
  
  // Format:  0xxx xxx xxx
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  return phone;
};

/**
 * Format discount percentage
 * @param {number} originalPrice - Giá gốc
 * @param {number} discountPrice - Giá giảm
 * @returns {string} - Phần trăm giảm giá (VD: "-20%")
 */
export const formatDiscountPercentage = (originalPrice, discountPrice) => {
  if (! originalPrice || !discountPrice || originalPrice <= discountPrice) {
    return '';
  }

  const percentage = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  return `-${percentage}%`;
};