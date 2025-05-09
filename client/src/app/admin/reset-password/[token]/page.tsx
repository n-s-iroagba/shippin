
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/utils/apiUtils';
import Loading from '@/components/Loading';

export default function ResetPassword({ params }: { params: { token: string } }) {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Validate token on mount
    const validateToken = async () => {
      try {
        const { error: validationError } = await authApi.validateResetToken(params.token);
        if (validationError) {
          setError('This reset link is invalid or has expired. Please request a new one.');
          setTimeout(() => router.push('/admin/forgot-password'), 3000);
        }
      } catch (err) {
        setError('Unable to validate reset token. Please try again later.');
      } finally {
        setValidatingToken(false);
      }
    };
    validateToken();
  }, [params.token]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { data, error: apiError } = await authApi.resetPassword({
        password: formData.password,
        resetToken: params.token
      });

      if (data) {
        alert('Password reset successful! Please log in with your new password.');
        router.push('/admin/login');
      } else if (apiError) {
        if (apiError.includes('Invalid or expired token')) {
          setError('This reset link is invalid or has expired. Please request a new one.');
          setTimeout(() => router.push('/admin/forgot-password'), 3000);
        } else if (apiError.includes('Admin not found')) {
          setError('No admin account associated with this link.');
        } else {
          setError('An error occurred. Please try again later.');
        }
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <Loading />
          <p className="mt-4">Validating reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              New Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              disabled={loading}
              minLength={8}
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 8 characters long and contain uppercase, lowercase, and numbers
            </p>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? <Loading /> : 'Reset Password'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/admin/login" className="text-blue-500 hover:text-blue-600">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
