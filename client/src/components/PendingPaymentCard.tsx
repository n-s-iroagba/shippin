// @/components/PendingPaymentCard.tsx
'use client';

import { Stage } from '@/types/stage.types';
import { 
  MapPinIcon, 
  TruckIcon, 
  DocumentTextIcon, 
  CreditCardIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface PendingPaymentCardProps {
  Stage: Stage;
  onViewDocument: (stage: Stage, type: 'supportingDocument' | 'paymentReceipt', receiptIndex?: number) => void;
  onApprovePayment: (stage: Stage) => void;
}

export default function PendingPaymentCard({
  Stage,
  onViewDocument,
  onApprovePayment,
}: PendingPaymentCardProps) {
  const getPaymentStatusBadge = (stage: string) => {
    const stageConfig = {
      'NO_PAYMENT_REQUIRED': { color: 'bg-gray-100 text-gray-700', icon: CheckCircleIcon, text: 'No Payment Required' },
      'UNPAID': { color: 'bg-red-100 text-red-700', icon: XCircleIcon, text: 'Unpaid' },
      'PENDING': { color: 'bg-yellow-100 text-yellow-700', icon: ClockIcon, text: 'Pending' },
      'PAID': { color: 'bg-green-100 text-green-700', icon: CheckCircleIcon, text: 'Paid' },
    };

    const config = stageConfig[stage as keyof typeof stageConfig];
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.text}
      </div>
    );
  };

  const formatDate = (date: Date) => {
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Info Section */}
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <TruckIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">{Stage.title}</h3>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPinIcon className="w-4 h-4" />
                <span>{Stage.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <CalendarIcon className="w-4 h-4" />
                <span>{formatDate(Stage.dateAndTime)}</span>
              </div>
              {getPaymentStatusBadge(Stage.paymentStatus)}
            </div>
          </div>

          {/* Carrier Note */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Carrier Note</h4>
            <p className="text-gray-700">{Stage.carrierNote}</p>
          </div>

          {/* Payment & Fee Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {Stage.feeName && (
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Fee: {Stage.feeName}</span>
              </div>
            )}
            {Stage.amountPaid && (
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Paid: {formatCurrency(Stage.amountPaid)}</span>
              </div>
            )}
          </div>

          {Stage.paymentDate && (
            <div className="text-sm text-gray-500">
              Payment Date: {formatDate(Stage.paymentDate)}
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div className="lg:w-64 flex flex-col gap-3">
          {/* Document Actions */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 text-sm">Documents</h4>
            
            {/* Payment Receipts */}
            {Stage.paymentReceipts && Stage.paymentReceipts.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs text-gray-600 mb-1">
                  Payment Receipts ({Stage.paymentReceipts.length})
                </div>
                {Stage.paymentReceipts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onViewDocument(Stage, 'paymentReceipt', index)}
                    className="w-full bg-green-100 text-green-700 p-3 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2 justify-center text-sm"
                  >
                    <DocumentTextIcon className="w-4 h-4" />
                    View Receipt {index + 1}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-2">
                No payment receipts available
              </div>
            )}
          </div>

          {/* Payment Action */}
          {(Stage.paymentStatus === 'UNPAID' || Stage.paymentStatus === 'PENDING') && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 text-sm">Payment</h4>
              <button
                onClick={() => onApprovePayment(Stage)}
                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 justify-center text-sm font-medium"
              >
                <CreditCardIcon className="w-4 h-4" />
                Approve Payment
              </button>
            </div>
          )}

          {/* Location Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium text-gray-900 text-sm mb-2">Coordinates</h4>
            <div className="text-xs text-gray-600">
              <div>Lat: {Stage.latitude}</div>
              <div>Lng: {Stage.longitude}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}