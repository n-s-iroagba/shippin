"use client";

import Loading from "@/components/Loading";
import { CreateShipmentModal } from "@/components/ShipmentModals";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
// import {jwtDecode} from "jwt-decode";
import { ShipmentDetails } from "@/types/shipment.types";
import { ApiService } from "@/services/api.service";


const ShipmentDashboard: React.FC = () => {
  const [shipments, setShipments] = useState<ShipmentDetails[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<ShipmentDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const adminId = 1

  useEffect(() => {
    let result:ShipmentDetails[] = [...shipments];

    // Search filter
    if (searchTerm) {
      result = result.filter(s => 
        s.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.shipmentID?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter(s => 
        s.shipmentStatuses?.some(status => status.paymentStatus === filterStatus)
      );
    }


    setFilteredShipments(result);
  }, [shipments, searchTerm, filterStatus, dateRange]);
  const router = useRouter()


  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const {shipments =[], error} = await ApiService.listShipments(adminId);
        if (error) {
          throw error
        }
        setShipments(shipments);
      } catch (err) {
        console.error(err);
        setError("Error fetching shipments");
      } finally {
        setLoading(false);
      }
    };

    if(adminId) fetchShipments();
  }, [adminId, router]);

  const updateUI = async (newShipment: ShipmentDetails
  ) => {
    setShipments([...shipments, newShipment]);
    setShowCreateModal(false);
  };

  // if (loadingAuth) return <Loading/>;
  if (!adminId) return null;
  if (loading) return <Loading/>;
  if (error) return <p className="text-center text-red-500 text-lg">{error}</p>;

  return (
    <div className="container mx-auto p-6 max-w-full overflow-x-auto bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Shipment Dashboard</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <button
          className="bg-primary-blue hover:bg-dark-blue transition-colors duration-200 text-white px-6 py-2.5 rounded-lg shadow-md w-full md:w-auto font-medium"
          onClick={() => setShowCreateModal(true)}
        >
          Create Shipment
        </button>

        <input
          type="text"
          placeholder="Search by email or tracking ID"
          className="border p-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Payment Needed">Payment Needed</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="date"
          className="border p-2 rounded"
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
        />
      </div>
      <button
        className="bg-red-500 text-white px-4 py-2 mb-4 w-full md:w-auto"
        onClick={handleLogout}
      >
        Logout
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 mb-4 ml-2 w-full md:w-auto"
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

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border p-2">Shipment ID</th>
              <th className="border p-2">Sender</th>
              <th className="border p-2">Recipient</th>
              <th className="border p-2">Destination</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredShipments.map((shipment) => (
              <tr key={shipment.shipmentID} className="border text-center">
                <td className="border p-2">{shipment.shipmentID}</td>
                <td className="border p-2">{shipment.senderName}</td>
                <td className="border p-2">{shipment.recipientName}</td>
                <td className="border p-2">{shipment.receivingAddress}</td>
                <td className="border p-2">
                  <button className="bg-blue-500 text-white px-2 py-1 mr-2 w-full md:w-auto"
                  onClick={()=>router.push(`/admin/shipment-details/${shipment.id}`)}
                  >
                    View More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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