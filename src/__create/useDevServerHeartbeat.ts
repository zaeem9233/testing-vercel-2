'use client';

import { useEffect } from 'react';

export function useDevServerHeartbeat() {
  useEffect(() => {
    if (import.meta.env.PROD) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const minIntervalMs = 60_000 * 3;
    let lastPing = 0;

    const ping = () => {
      const now = Date.now();
      if (now - lastPing < minIntervalMs) {
        return;
      }
      lastPing = now;

      // HACK: keep dev server alive when preview is popped out
      fetch('/', { method: 'GET' }).catch(() => {
        // no-op
      });
    };

    const events: Array<keyof WindowEventMap> = [
      'click',
      'keydown',
      'mousemove',
      'scroll',
      'touchstart',
      'visibilitychange',
    ];

    events.forEach((event) => window.addEventListener(event, ping, { passive: true }));

    return () => {
      events.forEach((event) => window.removeEventListener(event, ping));
    };
  }, []);
}
