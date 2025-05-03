"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import Loading from "@/components/Loading";
import {PaymentModal} from "@/components/PaymentModal";
import { trackShipmentUrl } from "@/data/urls";

export interface ShipmentStatusType {
  id: number;
  feeInDollars: number | null;
  amountPaid: number;
  dateAndTime: string;
  requiresFee: boolean;
  paymentStatus: 'YET_TO_BE_PAID' | 'PENDING' | 'PAID' | 'NO_NEED_FOR_PAYMENT';
  paymentDate: string | null;
  paymentReceipt?: string;
  percentageNote?: number | null;
  title:string
  carrierNote?: string;
  supportingDocuments?: string[];
}

export interface ShipmentDetailsType {
  shipmentID: string;
  senderName: string;
  sendingPickupPoint: string;
  shippingTakeoffAddress: string;
  receivingAddress: string;
  recipientName: string;
  shipmentDescription: string;
  shipmentStatus: ShipmentStatusType[];
}

const ShipmentTrackingDashboard: React.FC = () => {
  const params = useParams();
  const trackingId = params?.trackingId as string | undefined;
  const [shipmentDetails, setShipmentDetails] = useState<ShipmentDetailsType | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<ShipmentStatusType | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth < 768 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, []);

  useEffect(() => {
    if (!trackingId) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`${trackShipmentUrl}/track/${trackingId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data: ShipmentDetailsType = await res.json();
        setShipmentDetails(data);
      } catch (err) {
        console.error(err);
        setShipmentDetails(null);
      }
    };
    fetchData();
  }, [trackingId]);

  if (shipmentDetails === null) {
    return <Loading />;
  }

  return (
    <div className="bg-white py-5 px-4">
      <h2 className="text-xl font-semibold mb-4 text-center text-black">Shipment Tracking</h2>

      <div className="flex overflow-x-auto whitespace-nowrap w-full" ref={scrollContainerRef}>
        <div className="flex items-center px-4">
          {shipmentDetails.shipmentStatus.map((status, idx) => (
            <div key={status.id} className="flex flex-col items-center mx-4 p-4 border rounded-lg">
              <span className={`px-3 py-1 rounded-full mb-2 ${
                status.paymentStatus === 'PAID' ? 'bg-green-100' :
                status.requiresFee && status.paymentStatus === 'YET_TO_BE_PAID' ? 'bg-yellow-100' :
                'bg-gray-100'
              }`}>
                {status.paymentStatus === 'YET_TO_BE_PAID' ? 'Payment Needed' : status.paymentStatus}
              </span>

              <div className="flex items-center mb-2">
                {idx !== 0 && <div className="h-1 bg-gray-400 flex-1"></div>}
                <FontAwesomeIcon
                  icon={status.requiresFee && status.paymentStatus !== 'PAID' ? faTimesCircle : faCheckCircle}
                  size="2x"
                  className={status.requiresFee && status.paymentStatus !== 'PAID' ? 'text-red-500' : 'text-green-500'}
                />
                {idx !== shipmentDetails.shipmentStatus.length - 1 && <div className="h-1 bg-gray-400 flex-1"></div>}
              </div>

              <div className="text-left text-sm w-56">
                <p><strong>ID:</strong> {status.id}</p>
                <p><strong>Date:</strong> {new Date(status.dateAndTime).toLocaleString()}</p>
                <p><strong>Requires Fee:</strong> {status.requiresFee ? 'Yes' : 'No'}</p>
                <p><strong>Fee ($):</strong> {status.feeInDollars ?? '-'}</p>
                <p><strong>Amount Paid:</strong> {status.amountPaid}</p>
                <p><strong>Payment Date:</strong> {status.paymentDate ?? '-'}</p>
                <p><strong>Payment Receipt:</strong> {status.paymentReceipt ? 
                  <a href={status.paymentReceipt} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    View
                  </a> : '-'}
                </p>
                <p><strong>Percentage Note:</strong> {status.percentageNote ?? '-'}</p>
                <p><strong>Carrier Note:</strong> {status.carrierNote ?? '-'}</p>
                <p><strong>Supporting Docs:</strong></p>
                <ul className="list-disc list-inside">
                  {status.supportingDocuments?.length ? 
                    status.supportingDocuments.map((doc, i) => (
                      <li key={i}>
                        <a href={doc} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                          Document {i + 1}
                        </a>
                      </li>
                    )) : 
                    <li>-</li>
                  }
                </ul>
              </div>

              {status.requiresFee && status.paymentStatus === 'YET_TO_BE_PAID' && (
                <div className="mt-2 flex flex-col gap-2 w-full">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded w-full"
                    onClick={() => setShowPaymentModal(status)}
                  >
                    Make Payment
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-600 text-white rounded w-full"
                    onClick={() => setShowPaymentModal(status)}
                  >
                    Upload Receipt
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 px-6 space-y-1">
        <h3 className="text-lg font-bold mb-2">Shipment Details</h3>
        <p><strong>ID:</strong> {shipmentDetails.shipmentID}</p>
        <p><strong>Sender:</strong> {shipmentDetails.senderName}</p>
        <p><strong>Pickup:</strong> {shipmentDetails.sendingPickupPoint}</p>
        <p><strong>Delivery:</strong> {shipmentDetails.receivingAddress}</p>
        <p><strong>Recipient:</strong> {shipmentDetails.recipientName}</p>
        <p><strong>Description:</strong> {shipmentDetails.shipmentDescription}</p>
      </div>

      {showPaymentModal && (
        <PaymentModal
          stage={showPaymentModal}
          onClose={() => setShowPaymentModal(null)}
        />
      )}
    </div>
  );
};

export default ShipmentTrackingDashboard;