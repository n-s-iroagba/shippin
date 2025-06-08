'use client'

import { useState } from 'react';
import { SocialMedia } from '@/types/socialMedia';
import SocialMediaForm from '@/components/SocialMediaForm';
import AdminOffCanvas from '@/components/AdminOffCanvas';
import { useGetList } from '@/hooks/useFetch';
import AdminSocialMediaCard from '@/components/AdminSocialMediaCard';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { Spinner } from '@/components/Spinner';
import ErrorComponent from '@/components/ErrorComponent';
import { LinkIcon } from '@heroicons/react/24/outline';

export default function SocialMediaCrudPage() {
  const { data: socialMedia, loading, error } = useGetList<SocialMedia>('social-media');
  const [createSocialMedia, setCreateSocialMedia] = useState(false);
  const [socialMediaToDelete, setSocialMediaToDelete] = useState<SocialMedia | null>(null);
  const [socialMediaToUpdate, setSocialMediaToUpdate] = useState<SocialMedia | null>(null);

  if (loading) {
    return (
      <AdminOffCanvas>
        <div className="flex justify-center py-12">
          <Spinner className="w-10 h-10 text-blue-600" />
        </div>
      </AdminOffCanvas>
    );
  }

  if (error) {
    return (
      <AdminOffCanvas>
        <ErrorComponent message={error || "Failed to load social media links"} />
      </AdminOffCanvas>
    );
  }

  return (
    <>
      <AdminOffCanvas>
        <div className="container mx-auto p-4 bg-blue-50 min-h-screen">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">Social Media Links</h1>
              <button
                name='addNewSocialMedia'
                onClick={() => setCreateSocialMedia(true)}
                className="bg-blue-900 text-white px-4 py-2 sm:px-6 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
              >
                Add New Social Media Link
              </button>
            </div>

            {createSocialMedia && (
              <SocialMediaForm />
            )}

            {socialMediaToUpdate && (
              <SocialMediaForm
                existingSocialMedia={socialMediaToUpdate}
                patch
              />
            )}

            {(!socialMedia || socialMedia.length === 0) ? (
              <div className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-100 text-center max-w-md mx-auto">
                <div className="flex justify-center mb-4">
                  <LinkIcon className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">No Social Media Links Yet</h3>
                <p className="text-blue-700">
                  Social media links will appear here once you add them
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {socialMedia.map((sm) => (
                  <AdminSocialMediaCard
                    key={sm.id}
                    socialMedia={sm}
                    onEdit={() => {
                      setSocialMediaToUpdate(sm);
                    }}
                    onDelete={() => setSocialMediaToDelete(sm)}
                  />
                ))}
              </div>
            )}

            {socialMediaToDelete && (
              <DeleteConfirmationModal
                onClose={() => setSocialMediaToDelete(null)}
                id={socialMediaToDelete.id}
                type={'social-media'}
                message={`${socialMediaToDelete.name} (${socialMediaToDelete.url})`}
              />
            )}
          </div>
        </div>
      </AdminOffCanvas>
    </>
  );
}