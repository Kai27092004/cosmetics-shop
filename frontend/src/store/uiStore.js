import { create } from 'zustand';

export const useUIStore = create((set, get) => ({
  // ==================== STATE ====================
  isLoading: false,              // Global loading state
  isSidebarOpen: false,          // Sidebar admin (desktop)
  isCartDrawerOpen: false,       // Cart drawer (slide từ phải)
  isMobileMenuOpen: false,       // Mobile menu (hamburger)
  
  modal: {
    isOpen: false,
    title: '',
    content: null,
    onConfirm: null,
    onCancel: null,
    confirmText: 'Xác nhận',
    cancelText: 'Hủy',
  },

  toast: {
    isVisible: false,
    message: '',
    type: 'info', // 'info' | 'success' | 'warning' | 'error'
  },

  // ==================== LOADING ACTIONS ====================

  /**
   * Set loading state
   * @param {boolean} isLoading
   */
  setLoading: (isLoading) => {
    console.log(`⏳ [UI Store] Loading: `, isLoading);
    set({ isLoading });
  },

  // ==================== SIDEBAR ACTIONS ====================

  /**
   * Toggle sidebar
   */
  toggleSidebar: () => {
    const newState = !get().isSidebarOpen;
    console.log(`📂 [UI Store] Sidebar: `, newState ? 'Open' : 'Closed');
    set({ isSidebarOpen: newState });
  },

  /**
   * Open sidebar
   */
  openSidebar: () => {
    console.log('📂 [UI Store] Sidebar opened');
    set({ isSidebarOpen: true });
  },

  /**
   * Close sidebar
   */
  closeSidebar: () => {
    console.log('📂 [UI Store] Sidebar closed');
    set({ isSidebarOpen: false });
  },

  // ==================== CART DRAWER ACTIONS ====================

  /**
   * Toggle cart drawer
   */
  toggleCartDrawer: () => {
    const newState = !get().isCartDrawerOpen;
    console.log(`🛒 [UI Store] Cart Drawer:`, newState ? 'Open' : 'Closed');
    set({ isCartDrawerOpen: newState });
  },

  /**
   * Open cart drawer
   */
  openCartDrawer: () => {
    console.log('🛒 [UI Store] Cart Drawer opened');
    set({ isCartDrawerOpen: true });
  },

  /**
   * Close cart drawer
   */
  closeCartDrawer: () => {
    console.log('🛒 [UI Store] Cart Drawer closed');
    set({ isCartDrawerOpen: false });
  },

  // ==================== MOBILE MENU ACTIONS ====================

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu: () => {
    const newState = !get().isMobileMenuOpen;
    console.log(`📱 [UI Store] Mobile Menu:`, newState ? 'Open' : 'Closed');
    set({ isMobileMenuOpen: newState });
  },

  /**
   * Open mobile menu
   */
  openMobileMenu: () => {
    console.log('📱 [UI Store] Mobile Menu opened');
    set({ isMobileMenuOpen:  true });
  },

  /**
   * Close mobile menu
   */
  closeMobileMenu:  () => {
    console.log('📱 [UI Store] Mobile Menu closed');
    set({ isMobileMenuOpen: false });
  },

  // ==================== MODAL ACTIONS ====================

  /**
   * Open modal
   * @param {object} options - Modal options
   */
  openModal: (options) => {
    const { title, content, onConfirm, onCancel, confirmText, cancelText } = options;
    
    console.log('🔔 [UI Store] Modal opened:', title);
    
    set({
      modal: {
        isOpen: true,
        title:  title || '',
        content: content || null,
        onConfirm: onConfirm || null,
        onCancel: onCancel || null,
        confirmText: confirmText || 'Xác nhận',
        cancelText: cancelText || 'Hủy',
      },
    });
  },

  /**
   * Close modal
   */
  closeModal: () => {
    console.log('🔔 [UI Store] Modal closed');
    
    set({
      modal: {
        isOpen: false,
        title: '',
        content:  null,
        onConfirm: null,
        onCancel: null,
        confirmText:  'Xác nhận',
        cancelText: 'Hủy',
      },
    });
  },

  /**
   * Confirm modal action
   */
  confirmModal: () => {
    const { onConfirm } = get().modal;
    
    if (onConfirm) {
      onConfirm();
    }
    
    get().closeModal();
  },

  /**
   * Cancel modal action
   */
  cancelModal:  () => {
    const { onCancel } = get().modal;
    
    if (onCancel) {
      onCancel();
    }
    
    get().closeModal();
  },

  // ==================== TOAST ACTIONS ====================

  /**
   * Show toast notification
   * @param {string} message - Toast message
   * @param {string} type - 'info' | 'success' | 'warning' | 'error'
   * @param {number} duration - Auto hide duration (ms), default: 3000
   */
  showToast: (message, type = 'info', duration = 3000) => {
    console.log(`💬 [UI Store] Toast (${type}):`, message);
    
    set({
      toast: {
        isVisible: true,
        message,
        type,
      },
    });

    // Auto hide after duration
    if (duration > 0) {
      setTimeout(() => {
        get().hideToast();
      }, duration);
    }
  },

  /**
   * Hide toast
   */
  hideToast: () => {
    set({
      toast: {
        isVisible: false,
        message: '',
        type: 'info',
      },
    });
  },

  /**
   * Shorthand methods for toast
   */
  showSuccessToast: (message, duration = 3000) => {
    get().showToast(message, 'success', duration);
  },

  showErrorToast: (message, duration = 3000) => {
    get().showToast(message, 'error', duration);
  },

  showWarningToast: (message, duration = 3000) => {
    get().showToast(message, 'warning', duration);
  },

  showInfoToast: (message, duration = 3000) => {
    get().showToast(message, 'info', duration);
  },
}));