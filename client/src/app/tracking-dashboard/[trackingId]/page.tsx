"use client";

import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faBox,

  faInfoCircle,
  faDollarSign,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "next/navigation";
;
import Loading from "@/components/Loading";
import { ShipmentDetails, ShipmentStatus } from "@/types/shipment.types";
import { ApiService } from "@/services/api.service";

const ShipmentTrackingDashboard: React.FC = () => {
  const [shipmentDetails, setShipmentDetails] = useState<ShipmentDetails | null>(null);
  const params = useParams();
  const [tempStatuses,setStatuses] = useState<ShipmentStatus[]>([])
  const trackingId = params.trackingId;
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollToEnd = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
      }
    };

    if (window.innerWidth < 768) {
      setTimeout(scrollToEnd, 100);
    }
  }, []);

  useEffect(() => {
    if (!trackingId) return;

    const fetchShipmentDetails = async () => {
      try {
        const {statuses,shipment} = await ApiService.trackShipment(trackingId as string);
        
        setShipmentDetails(shipment);
        setStatuses(statuses)
      } catch (error) {
        alert("An error occurred, try again later");
        console.error("Fetch Error:", error);
      }
    };

    fetchShipmentDetails();
  }, [trackingId]);

  if (!shipmentDetails) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faBox} className="text-indigo-600 h-6 w-6" />
            Shipment Tracking
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Tracking ID: {trackingId}</p>
        </div>

        {/* Payment Alert */}
        {Array.isArray(tempStatuses) && tempStatuses.some(s => s.paymentStatus === 'PENDING') && (
  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-400 text-orange-800 p-4 mb-8 rounded-lg flex items-start gap-3">
    <FontAwesomeIcon icon={faDollarSign} className="text-lg mt-1 flex-shrink-0" />
    <div>
      <p className="font-semibold text-sm sm:text-base">Payment Required</p>
      <p className="text-xs sm:text-sm mt-1">Complete payment to continue shipment processing</p>
    </div>
  </div>
)}


        {/* Progress Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
    <FontAwesomeIcon icon={faInfoCircle} className="text-indigo-600" />
    Shipment Progress
  </h3>
  <div className="relative overflow-hidden">
    <div ref={scrollContainerRef} className="flex overflow-x-auto pb-4 scroll-smooth">
      <div className="flex min-w-max w-full justify-between">
        {tempStatuses.map((status, index, array) => {
          const isComplete = status.paymentStatus === 'PAID';
          const isCurrent = index === array.length - 1;

          return (
            <div key={status.id} className="flex flex-col items-center relative px-4">
              <div className={`h-1 w-full absolute top-5 left-1/2 -translate-y-1/2 ${isComplete ? 'bg-indigo-600' : 'bg-gray-300'}`} />
              <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center mb-4 
                ${isComplete ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}
                ${isCurrent ? 'ring-4 ring-indigo-200' : ''}`}>
                <FontAwesomeIcon 
                  icon={isComplete ? faCheckCircle : faTimesCircle} 
                  className={isComplete ? 'text-white' : 'text-gray-400'}
                />
              </div>
              <div className="text-center">
                <p className={`text-sm font-medium ${isCurrent ? 'text-indigo-600' : 'text-gray-900'}`}>
                  {status.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(status.dateAndTime).toLocaleDateString()}
                </p>
                {status.supportingDocument && (
                  <button
                    onClick={() => window.open(status.supportingDocument, '_blank')}
                    className="text-xs text-indigo-600 hover:underline mt-1 flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faFileAlt} className="h-3 w-3" />
                    View Document
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
</div>

        {/* Shipment Details Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FontAwesomeIcon icon={faInfoCircle} className="text-indigo-600 h-5 w-5" />
            Shipment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <DetailItem label="Shipment ID" value={shipmentDetails.shipmentID} />
            <DetailItem label="Content" value={shipmentDetails.shipmentDescription} />
            <DetailItem label="Sender" value={shipmentDetails.senderName} />
            <DetailItem label="Sending Port" value={shipmentDetails.sendingPickupPoint} />
            <DetailItem label="Delivery Address" value={shipmentDetails.receivingAddress} />
            <DetailItem label="Recipient" value={shipmentDetails.recipientName} />
            <DetailItem label="Freight Type" value={shipmentDetails.freightType} />
            <DetailItem label="Expected Arrival" value={new Date(shipmentDetails.expectedTimeOfArrival).toLocaleDateString()} />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 transition-colors hover:border-indigo-100">
    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
    <dd className="mt-1 text-sm font-medium text-gray-900 truncate">{value}</dd>
  </div>
);

export default ShipmentTrackingDashboard;