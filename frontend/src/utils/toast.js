import { toast } from 'react-toastify';

/**
 * Custom Toast Helpers
 * Wrapper cho react-toastify với config đồng nhất
 */

export const showToast = {
  /**
   * Success toast
   * @param {string} message
   */
  success: (message) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  /**
   * Error toast
   * @param {string} message
   */
  error: (message) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar:  false,
      closeOnClick:  true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  /**
   * Warning toast
   * @param {string} message
   */
  warning: (message) => {
    toast.warning(message, {
      position: 'top-right',
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  /**
   * Info toast
   * @param {string} message
   */
  info: (message) => {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar:  false,
      closeOnClick:  true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  /**
   * Promise toast (cho async operations)
   * @param {Promise} promise
   * @param {object} messages - {pending, success, error}
   */
  promise: (promise, messages) => {
    return toast.promise(
      promise,
      {
        pending: messages.pending || 'Đang xử lý...',
        success: messages.success || 'Thành công!',
        error: messages.error || 'Có lỗi xảy ra! ',
      },
      {
        position: 'top-right',
      }
    );
  },
};

export default showToast;