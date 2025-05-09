
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth(requireAuth = true) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token && requireAuth) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(!!token);
    }
    setLoading(false);
  }, [requireAuth]);

  const logout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  return { isAuthenticated, loading, logout };
}
