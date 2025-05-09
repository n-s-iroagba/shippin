'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/utils/apiUtils';
import AuthForm from '@/components/AuthForm';

export default function SignupPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (formData: Record<string, string>) => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { data, error: apiError } = await authApi.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (data?.verificationToken) {
        router.push(`/admin/verify-email/${data.verificationToken}`);
      } else if (apiError) {
        if (apiError.includes('already exists')) {
          setError('An admin with this email already exists. Please try logging in instead.');
        } else {
          setError('An error occurred. Please try again later.');
        }
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <AuthForm
      title="Admin Signup"
      fields={[
        { name: 'name', type: 'text', label: 'Name', required: true },
        { name: 'email', type: 'email', label: 'Email', required: true },
        { name: 'password', type: 'password', label: 'Password', required: true, minLength: 8 },
        { name: 'confirmPassword', type: 'password', label: 'Confirm Password', required: true }
      ]}
      onSubmit={handleSubmit}
      error={error}
      buttonText="Sign Up"
    />
  );
}