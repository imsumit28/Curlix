import { useEffect, useRef } from 'react';

export default function Turnstile({ onVerify }) {
  const containerRef = useRef(null);
  const widgetId = useRef(null);

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    const render = () => {
      if (window.turnstile && containerRef.current && widgetId.current === null) {
        widgetId.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: onVerify,
          'expired-callback': () => onVerify(null),
          theme: 'dark',
        });
      }
    };

    if (window.turnstile) {
      render();
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          render();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    return () => {
      if (widgetId.current !== null && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [siteKey, onVerify]);

  if (!siteKey) return null;
  return <div ref={containerRef} className="mt-2" />;
}
