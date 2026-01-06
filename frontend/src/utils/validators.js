import { VALIDATION } from './constants';

/**
 * Validate email
 * @param {string} email - Email cần validate
 * @returns {boolean} - true nếu hợp lệ
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  return VALIDATION.EMAIL_REGEX.test(email);
};

/**
 * Validate số điện thoại Việt Nam
 * @param {string} phone - Số điện thoại
 * @returns {boolean} - true nếu hợp lệ
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  return VALIDATION.PHONE_REGEX.test(phone);
};

/**
 * Validate password (tối thiểu 6 ký tự)
 * @param {string} password - Mật khẩu
 * @returns {boolean} - true nếu hợp lệ
 */
export const isValidPassword = (password) => {
  if (!password) return false;
  return password.length >= VALIDATION.PASSWORD_MIN_LENGTH;
};

/**
 * Validate password mạnh (8 ký tự, có chữ hoa, chữ thường, số)
 * @param {string} password - Mật khẩu
 * @returns {boolean} - true nếu mật khẩu mạnh
 */
export const isStrongPassword = (password) => {
  if (!password) return false;
  return VALIDATION.PASSWORD_STRONG_REGEX.test(password);
};

/**
 * Get password strength
 * @param {string} password - Mật khẩu
 * @returns {object} - { strength: 'weak'|'medium'|'strong', message: string }
 */
export const getPasswordStrength = (password) => {
  if (!password) {
    return { strength: 'weak', message: 'Mật khẩu không được để trống' };
  }

  if (password.length < 6) {
    return { strength:  'weak', message: 'Mật khẩu quá ngắn (tối thiểu 6 ký tự)' };
  }

  if (password.length < 8) {
    return { strength: 'medium', message:  'Mật khẩu trung bình' };
  }

  const hasUpperCase = /[A-Z]/. test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/. test(password);

  const score = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar]. filter(Boolean).length;

  if (score >= 3) {
    return { strength:  'strong', message: 'Mật khẩu mạnh' };
  } else if (score >= 2) {
    return { strength: 'medium', message: 'Mật khẩu trung bình' };
  } else {
    return { strength: 'weak', message: 'Mật khẩu yếu' };
  }
};

/**
 * Validate URL
 * @param {string} url - URL cần validate
 * @returns {boolean} - true nếu hợp lệ
 */
export const isValidURL = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate số dương
 * @param {any} value - Giá trị cần kiểm tra
 * @returns {boolean} - true nếu là số dương
 */
export const isPositiveNumber = (value) => {
  return ! isNaN(value) && Number(value) > 0;
};

/**
 * Validate required field
 * @param {any} value - Giá trị cần kiểm tra
 * @returns {boolean} - true nếu không rỗng
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate min length
 * @param {string} value - Giá trị
 * @param {number} minLength - Độ dài tối thiểu
 * @returns {boolean} - true nếu đủ độ dài
 */
export const isMinLength = (value, minLength) => {
  if (!value) return false;
  return value.length >= minLength;
};

/**
 * Validate max length
 * @param {string} value - Giá trị
 * @param {number} maxLength - Độ dài tối đa
 * @returns {boolean} - true nếu không vượt quá
 */
export const isMaxLength = (value, maxLength) => {
  if (!value) return true;
  return value.length <= maxLength;
};

/**
 * Validate min value
 * @param {number} value - Giá trị
 * @param {number} min - Giá trị tối thiểu
 * @returns {boolean} - true nếu >= min
 */
export const isMinValue = (value, min) => {
  return ! isNaN(value) && Number(value) >= min;
};

/**
 * Validate max value
 * @param {number} value - Giá trị
 * @param {number} max - Giá trị tối đa
 * @returns {boolean} - true nếu <= max
 */
export const isMaxValue = (value, max) => {
  return !isNaN(value) && Number(value) <= max;
};

/**
 * Validate form data
 * @param {object} data - Dữ liệu form
 * @param {object} rules - Rules validation
 * @returns {object} - { isValid: boolean, errors: {} }
 */
export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = data[field];

    if (fieldRules.required && !isRequired(value)) {
      errors[field] = fieldRules.requiredMessage || `${field} là bắt buộc`;
      isValid = false;
      return;
    }

    if (fieldRules.email && !isValidEmail(value)) {
      errors[field] = 'Email không hợp lệ';
      isValid = false;
      return;
    }

    if (fieldRules. phone && !isValidPhone(value)) {
      errors[field] = 'Số điện thoại không hợp lệ';
      isValid = false;
      return;
    }

    if (fieldRules. minLength && !isMinLength(value, fieldRules.minLength)) {
      errors[field] = `Tối thiểu ${fieldRules.minLength} ký tự`;
      isValid = false;
      return;
    }

    if (fieldRules.maxLength && !isMaxLength(value, fieldRules.maxLength)) {
      errors[field] = `Tối đa ${fieldRules.maxLength} ký tự`;
      isValid = false;
      return;
    }

    if (fieldRules.minValue && !isMinValue(value, fieldRules.minValue)) {
      errors[field] = `Giá trị tối thiểu là ${fieldRules.minValue}`;
      isValid = false;
      return;
    }

    if (fieldRules.maxValue && !isMaxValue(value, fieldRules.maxValue)) {
      errors[field] = `Giá trị tối đa là ${fieldRules. maxValue}`;
      isValid = false;
      return;
    }
  });

  return { isValid, errors };
};