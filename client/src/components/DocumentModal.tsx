'use client';

import { useState } from 'react';

interface DocumentModalProps {
  url: string;
  title?: string;
}

export default function DocumentModal({ url, title = 'Document Viewer' }: DocumentModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        View Document
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-3 text-xl text-gray-600 hover:text-black"
            >
              ×
            </button>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">{title}</h2>
              <iframe
                src={url}
                className="w-full h-[70vh]"
                title={title}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
