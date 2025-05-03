
'use client';

import { useState } from 'react';
import ShipmentForm from '@/components/ShipmentForm';
import { useRouter } from 'next/navigation';

export default function CreateShipmentPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleCreateShipment = async (data: CreateShipmentDetailsDto) => {
    try {
      const response = await fetch('/api/admin/shipment-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create shipment');
      }

      router.push('/admin/shipments');
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ShipmentForm mode="create" onSubmit={handleCreateShipment} />
    </div>
  );
}
