
import React, { useState } from 'react';
import { ApiService } from '@/services/api.service';
import { DocumentTemplateAttributes } from '@/types/document-template.types';

interface DocumentTemplateFormProps {
  template?: DocumentTemplateAttributes;
  onSuccess: () => void;
  onClose: () => void;
}

export default function DocumentTemplateForm({ template, onSuccess, onClose }: DocumentTemplateFormProps) {
  const [name, setName] = useState(template?.name || '');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (!name.trim()) {
        throw new Error('Template name is required');
      }

      if (!file && !template) {
        throw new Error('Please select a file');
      }

      const formData = new FormData();
      formData.append('name', name.trim());
      if (file) formData.append('file', file);

      if (template) {
        await ApiService.updateTemplate(template.id.toString(), formData);
      } else {
        await ApiService.createTemplate(formData);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Template Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Template File</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded"
          required={!template}
        />
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-blue text-white rounded"
          disabled={submitting}
        >
          {submitting ? 'Saving...' : template ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
