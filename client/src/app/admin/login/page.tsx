'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/utils/apiUtils';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (formData: Record<string, string>) => {
    try {
      const { data, error: apiError } = await authApi.login({
        email: formData.email,
        password: formData.password
      });

      if (data?.loginToken) {
        localStorage.setItem('admin_token', data.loginToken);
        router.push('/admin/dashboard');
      } else if (apiError) {
        handleApiError(apiError, data as {verificationToken:string});
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again later.');
    }
  };

  const handleApiError = (error: string, data?: {verificationToken:string}) => {
    if (error.includes('Invalid credentials')) {
      setError('Incorrect email or password.');
    } else if (error.includes('Email not verified')) {
      alert('Please verify your email before logging in.');
      router.push(`/admin/verify-email/${data?.verificationToken || ''}`);
    } else {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <>
    <h1 style={{color:'black'}}>fffff</h1>
    <AuthForm
      title="Admin Login"
      fields={[
        { name: 'email', type: 'email', label: 'Email', required: true },
        { name: 'password', type: 'password', label: 'Password', required: true }
      ]}
      onSubmit={handleSubmit}
      error={error}
      buttonText="Login"
      footer={
        <a href="/admin/forgot-password" className="text-blue-500 hover:text-blue-600">
          Forgot Password?
        </a>
      }
    />
    </>
  );
}