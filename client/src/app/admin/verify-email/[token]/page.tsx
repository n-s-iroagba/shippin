
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ApiService } from '@/services/api.service';


export default function VerifyEmail() {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(180);
  const router = useRouter();
  const params = useParams(); 
  const verificationToken = params.token as string;
  const [token, setToken] = useState(verificationToken)


 
  
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
      const response = await ApiService.verifyEmail({
        code: verificationCode,
        verificationToken
      });

      if (response.token) {
        localStorage.setItem('admin_token', response.token);
        alert('Verification successful! You\'re now logged in.');
        router.push('/admin/dashboard');
      } else if (response.error) {
        console.error('Verification error:', response.error);
        if (response.error.message.includes('Admin not found')) {
          setError('Verification failed. No admin found for this verification link.');
        } else if (response.error.message.includes('Invalid token') || response.error.message.includes('Wrong token')) {
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
      const { verificationToken, error } = await ApiService.resendVerification(
      token
      );

      if (verificationToken) {
        setCanResend(false);
        setCountdown(180);
        setToken(verificationToken)
        alert('New verification code has been sent to your email.');
      } else if (error) {
        console.error('Resend error:', error);
        if (error.message.includes('Admin not found')) {
          setError('No admin found for this verification link.');
        } else if (error.message.includes('Invalid token')) {
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
