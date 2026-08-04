import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../lib/api';

const getSessionId = () => {
  let id = sessionStorage.getItem('analytics_session_id');
  if (!id) {
    id = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('analytics_session_id', id);
  }
  return id;
};

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await api.post('/analytics/visit', {
          session_id: getSessionId(),
          page: location.pathname,
          referrer: document.referrer,
          device: 'Unknown',
          browser: 'Unknown',
          os: 'Unknown',
          screen: `${window.screen.width}x${window.screen.height}`,
        });
      } catch (error) {
        // Silent fail - don't break the app
        console.debug('Analytics tracking skipped:', error.message);
      }
    };

    const timeout = setTimeout(trackPageView, 100);
    return () => clearTimeout(timeout);
  }, [location.pathname]);
}
