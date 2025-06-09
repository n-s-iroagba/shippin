// components/AdminDocumentTemplateCard.tsx
'use client';
import React from 'react';
import { DocumentTemplateAttributes } from '@/types/document-template.types';
import { 
  PencilIcon, 
  TrashIcon, 
  DocumentTextIcon, 
  ArrowDownTrayIcon,
  CalendarIcon,
  HashtagIcon
} from '@heroicons/react/24/outline';

interface AdminDocumentTemplateCardProps {
  template: DocumentTemplateAttributes;
  onEdit: () => void;
  onDelete: () => void;
}

const AdminDocumentTemplateCard: React.FC<AdminDocumentTemplateCardProps> = ({
  template,
  onEdit,
  onDelete,
}) => {
  const handleDownload = async () => {
    try {
      const adminId = localStorage.getItem("admin_id");
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'}/admin/templates/${adminId}/${template.id}/download`);

      if (!response.ok) {
        throw new Error(`Failed to download template: ${response.stageText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = template.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download template:", error);
      alert("Failed to download template");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <DocumentTextIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900">
                  {template.name}
                </h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {getFileExtension(template.name)}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <HashtagIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Template ID: <span className="font-medium">#{template.id}</span>
                  </span>
                </div>
                {template.createdAt && (
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Created: <span className="font-medium">{formatDate(template.createdAt)}</span>
                    </span>
                  </div>
                )}
                {template.updatedAt && template.updatedAt !== template.createdAt && (
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Updated: <span className="font-medium">{formatDate(template.updatedAt)}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
              title="Download template"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit template"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete template"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {template.description && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Description:</div>
              <div className="text-sm text-gray-700">
                {template.description}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDocumentTemplateCard;