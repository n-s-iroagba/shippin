'use client';

import { useAuth } from '@/hooks/useAuth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, loading } = useAuth(true);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-4 items-center">
              <a href="/admin/dashboard" className={`px-3 py-2 rounded-md`}>
                Dashboard
              </a>
              <a href="/admin/pending-payments" className={`px-3 py-2 rounded-md`}>
                Pending Payments
              </a>
              <a href="/admin/wallets" className={`px-3 py-2 rounded-md`}>
                Wallets
              </a>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {
                  localStorage.removeItem('admin_token');
                  //router.push('/admin/login');  //Removed as useAuth handles this implicitly.
                }}
                className="px-3 py-2 text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}