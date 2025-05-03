"use client";

import { Shipment } from "@/app/types/Shipment";
import Loading from "@/components/Loading";
import { CreateShipmentModal } from "@/components/ShipmentModals";
import { adminShipmentUrl } from "@/data/urls";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";


const ShipmentDashboard: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    let result = [...shipments];

    // Search filter
    if (searchTerm) {
      result = result.filter(s => 
        s.recipientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.shipmentID?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter(s => 
        s.shipmentStatus?.some(status => status.shipmentStatus === filterStatus)
      );
    }

    // Date filter
    if (dateRange.start && dateRange.end) {
      result = result.filter(s => {
        const shipmentDate = new Date(s.createdAt).getTime();
        const start = new Date(dateRange.start).getTime();
        const end = new Date(dateRange.end).getTime();
        return shipmentDate >= start && shipmentDate <= end;
      });
    }

    setFilteredShipments(result);
  }, [shipments, searchTerm, filterStatus, dateRange]);
  const router = useRouter()

  const [adminId, setAdminId] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }
      try {
        const decodedToken: any = jwt_decode(token);
        if (!decodedToken.adminId || Date.now() >= decodedToken.exp * 1000) {
          throw new Error('Invalid or expired token');
        }
        const response = await fetch(`${adminShipmentUrl}/verify`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Session invalid');
        setAdminId(decodedToken.adminId);
        setLoadingAuth(false);
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          setError("Authentication token missing");
          router.push('/admin/login');
          return;
        }
        const response = await fetch(`${adminShipmentUrl}/${adminId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch shipments");
        }
        const data = await response.json();
        setShipments(data);
      } catch (err) {
        console.error(err);
        setError("Error fetching shipments");
      } finally {
        setLoading(false);
      }
    };

    if(adminId) fetchShipments();
  }, [adminId]);

  const updateUI = async (newShipment: Shipment) => {
    setShipments([...shipments, newShipment]);
    setShowCreateModal(false);
  };

  if (loadingAuth) return <Loading/>;
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
            `${s.shipmentID},${s.senderName},${s.recipientName},${s.receivingAddress},${s.createdAt}`
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