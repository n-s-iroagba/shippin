
import React, { useState } from 'react';
import { ApiService } from '@/services/api.service';
import { CreateFiatPlatformDto, FiatPlatformAttributes } from '@/types/fiat-platform.types';

interface FiatPlatformFormProps {
  platform?: FiatPlatformAttributes;
  onSuccess: () => void;
  onClose: () => void;
}

export default function FiatPlatformForm({ platform, onSuccess, onClose }: FiatPlatformFormProps) {
  const [formData, setFormData] = useState<CreateFiatPlatformDto>({
    name: platform?.name || '',
    baseUrl: platform?.baseUrl || '',
    messageTemplate: platform?.messageTemplate || ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateFiatPlatformDto, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CreateFiatPlatformDto, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.baseUrl.trim()) newErrors.baseUrl = 'Base URL is required';
    if (!formData.messageTemplate.trim()) {
      newErrors.messageTemplate = 'Message template is required';
    } else if (!formData.messageTemplate.includes('{amount}') || !formData.messageTemplate.includes('{statusId}')) {
      newErrors.messageTemplate = 'Message template must include {amount} and {statusId} placeholders';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (platform) {
        await ApiService.updateFiatPlatform(platform.id, formData);
      } else {
        await ApiService.createFiatPlatform(formData);
      }
      onSuccess();
    } catch (err: any) {
      if (err.status === 400 && err.data?.errors) {
        setErrors(err.data.errors);
      } else if (err.status === 403) {
        setErrors({
          _global: 'You do not have permission to edit this platform.'
        });
      } else if (err.status === 404) {
        setErrors({
          _global: 'Fiat platform not found.'
        });
      } else if (err.status === 500) {
        setErrors({
          _global: `Could not ${platform ? 'update' : 'create'} fiat platform. Please try again later.`
        });
      } else {
        setErrors({
          _global: 'An unexpected error occurred. Please try again later.'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="fiat-platform-form">
      {errors._global && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded" data-testid="global-error">
          {errors._global}
        </div>
      )}
      <div>
        <label className="block mb-2" htmlFor="platform-name">Name</label>
        <input
          id="platform-name"
          type="text"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded"
          disabled={submitting}
          data-testid="platform-name-input"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1" data-testid="name-error">
            {errors.name}
          </p>
        )}
      </div>
      <div>
        <label className="block mb-2" htmlFor="platform-url">Base URL</label>
        <input
          id="platform-url"
          type="url"
          value={formData.baseUrl}
          onChange={e => setFormData({ ...formData, baseUrl: e.target.value })}
          className="w-full p-2 border rounded"
          disabled={submitting}
          data-testid="platform-url-input"
        />
        {errors.baseUrl && (
          <p className="text-red-500 text-sm mt-1" data-testid="url-error">
            {errors.baseUrl}
          </p>
        )}
      </div>
      <div>
        <label className="block mb-2" htmlFor="platform-template">Message Template</label>
        <textarea
          id="platform-template"
          value={formData.messageTemplate}
          onChange={e => setFormData({ ...formData, messageTemplate: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="e.g. I am paying {amount} for status {statusId}"
          disabled={submitting}
          data-testid="platform-template-input"
        />
        <p className="text-sm text-gray-500 mt-1">
          Use {'{amount}'} and {'{statusId}'} placeholders in your message
        </p>
        {errors.messageTemplate && (
          <p className="text-red-500 text-sm mt-1" data-testid="template-error">
            {errors.messageTemplate}
          </p>
        )}
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded"
          disabled={submitting}
          data-testid="cancel-button"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-blue text-white rounded"
          disabled={submitting}
          data-testid="submit-button"
        >
          {submitting ? 'Saving...' : platform ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
