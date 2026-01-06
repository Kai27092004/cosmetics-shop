import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env. VITE_API_URL?. replace('/api', '') || 'http://localhost:8080';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.isConnecting = false;
  }

  /**
   * Kết nối WebSocket
   * @param {string} token - JWT token (optional)
   */
  connect(token = null) {
    if (this.socket?. connected) {
      console.log('✅ [Socket] Already connected:', this.socket.id);
      return this. socket;
    }

    if (this.isConnecting) {
      console.log('⏳ [Socket] Connection in progress.. .');
      return;
    }

    this.isConnecting = true;

    const authToken = token || 
      localStorage.getItem('userToken') || 
      localStorage.getItem('adminToken');

    console.log('🔌 [Socket] Connecting to:', SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      auth: { token: authToken },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    // Event:  Connected
    this.socket.on('connect', () => {
      console.log('✅ [Socket] Connected successfully!  Socket ID:', this.socket.id);
      this.isConnecting = false;
    });

    // Event: Disconnected
    this.socket.on('disconnect', (reason) => {
      console. log('❌ [Socket] Disconnected.  Reason:', reason);
      this.isConnecting = false;
    });

    // Event: Connection Error
    this.socket.on('connect_error', (error) => {
      console.error('⚠️ [Socket] Connection error:', error. message);
      this.isConnecting = false;
    });

    // Event:  Reconnecting
    this.socket. on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 [Socket] Reconnecting...  Attempt ${attemptNumber}`);
    });

    // Event: Reconnected
    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`✅ [Socket] Reconnected after ${attemptNumber} attempts`);
    });

    // Event: Reconnect Failed
    this.socket.on('reconnect_failed', () => {
      console.error('❌ [Socket] Reconnection failed after all attempts');
    });

    return this.socket;
  }

  /**
   * Ngắt kết nối WebSocket
   */
  disconnect() {
    if (this.socket) {
      console.log('🔌 [Socket] Disconnecting.. .');
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      this.isConnecting = false;
      console.log('✅ [Socket] Disconnected and cleaned up');
    }
  }

  /**
   * Join room theo userId
   * @param {number} userId - User ID
   */
  joinUserRoom(userId) {
    if (this.socket && userId) {
      this.socket. emit('join: user', userId);
      console.log(`👤 [Socket] Joined user room: ${userId}`);
    } else {
      console.warn('⚠️ [Socket] Cannot join user room - Socket not connected or userId missing');
    }
  }

  /**
   * Join room theo role (admin/customer)
   * @param {string} role - 'admin' hoặc 'customer'
   */
  joinRoleRoom(role) {
    if (this.socket && role) {
      this.socket.emit('join:role', role);
      console.log(`🎭 [Socket] Joined role room: ${role}`);
    } else {
      console.warn('⚠️ [Socket] Cannot join role room - Socket not connected or role missing');
    }
  }

  /**
   * Join room theo orderId
   * @param {number} orderId - Order ID
   */
  joinOrderRoom(orderId) {
    if (this.socket && orderId) {
      this.socket.emit('join:order', orderId);
      console.log(`📦 [Socket] Joined order room: ${orderId}`);
    } else {
      console. warn('⚠️ [Socket] Cannot join order room - Socket not connected or orderId missing');
    }
  }

  /**
   * Lắng nghe event từ server
   * @param {string} event - Tên event
   * @param {function} callback - Callback function
   */
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);

      // Lưu listener để có thể remove sau
      if (!this.listeners.has(event)) {
        this.listeners. set(event, []);
      }
      this.listeners.get(event).push(callback);

      console.log(`👂 [Socket] Listening to event: ${event}`);
    } else {
      console.warn(`⚠️ [Socket] Cannot listen to event "${event}" - Socket not connected`);
    }
  }

  /**
   * Hủy lắng nghe event
   * @param {string} event - Tên event
   * @param {function} callback - Callback function
   */
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);

      // Remove từ danh sách listeners
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(callback);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }

      console.log(`🔇 [Socket] Stopped listening to event: ${event}`);
    }
  }

  /**
   * Emit event lên server
   * @param {string} event - Tên event
   * @param {any} data - Dữ liệu gửi đi
   */
  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
      console.log(`📤 [Socket] Emitted event: ${event}`, data);
    } else {
      console.warn(`⚠️ [Socket] Cannot emit event "${event}" - Socket not connected`);
    }
  }

  /**
   * Kiểm tra trạng thái kết nối
   * @returns {boolean}
   */
  isConnected() {
    return this.socket?.connected || false;
  }

  /**
   * Lấy Socket ID
   * @returns {string|null}
   */
  getSocketId() {
    return this.socket?.id || null;
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;