
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token && !pathname.includes('/login') && !pathname.includes('/signup')) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname]);

  if (!isAuthenticated && !pathname.includes('/login') && !pathname.includes('/signup')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {isAuthenticated && !pathname.includes('/login') && !pathname.includes('/signup') && (
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-4 items-center">
                <a href="/admin/dashboard" className={`px-3 py-2 rounded-md ${pathname === '/admin/dashboard' ? 'bg-gray-900 text-white' : 'text-gray-900'}`}>
                  Dashboard
                </a>
                <a href="/admin/pending-payments" className={`px-3 py-2 rounded-md ${pathname === '/admin/pending-payments' ? 'bg-gray-900 text-white' : 'text-gray-900'}`}>
                  Pending Payments
                </a>
                <a href="/admin/wallets" className={`px-3 py-2 rounded-md ${pathname === '/admin/wallets' ? 'bg-gray-900 text-white' : 'text-gray-900'}`}>
                  Wallets
                </a>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => {
                    localStorage.removeItem('admin_token');
                    router.push('/admin/login');
                  }}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}
