'use client'
import { useState } from 'react';
import { DocumentTemplateAttributes } from '@/types/document-template.types';
import DocumentTemplateForm from '@/components/DocumentTemplateForm';
import AdminDocumentTemplateCard from '@/components/AdminDocumentTemplateCard';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { Spinner } from '@/components/Spinner';
import ErrorAlert from '@/components/ErrorAlert';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { useGetList } from '@/hooks/useGet';
import { routes } from '@/data/routes';
import { useAuth } from '@/hooks/useAuth';

export default function DocumentTemplateCrudPage() {
  const { id, displayName } = useAuth();
  const { data: templates, loading, error } = useGetList<DocumentTemplateAttributes>(routes.templates.list(id));
  const [createTemplate, setCreateTemplate] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<DocumentTemplateAttributes | null>(null);
  const [templateToUpdate, setTemplateToUpdate] = useState<DocumentTemplateAttributes | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="w-10 h-10 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <ErrorAlert message={error || "Failed to load document templates"} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">{displayName}&apos;s Document Templates</h1>
          <button
            name='addNewTemplate'
            onClick={() => setCreateTemplate(true)}
            className="bg-blue-900 text-white px-4 py-2 sm:px-6 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Add New Template
          </button>
        </div>

        {uploadError && (
          <div className="mb-6">
            <ErrorAlert message={uploadError} />
          </div>
        )}

        {createTemplate && (
          <DocumentTemplateForm
            onClose={() => {
              setCreateTemplate(false);
              setUploadError(null);
              window.location.reload();
            }}
          />
        )}

        {templateToUpdate && (
          <DocumentTemplateForm
            existingTemplate={templateToUpdate}
            patch
            onClose={() => {
              setTemplateToUpdate(null);
              setUploadError(null);
              window.location.reload();
            }}
          />
        )}

        {(!templates || templates.length === 0) ? (
          <div className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-100 text-center max-w-md mx-auto">
            <div className="flex justify-center mb-4">
              <DocumentTextIcon className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">No Templates Yet</h3>
            <p className="text-blue-700">
              Document templates will appear here once you create them
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {templates.map((template) => (
              <AdminDocumentTemplateCard
                key={template.id}
                template={template}
                onEdit={() => {
                  setTemplateToUpdate(template);
                  setUploadError(null);
                }}
                onDelete={() => setTemplateToDelete(template)}
              />
            ))}
          </div>
        )}

        {templateToDelete && (
          <DeleteConfirmationModal
            onClose={() => {
              setTemplateToDelete(null);
              window.location.reload();
            }}
            id={templateToDelete.id}
            type={'document-template'}
            message={`${templateToDelete.name}`}
          />
        )}
      </div>
    </div>
  );
}