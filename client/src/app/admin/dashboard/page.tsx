
"use client";

import Loading from "@/components/Loading";
import { CreateShipmentModal } from "@/components/ShipmentModals";
import { SERVER_URL } from "@/data/urls";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ShipmentDetails } from "@/types/shipment.types";

const ShipmentDashboard: React.FC = () => {
  const [shipments, setShipments] = useState<ShipmentDetails[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<ShipmentDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const adminId = 1;

  useEffect(() => {
    let result = [...shipments];
    if (searchTerm) {
      result = result.filter(s => 
        s.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.shipmentID?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter(s => 
        s.shipmentStatuses?.some(status => status.paymentStatus === filterStatus)
      );
    }
    setFilteredShipments(result);
  }, [shipments, searchTerm, filterStatus, dateRange]);

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/admin/shipment/${adminId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch shipments");
        }
        const data = await response.json();
        console.log(data)
        setShipments(data);
      } catch (err) {
        console.error(err);
        setError("Error fetching shipments");
      } finally {
        setLoading(false);
      }
    };

    if(adminId) fetchShipments();
  }, [adminId, router]);

  const updateUI = async (newShipment: ShipmentDetails) => {
    setShipments([...shipments, newShipment]);
    setShowCreateModal(false);
  };

  if (!adminId) return null;
  if (error) return <p className="text-center text-red-500 text-lg">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Shipment Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Logout
          </button>
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

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <input
              type="text"
              placeholder="Search shipments..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Payment Needed">Payment Needed</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <button
              className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              onClick={() => {
                const csvContent = filteredShipments.map(s => 
                  `${s.shipmentID},${s.senderName},${s.recipientName},${s.receivingAddress}`
                ).join('\n');
                const blob = new Blob([`ID,Sender,Recipient,Destination,Date\n${csvContent}`], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'shipments.csv';
                a.click();
                window.URL.revokeObjectURL(url);
              }}
            >
              Export CSV
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
                {filteredShipments.map((shipment) => (
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
