
"use client";

import Loading from "@/components/Loading";
import { CreateShipmentModal } from "@/components/ShipmentModals";

import { useRouter } from "next/navigation";
import React, {useState } from "react";
import { ShipmentDetails } from "@/types/shipment.types";
import { useAuth } from "@/hooks/useAuth";
import { useGetList } from "@/hooks/useGet";
import { routes } from "@/data/routes";

const ShipmentDashboard: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const {id:adminId,displayName}= useAuth()
  const {error, loading, data:shipments} = useGetList<ShipmentDetails>(routes.shipment.list(adminId),true)

  const router = useRouter();

 


  const updateUI = async (newShipment: ShipmentDetails) => {
   router.push(routes.shipment.details(newShipment.id));
    setShowCreateModal(false);
  };

  if (!adminId) return null;
  if (error) return <p className="text-center text-red-500 text-lg">{error}</p>;
  if (loading)return <Loading/>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {displayName}&apos;s Shipments
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <button
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              onClick={() => setShowCreateModal(true)}
            >
              Create Shipment
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Shipment ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sender
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shipments.map((shipment) => (
                  <tr key={shipment.shipmentID} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {shipment.shipmentID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {shipment.senderName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {shipment.recipientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {shipment.receivingAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => router.push(`/admin/shipment-details/${shipment.id}`)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md w-full md:w-auto"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateShipmentModal
          onClose={() => setShowCreateModal(false)}
          onCreate={updateUI}
        />
      )}
    </div>
  );
};

export default ShipmentDashboard;