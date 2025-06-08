// components/DocumentTemplateForm.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { DocumentTemplateAttributes } from '@/types/document-template.types';
import { protectedApi } from '@/utils/api';
import { XMarkIcon, DocumentTextIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface DocumentTemplateFormProps {
  existingTemplate?: DocumentTemplateAttributes;
  patch?: boolean;
  onClose: () => void;
}

const DocumentTemplateForm: React.FC<DocumentTemplateFormProps> = ({
  existingTemplate,
  patch = false,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingTemplate) {
      setFormData({
        name: existingTemplate.name,
        description: existingTemplate.description || '',
      });
    }
  }, [existingTemplate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const adminId = localStorage.getItem('admin_id');
      if (!adminId) {
        throw new Error('Admin ID not found');
      }

      // For updates, we may not need a new file
      if (!patch && !file) {
        throw new Error('Please select a file to upload');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      if (formData.description) {
        formDataToSend.append('description', formData.description);
      }
      if (file) {
        formDataToSend.append('file', file);
      }

      if (patch && existingTemplate) {
        await protectedApi.patch(`/admin/templates/${adminId}/${existingTemplate.id}`, formDataToSend);
      } else {
        await protectedApi.post(`/admin/templates/${adminId}`, formDataToSend);
      }

      onClose();
      // Refresh the page to show updated data
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-fill name if it's empty
      if (!formData.name) {
        setFormData(prev => ({ ...prev, name: selectedFile.name }));
      }
    }
  };

  const acceptedFileTypes = '.doc,.docx,.pdf,.txt,.rtf,.odt';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {patch ? 'Edit' : 'Add'} Document Template
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Template Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter template name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Enter template description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                Template File {!patch && '*'}
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file"
                        name="file"
                        type="file"
                        className="sr-only"
                        accept={acceptedFileTypes}
                        onChange={handleFileChange}
                        {...(!patch && { required: true })}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    DOC, DOCX, PDF, TXT, RTF, ODT up to 10MB
                  </p>
                  {file && (
                    <p className="text-sm text-green-600 font-medium">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Saving...' : (patch ? 'Update' : 'Add')} Template
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentTemplateForm;