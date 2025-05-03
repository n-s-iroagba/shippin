
import { useState } from 'react';
import { SocialMediaAttributes, CreateSocialMediaDto } from '@/types/social-media.types';

interface Props {
  social?: SocialMediaAttributes;
  onSubmit: (data: CreateSocialMediaDto) => Promise<void>;
  onCancel: () => void;
}

export default function SocialMediaForm({ social, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<CreateSocialMediaDto>({
    name: social?.name || '',
    url: social?.url || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error: any) {
      if (error.status === 400) {
        setErrors(error.data || {});
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Platform Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">URL</label>
        <input
          type="url"
          name="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary-blue text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {social ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
