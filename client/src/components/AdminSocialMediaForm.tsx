// @/components/SocialMediaForm.tsx
'use client';

import { useState } from 'react';
import { SocialMedia } from '@/types/socialMedia';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SocialMediaFormProps {
  existingSocialMedia?: SocialMedia;
  patch?: boolean;
  onClose?: () => void;
}

export default function SocialMediaForm({
  existingSocialMedia,
  patch = false,
  onClose,
}: SocialMediaFormProps) {
  const [formData, setFormData] = useState({
    name: existingSocialMedia?.name || '',
    url: existingSocialMedia?.url || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Your form submission logic here
      console.log('Submitting social media data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form or close modal after successful submission
      if (onClose) {
        onClose();
      } else {
        setFormData({ name: '', url: '' });
      }
    } catch (err) {
      setError('Failed to save social media link');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      setFormData({ name: '', url: '' });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 mb-6">
      <div className="flex items-center justify-between p-6 border-b border-blue-100">
        <h2 className="text-xl font-semibold text-blue-900">
          {patch ? 'Edit Social Media Link' : 'Add New Social Media Link'}
        </h2>
        <button
          onClick={handleCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Platform Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Facebook, Twitter, LinkedIn"
              required
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              type="url"
              id="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
              required
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : patch ? 'Update Link' : 'Add Link'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}