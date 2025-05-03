
'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShipmentDetails, ShipmentStatus } from '@/types/shipment.types';
import { ApiService } from '@/services/api.service';
import Loading from '@/components/Loading';
import PaymentModal from '@/components/PaymentModal';
import { formatDate } from '@/utils/utils';

export default function TrackingDashboard() {
  const { trackingId } = useParams();
  const [shipment, setShipment] = useState<ShipmentDetails | null>(null);
  const [statuses, setStatuses] = useState<ShipmentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollModal, setShowScrollModal] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<string | null>(null);
  const lastStatusRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const getLocation = async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const response = await ApiService.trackShipment(
          trackingId as string,
          position.coords.latitude,
          position.coords.longitude
        );

        setShipment(response.shipmentDetails);
        setStatuses(response.shipmentStatuses);
      } catch (err: any) {
        if (err.message === 'Tracking ID not found') {
          setError('Tracking ID not found');
        } else {
          setError('An error occurred while fetching tracking data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, [trackingId]);

  const scrollToLatestStatus = () => {
    lastStatusRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePayment = (statusId: string) => {
    router.push(`/payment/${statusId}`);
  };

  const handleUploadReceipt = (statusId: string) => {
    setSelectedStatusId(statusId);
    setShowPaymentModal(true);
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {showScrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Go to most recent status?</h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  scrollToLatestStatus();
                  setShowScrollModal(false);
                }}
                className="bg-primary-blue text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setShowScrollModal(false)}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && selectedStatusId && (
        <PaymentModal
          statusId={selectedStatusId}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedStatusId(null);
          }}
          onSuccess={() => {
            setShowPaymentModal(false);
            setSelectedStatusId(null);
            window.location.reload();
          }}
        />
      )}

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Shipment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Tracking ID</p>
            <p>{shipment?.shipmentID}</p>
          </div>
          <div>
            <p className="font-semibold">Sender</p>
            <p>{shipment?.senderName}</p>
          </div>
          <div>
            <p className="font-semibold">Recipient</p>
            <p>{shipment?.recipientName}</p>
          </div>
          <div>
            <p className="font-semibold">Delivery Address</p>
            <p>{shipment?.receivingAddress}</p>
          </div>
        </div>
      </div>

      <div data-testid="status-list" className="space-y-4">
        {statuses.map((status, index) => (
          <div
            key={status.id}
            ref={index === statuses.length - 1 ? lastStatusRef : null}
            className="bg-white shadow rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-2">{status.title}</h3>
            <p className="text-gray-600 mb-4">{status.carrierNote}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {formatDate(status.dateAndTime)}
              </span>
              {status.requiresFee && status.paymentStatus === 'YET_TO_BE_PAID' && (
                <div className="space-x-4">
                  <button
                    onClick={() => handlePayment(status.id)}
                    className="bg-primary-blue text-white px-4 py-2 rounded"
                  >
                    Make Payment
                  </button>
                  <button
                    onClick={() => handleUploadReceipt(status.id)}
                    className="bg-gray-200 px-4 py-2 rounded"
                  >
                    Upload Receipt
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
