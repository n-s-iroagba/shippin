
'use client'

import { loginUserUrl } from "@/data/urls";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "@/components/Loading";

type LoginError = {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const router = useRouter();

  const [error, setError] = useState<string>('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      const response = await fetch(loginUserUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('admin_token', data);
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  return (
    <div className="flex justify-center align-center pt-5">
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white bg-opacity-90 p-6 rounded-lg border-b-4 border-goldenrod"
      >
        <div className="mb-4">
          <h2 className="text-black text-center">ADMIN LOGIN</h2>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">EMAIL</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">PASSWORD</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-goldenrod text-black py-2 px-4 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
