import { useEffect, useCallback } from 'react';
import socketService from '../services/socketService';

/**
 * Custom hook để sử dụng WebSocket
 * @returns {object} - Socket methods
 */
export function useSocket() {
  // Kết nối socket khi component mount
  useEffect(() => {
    if (!socketService.isConnected()) {
      console.log('🔌 [useSocket] Connecting to WebSocket...');
      socketService.connect();
    }

    // Cleanup:  KHÔNG disconnect vì socket dùng chung toàn app
    return () => {
      console.log('🔌 [useSocket] Component unmounted (socket still connected)');
    };
  }, []);

  /**
   * Subscribe to event
   * @param {string} event - Event name
   * @param {function} callback - Callback function
   * @returns {function} - Unsubscribe function
   */
  const on = useCallback((event, callback) => {
    console.log(`👂 [useSocket] Subscribing to event: ${event}`);
    
    socketService.on(event, callback);
    
    // Return cleanup function
    return () => {
      console.log(`🔇 [useSocket] Unsubscribing from event: ${event}`);
      socketService.off(event, callback);
    };
  }, []);

  /**
   * Emit event
   * @param {string} event - Event name
   * @param {any} data - Data to send
   */
  const emit = useCallback((event, data) => {
    console.log(`📤 [useSocket] Emitting event: ${event}`);
    socketService.emit(event, data);
  }, []);

  /**
   * Join user room
   * @param {number} userId - User ID
   */
  const joinUserRoom = useCallback((userId) => {
    console.log(`👤 [useSocket] Joining user room: ${userId}`);
    socketService.joinUserRoom(userId);
  }, []);

  /**
   * Join role room
   * @param {string} role - 'admin' or 'customer'
   */
  const joinRoleRoom = useCallback((role) => {
    console.log(`🎭 [useSocket] Joining role room: ${role}`);
    socketService.joinRoleRoom(role);
  }, []);

  /**
   * Join order room
   * @param {number} orderId - Order ID
   */
  const joinOrderRoom = useCallback((orderId) => {
    console.log(`📦 [useSocket] Joining order room: ${orderId}`);
    socketService.joinOrderRoom(orderId);
  }, []);

  /**
   * Check if socket is connected
   */
  const isConnected = socketService.isConnected();

  /**
   * Get socket ID
   */
  const socketId = socketService.getSocketId();

  return {
    // State
    isConnected,
    socketId,
    
    // Methods
    on,
    emit,
    joinUserRoom,
    joinRoleRoom,
    joinOrderRoom,
  };
}

export default useSocket;