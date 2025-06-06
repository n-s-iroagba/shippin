"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faInfoCircle,
  faDollarSign,
  faFileAlt,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SERVER_URL } from "@/data/urls";
import Loading from "@/components/Loading";
import { ShipmentDetails, ShippingStage } from "@/types/shipment.types";
import DocumentModal from "@/components/DocumentModal";

const ShipmentTrackingDashboard: React.FC = () => {
  const [shipmentDetails, setShipmentDetails] = useState<{
    shipmentDetails: ShipmentDetails;
    shippingStages: ShippingStage[];
  } | null>(null);
  const [uploadModalStat, setUploadModalStat] =
    useState<ShippingStage | null>(null);
  const [viewShipmentDetails, setViewShipmentDetails] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState('')
  const params = useParams();
  const trackingId = params.trackingId;
  const long = 35.856737
  const lat = 10.606619
  const handleUploadReceipt = async (file: File) => {
    if (!uploadModalStat) return;
    const formData = new FormData();
    formData.append("receipt", file);

    try {
      const response = await fetch(
        `/api/states/${uploadModalStat.id}/upload-receipt`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) throw new Error("Upload failed");
      window.location.reload();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload receipt");
    }
  };

  useEffect(() => {
    if (!trackingId) return;

    const fetchShipmentDetails = async () => {
      try {
        const response = await fetch(
          `${SERVER_URL}/track/shipment/${trackingId}`
        );
        if (!response.ok) throw new Error("Failed to fetch shipment details");
        const data: {
          shipmentDetails: ShipmentDetails;
          shippingStages: ShippingStage[];
        } = await response.json();
        console.log(data);
        setShipmentDetails(data);
      } catch (error) {
        alert("An error occurred, try again later");
        console.error("Fetch Error:", error);
      }
    };

    fetchShipmentDetails();
  }, [trackingId]);

  if (!shipmentDetails) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-full mb-4">
            <FontAwesomeIcon icon={faBox} className="text-white h-8 w-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Shipment Tracking
          </h1>
          <p className="text-lg text-gray-600 font-medium">#{trackingId}</p>
        </div>

        {/* Payment Alert */}
        {shipmentDetails.shippingStages?.some(
          (s) => s.paymentStatus === "YET_TO_BE_PAID"
        ) && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-6 mb-8 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    className="text-amber-600 h-6 w-6"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-amber-800">
                    Payment Required
                  </h3>
                  <p className="text-amber-700 mt-1">
                    Complete payment to continue shipment processing
                  </p>
                </div>
              </div>
            </div>
          )}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-indigo-600 h-5 w-5" />
            <h3 className="text-lg font-semibold text-gray-900">Live Location</h3>
          </div>
          <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden border-2 border-gray-100">
            <iframe
              title="Google Map"
              className="w-full h-full"
              src={`https://www.google.com/maps?q=${long},${lat}&z=15&output=embed`}
              loading="lazy"
            />
            <div className="absolute inset-0 border-[3px] border-white/20 rounded-xl pointer-events-none" />
          </div>
        </div>
        <div>
          <button className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          onClick={()=>setViewShipmentDetails(!viewShipmentDetails)}>{viewShipmentDetails?'Collapse Shipment Details':'View Shipment Details'}</button>
        </div>

        {/* Shipment Details Grid */}
      {viewShipmentDetails && <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-8 flex items-center gap-3">
            <FontAwesomeIcon icon={faInfoCircle} className="text-indigo-600" />
            Shipment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem
              label="Shipment ID"
              value={shipmentDetails.shipmentDetails.shipmentID}
            />
            <DetailItem
              label="Content"
              value={shipmentDetails.shipmentDetails.shipmentDescription}
            />
            <DetailItem
              label="Sender"
              value={shipmentDetails.shipmentDetails.senderName}
            />
            <DetailItem
              label="Sending Port"
              value={shipmentDetails.shipmentDetails.sendingPickupPoint}
            />
            <DetailItem
              label="Delivery Address"
              value={shipmentDetails.shipmentDetails.receivingAddress}
            />
            <DetailItem
              label="Recipient"
              value={shipmentDetails.shipmentDetails.recipientName}
            />
            <DetailItem
              label="Freight Type"
              value={shipmentDetails.shipmentDetails.freightType}
            />
            <DetailItem
              label="Expected Arrival"
              value={new Date(
                shipmentDetails.shipmentDetails.expectedTimeOfArrival
              ).toLocaleDateString()}
            />
          </div>
        </div>
}


        {/* Progress Timeline */}
        <div className="bg-white rounded-2xl shadow-xl pl-1 pt-8 mb-10 ">
          <h3 className="text-xl font-semibold text-gray-900 mb-8 flex items-center gap-3">
            <FontAwesomeIcon icon={faInfoCircle} className="text-indigo-600" />
            Shipment Progress
          </h3>
          <div className="space-y-8 bg-blue-100 rounded-xl">
            {(shipmentDetails.shippingStages || []).map((stat) => (
              <div key={stat.id} className="flex gap-6 relative">
                <div className="flex-none">
                  <div className="flex flex-col items-center h-full">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faBox}
                        className="text-indigo-600 h-5 w-5"
                      />
                    </div>
                    <div className="w-[0.2cm] bg-blue-600 flex-1 mt-1"></div>
                  </div>
                </div>

                <div className=" rounded-xl pb-6 pt-3 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {stat.title}
                  </h4>
                  <p className="text-gray-600 mb-0">
                    Carrier note: {stat.carrierNote}
                  </p>

                  <small className="text-sm text-gray-500">
                    {new Date(stat.dateAndTime).toLocaleString()}
                  </small>

                  {stat.feeInDollars && stat.feeInDollars > 0 &&(
                    <div className="mt-2 space-y-2">
                      <div className='text-gray-600'>
                        Fee Required: {' '}
                        <span className="text-lg font-medium text-amber-600">
                          ${stat.feeInDollars}
                        </span>
                      </div>
                      {<small className="text-small  text-gray-600">
                        {stat.percentageNote}% of shipment value
                      </small>
                      }
                     
                        {stat.feeInDollars && (
                          <>
                            <div className='text-gray-600 mb-2 '>
                              Amount Paid: {' '}
                              <span className="text-lg font-medium text-green-600">
                                ${stat.amountPaid}
                              </span>
                            </div>
                            <small className="text-small  text-gray-600">
                              Payment Date: {stat.amountPaid}
                            </small>
                          </>
                        )}
                        <div className="flex flex-col lg:flex-row gap-4">
                          {stat.paymentStatus === "YET_TO_BE_PAID" && (
                            <Link
                              href={`/payment/${stat.id}`}
                              className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                              Make Payment
                            </Link>
                          )}

                          {!stat.paymentReceipt && (
                            <button
                              onClick={() => setUploadModalStat(stat)}
                              className="inline-block bg-amber-500 text-white px-6 py-2.5 rounded-lg hover:bg-amber-600 transition-colors font-medium"
                            >
                              Upload Receipt
                            </button>
                          )}

                         {stat.supportingDocument && <button 
                          onClick={()=>setSelectedDocument(stat.supportingDocument as string)}
                          className="bg-gray-500 text-white px-6 py-2.5 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center gap-2">
                            <FontAwesomeIcon icon={faFileAlt} />
                            View Document
                          </button>
}

                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>

        
      </div>
{selectedDocument && <DocumentModal url={selectedDocument} />
}
      {/* Upload Receipt Modal */}
      {uploadModalStat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-6">
              Upload Payment Receipt
            </h3>
            <div className="mb-6">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadReceipt(file);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setUploadModalStat(null)}
                className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



const DetailItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 transition-all hover:border-indigo-100 hover:shadow-sm">
    <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
      {label}
    </dt>
    <dd className="text-base font-medium text-gray-900">{value}</dd>
  </div>
);

export default ShipmentTrackingDashboard;
