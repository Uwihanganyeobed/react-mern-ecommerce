import React, { createContext, useContext, useState, useEffect } from 'react';
import { notification as notificationApi } from '../services/api';
import { toast } from 'react-toastify';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationApi.getMyNotifications();
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications(notifications.map(notif => 
        notif._id === notificationId ? { ...notif, isRead: true } : notif
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      toast.error('Error marking notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Error marking notifications as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      setNotifications(notifications.filter(notif => notif._id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Error deleting notification');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 