// @/components/AdminStageCard.tsx
'use client';

import { useState } from 'react';

import { 
  MapPinIcon, 
  TruckIcon, 
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { protectedApi } from '@/utils/apiUtils';
import { routes } from '@/data/routes';
import { DocumentModal } from './DocumentModal';
import { Stage } from '@/types/stage.types';

interface AdminStageCardProps {
  stage: Stage;
  onEdit: (stage: Stage) => void;
  onDelete: (stage: Stage) => void;
  onPaymentStatusChange?: (stage: Stage) => void;
}

export default function AdminStageCard({
  stage,
  onEdit,
  onDelete,

}: AdminStageCardProps) {
  const [isTogglingPayment, setIsTogglingPayment] = useState(false);
  const [documentToView, setDocumentToView] = useState<Blob | null>(null);


  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleViewDocument = (document: Blob) =>{
    setDocumentToView(document)
  }



  const handleDetailedPaymentToggle = async (newStatus: string, additionalData?:  {paymentDate:string,
                  amountPaid:number}) => {
    if (isTogglingPayment) return;
    
    setIsTogglingPayment(true);
    try {
     await protectedApi.patch(routes.stage.togglePayment(stage.id), {
        paymentStatus: newStatus,
        ...additionalData
      });
      
      window.location.reload();
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status. Please try again.');
    } finally {
      setIsTogglingPayment(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Info Section */}
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <TruckIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-blue-900">{stage.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(stage)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Stage"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(stage)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Stage"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPinIcon className="w-4 h-4" />
                <span>{stage.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(stage.dateAndTime)}</span>
              </div>
            </div>
          </div>

          {/* Carrier Note */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Carrier Note</h4>
            <p className="text-gray-700">{stage.carrierNote}</p>
          </div>

          {/* Payment & Fee Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {stage.feeName && (
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Fee: {stage.feeName}</span>
              </div>
            )}
            {stage.amountPaid && (
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Paid: {formatCurrency(stage.amountPaid)}</span>
              </div>
            )}
          </div>

          {stage.paymentDate && (
            <div className="text-sm text-gray-500">
              Payment Date: {formatDate(stage.paymentDate)}
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div className="lg:w-64 flex flex-col gap-3">
          {/* Payment Status Actions */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 text-sm">Payment Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDetailedPaymentToggle('PAID', { 
                  paymentDate: new Date().toISOString().split('T')[0],
                  amountPaid: stage.amountPaid || 0 
                })}
                disabled={isTogglingPayment || stage.paymentStatus === 'PAID'}
                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
              >
                Mark Paid
              </button>
              <button
                onClick={() => handleDetailedPaymentToggle('UNPAID')}
                disabled={isTogglingPayment || stage.paymentStatus === 'UNPAID'}
                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                Mark Unpaid
              </button>
              <button
                onClick={() => handleDetailedPaymentToggle('PENDING')}
                disabled={isTogglingPayment || stage.paymentStatus === 'PENDING'}
                className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors disabled:opacity-50"
              >
                Mark Pending
              </button>
              <button
                onClick={() => handleDetailedPaymentToggle('NO_PAYMENT_REQUIRED')}
                disabled={isTogglingPayment || stage.paymentStatus === 'NO_PAYMENT_REQUIRED'}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                No Payment Required
              </button>
            </div>
          </div>

          {/* Document Actions */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 text-sm">Documents</h4>
            
            {/* Payment Receipts */}
            {stage.paymentReceipts && stage.paymentReceipts.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs text-gray-600 mb-2">
                  Payment Receipts ({stage.paymentReceipts.length})
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {stage.paymentReceipts.map((reciept, index) => (
                    <button
                      key={index}
                      onClick={() => handleViewDocument(reciept)}
                      className="w-full bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2 justify-center text-sm"
                    >
                      <EyeIcon className="w-4 h-4" />
                      View Receipt {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-3 border border-dashed border-gray-300 rounded-lg">
                No payment receipts available
              </div>
            )}

        
          </div>

          {/* Location Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium text-gray-900 text-sm mb-2">Coordinates</h4>
            <div className="text-xs text-gray-600">
              <div>Lat: {stage.latitude?.toFixed(6) || 'N/A'}</div>
              <div>Lng: {stage.longitude?.toFixed(6) || 'N/A'}</div>
            </div>
          </div>

          {/* Stage Info */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-gray-900 text-sm mb-2">Stage Info</h4>
            <div className="text-xs text-gray-600">
              <div>ID: {stage.id}</div>
              <div>Shipment: {stage.shipmentId}</div>
              <div>Created: {formatDate(stage.createdAt)}</div>
            </div>
          </div>
        </div>
      </div>
      {documentToView && <DocumentModal onClose={()=>setDocumentToView(null)} document={documentToView} title={'payment Reciept'}  />}
        </div>
  );

}