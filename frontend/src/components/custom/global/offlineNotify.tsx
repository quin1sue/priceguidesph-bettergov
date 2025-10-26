'use client';
import { useState, useEffect } from 'react';

export default function OfflineNotifier() {
  const [isOffline, setIsOffline] = useState(false);

   useEffect(() => {
    // Only runs on client
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <section className="text-gray-800 text-center py-2 z-50">
      <small className="font-semibold">You are currently offline. Some data may not be available.</small>
    </section>
  );
}
