
'use client';

import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api.service';
import { DocumentTemplateAttributes } from '@/types/document-template.types';
import DocumentTemplateForm from '@/components/DocumentTemplateForm';
import Loading from '@/components/Loading';

export default function DocumentTemplatesPage() {
  const [templates, setTemplates] = useState<DocumentTemplateAttributes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplateAttributes | null>(null);

  const fetchTemplates = async () => {
    try {
      const data = await ApiService.listDocumentTemplates();
      setTemplates(data);
      setError('');
    } catch (err: any) {
      setError('Unable to load document templates. Please try again later.');
      console.error('Failed to fetch templates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      await ApiService.deleteDocumentTemplate(id);
      await fetchTemplates();
    } catch (err: any) {
      setError('Could not delete document template. Please try again later.');
    }
  };

  const handleDownload = async (id: number) => {
    try {
      window.location.href = `/api/admin/templates/${id}/download`;
    } catch (err: any) {
      setError('Could not download document template. Please try again later.');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Document Templates</h1>
        <button
          onClick={() => {
            setSelectedTemplate(null);
            setShowForm(true);
          }}
          className="bg-primary-blue text-white px-4 py-2 rounded"
        >
          Create Template
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedTemplate ? 'Edit Template' : 'Create Template'}
            </h2>
            <DocumentTemplateForm
              template={selectedTemplate || undefined}
              onSuccess={() => {
                setShowForm(false);
                setSelectedTemplate(null);
                fetchTemplates();
              }}
              onClose={() => {
                setShowForm(false);
                setSelectedTemplate(null);
              }}
            />
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {templates.map((template) => (
          <div key={template.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h3 className="font-medium">{template.name}</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(template.id)}
                className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
              >
                Download
              </button>
              <button
                onClick={() => {
                  setSelectedTemplate(template);
                  setShowForm(true);
                }}
                className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(template.id)}
                className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
