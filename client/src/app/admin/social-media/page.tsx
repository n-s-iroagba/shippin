
'use client';

import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api.service';
import SocialMediaForm from '@/components/SocialMediaForm';
import Loading from '@/components/Loading';
import { SocialMediaAttributes } from '@/types/social-media.types';

export default function SocialMediaPage() {
  const [socialMedia, setSocialMedia] = useState<SocialMediaAttributes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedSocial, setSelectedSocial] = useState<SocialMediaAttributes | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchSocialMedia = async () => {
    try {
      const data = await ApiService.listSocialMedia();
      setSocialMedia(data);
      setError('');
    } catch (err: any) {
      setError('Unable to load social media links. Please try again later.');
      console.error('Failed to fetch social media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      if (selectedSocial) {
        await ApiService.updateSocialMedia(selectedSocial.id, data);
        setSuccessMessage('Social media link updated successfully');
      } else {
        await ApiService.createSocialMedia(data);
        setSuccessMessage('Social media link created successfully');
      }
      setShowForm(false);
      fetchSocialMedia();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      throw err;
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this social media link?')) return;
    
    try {
      await ApiService.deleteSocialMedia(id);
      setSocialMedia(socialMedia.filter(s => s.id !== id));
      setSuccessMessage('Social media link deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      if (err.status === 403) {
        setError('You do not have permission to delete this link.');
      } else if (err.status === 404) {
        setError('Social media link not found.');
      } else {
        setError('Could not delete social media link. Please try again later.');
      }
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Social Media Links</h1>
        <button
          onClick={() => {
            setSelectedSocial(null);
            setShowForm(true);
          }}
          className="bg-primary-blue text-white px-4 py-2 rounded"
        >
          Add Social Media
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      {showForm && (
        <div className="mb-6 p-4 border rounded">
          <SocialMediaForm
            social={selectedSocial || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="grid gap-4">
        {socialMedia.map((social) => (
          <div key={social.id} className="border p-4 rounded">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{social.name}</h3>
                <a href={social.url} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-500 hover:underline">{social.url}</a>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setSelectedSocial(social);
                    setShowForm(true);
                  }}
                  className="text-primary-blue"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(social.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
