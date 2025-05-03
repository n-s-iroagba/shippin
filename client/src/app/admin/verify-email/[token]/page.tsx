
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { authApi } from '@/utils/apiUtils';

export default function VerifyEmail() {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3 minutes
  const router = useRouter();
  const params = useParams();
  const verificationToken = params.token as string;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: apiError } = await authApi.verifyEmail({
        code: verificationCode,
        verificationToken
      });

      if (data?.loginToken) {
        localStorage.setItem('admin_token', data.loginToken);
        alert('Verification successful! You\'re now logged in.');
        router.push('/admin/dashboard');
      } else if (apiError) {
        console.error('Verification error:', apiError);
        if (apiError.includes('Admin not found')) {
          setError('Verification failed. No admin found for this verification link.');
        } else if (apiError.includes('Invalid token') || apiError.includes('Wrong token')) {
          setError('Invalid verification code. Please check and try again.');
        } else {
          setError('Something went wrong. Please try again later.');
        }
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setLoading(true);

    try {
      const { data, error: apiError } = await authApi.resendVerification({
        verificationToken
      });

      if (data?.verificationToken) {
        setCanResend(false);
        setCountdown(180);
        alert('New verification code has been sent to your email.');
      } else if (apiError) {
        console.error('Resend error:', apiError);
        if (apiError.includes('Admin not found')) {
          setError('No admin found for this verification link.');
        } else if (apiError.includes('Invalid token')) {
          setError('This verification link is invalid or expired. Please sign up again.');
        } else {
          setError('Failed to resend verification code. Please try again later.');
        }
      }
    } catch (err) {
      console.error('Resend error:', err);
      setError('Failed to resend verification code. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify Your Email</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              maxLength={6}
              pattern="\d{6}"
              title="Please enter the 6-digit verification code"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300 mb-4"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        {!canResend ? (
          <p className="text-center text-gray-600">
            Resend code in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={loading}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-300"
          >
            {loading ? 'Sending...' : 'Resend Code'}
          </button>
        )}
      </div>
    </div>
  );
}
