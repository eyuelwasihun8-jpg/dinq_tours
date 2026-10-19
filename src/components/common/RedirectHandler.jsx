import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRedirectForPath } from '../../data/migrationMap';

export default function RedirectHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const targetUrl = getRedirectForPath(location.pathname);
    if (targetUrl && targetUrl !== location.pathname) {
      console.log(`[SEO 301 Migration] Redirecting legacy URL: ${location.pathname} -> ${targetUrl}`);
      navigate(targetUrl, { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
}
