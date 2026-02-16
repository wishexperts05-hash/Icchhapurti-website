// useNotifications.js
import { useEffect, useState } from 'react';
import { messaging, getToken, onMessage } from '../src/utils/firebaseConfig';

const useNotifications = () => {
  const [permission, setPermission] = useState(Notification.permission);
  const [fcmToken, setFcmToken] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestPermission = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // ✅ Check browser support
      if (!('Notification' in window)) {
        throw new Error('This browser does not support notifications');
      }

      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker is not supported');
      }

      // ✅ Request permission
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // ✅ Get FCM token
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });

      if (!token) {
        throw new Error('Failed to get FCM token');
      }

      console.log('🔥 FCM Token:', token);
      setFcmToken(token);

      // ✅ Save to backend with device info
      await saveTokenToBackend(token);

      return token;
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveTokenToBackend = async (token) => {
    try {
      const authToken = localStorage.getItem('token');
      
      if (!authToken) {
        console.warn('⚠️  No auth token, skipping save');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/fcm/add-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify({ 
            token,
            deviceInfo: {
              userAgent: navigator.userAgent,
              platform: navigator.platform,
              language: navigator.language,
              timestamp: new Date().toISOString()
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save token');
      }

      console.log('✅ Token saved to backend');
    } catch (err) {
      console.error('❌ Error saving token:', err);
      // Don't throw - token is still valid locally
    }
  };

  // ✅ Setup foreground message handler
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('📨 Foreground notification:', payload);

      if (Notification.permission === 'granted') {
        const { title, body, icon, image } = payload.notification || {};
        
        new Notification(title || 'New Notification', {
          body: body || 'You have a new message',
          icon: icon || '/firebase-logo.png',
          image: image,
          badge: '/badge-icon.png',
          data: payload.data,
          tag: payload.data?.type || 'default'
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    permission,
    fcmToken,
    error,
    isLoading,
    requestPermission
  };
};

export default useNotifications;