// @/components/DocumentModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface DocumentModalProps {
  onClose: () => void;
  document: Blob ;
  title: string;


}

export function DocumentModal({ onClose, document, title}: DocumentModalProps) {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);
  const [isPdf, setIsPdf] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!document) {
      setError('No document available');
      setLoading(false);
      return;
    }

    try {
      let url: string;
      let detectedFileType: string;

      if (document instanceof File) {
        url = URL.createObjectURL(document);
        detectedFileType = document.type;
      } else if (document instanceof Buffer || (document && typeof document === 'object')) {
        // Handle Buffer or API response
        const blob = new Blob([document], { type:  'application/octet-stream' });
        url = URL.createObjectURL(blob);
        detectedFileType = 'application/octet-stream';
      } else {
        throw new Error('Unsupported document type');
      }

      setDocumentUrl(url);
      setIsImage(detectedFileType.startsWith('image/'));
      setIsPdf(detectedFileType === 'application/pdf');
      setLoading(false);

      // Cleanup function
      return () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
    } catch (error) {
      console.error('Error loading document:', error);
      setError('Failed to load document');
      setLoading(false);
    }
  }, [document,]);

  const handleDownload = () => {
    if (documentUrl && typeof window !== 'undefined') {
      const link = window.document.createElement('a');
      link.href = documentUrl;
      link.download = `-${title}`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
           
          </div>
          <div className="flex items-center gap-3">
            {documentUrl && (
              <button
                onClick={handleDownload}
                className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                title="Download document"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-auto">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading document...</span>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <DocumentTextIcon className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Document Not Available</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          )}

          {documentUrl && !loading && !error && (
            <>
              {isImage && (
                <div className="text-center">
                  <Image
                    src={documentUrl}
                    alt="Document"
                    className="max-w-full h-auto rounded-lg shadow-md"
                    width={800}
                    height={600}
                  />
                </div>
              )}

              {isPdf && (
                <div className="w-full h-96">
                  <iframe
                    src={documentUrl}
                    className="w-full h-full border rounded-lg"
                    title="PDF Document"
                  />
                </div>
              )}

              {!isImage && !isPdf && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <DocumentTextIcon className="w-16 h-16 text-blue-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Document Ready</h3>
                  <p className="text-gray-600 mb-4">
                    This document type can&apos;t be previewed. Click download to view it.
                  </p>
                  <button
                    onClick={handleDownload}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Download Document
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}