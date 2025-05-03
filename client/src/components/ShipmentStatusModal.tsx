import { ShipmentStatus } from "@/app/types/ShipmentStatus";
import { stepUrl } from "@/data/urls";
import React, { useState } from "react";

interface ModalProps {
  onClose: () => void;
  shipmentId: number;
}

export const AddShipmentStatusModal: React.FC<ModalProps> = ({ onClose, shipmentId }) => {
  const [formData, setFormData] = useState({
    status: '',
    shipmentStatus: 'Pending',
    typeTag: 'Transit',
    requiresPayment: false,
    paymentAmount: 0,
    acceptedFiatOptions: [],
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${stepUrl}/${shipmentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error("Failed to update shipment");
      window.location.reload();
      onClose();
    } catch (error) {
      console.error("Error updating shipment:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg modal">
        <h2 className="text-lg font-semibold mb-4">Add Stage</h2>
        <label className="block mb-4">
          Shipment Status:
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          Payment Status:
          <select
            name="shipmentStatus"
            value={formData.shipmentStatus}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Fee Unpaid">Fee Unpaid</option>
            <option value="Fee Partially Paid">Fee Partially Paid</option>
            <option value="Fee Paid">Fee Paid</option>
          </select>
        </label>
        <label className="block mb-4">
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>
        <div className="flex justify-between">
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
          <button onClick={() => onClose()} className="bg-red-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EditShipmentStatusModal({ step, onClose }: { step: ShipmentStatus; onClose: () => void }) {
  const [formData, setFormData] = useState(step);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${stepUrl}/${step.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error("Failed to update shipment");
      window.location.reload();
      onClose();
    } catch (error) {
      console.error("Error updating shipment:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg modal">
        <h2 className="text-lg font-semibold mb-4">Edit Order</h2>
        <label className="block mb-2">
          Payment Status:
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Fee Unpaid">Fee Unpaid</option>
            <option value="Fee Partially Paid">Fee Partially Paid</option>
            <option value="Fee Paid">Fee Paid</option>
          </select>
        </label>
        <label className="block mb-4">
          Shipment Status:
          <input
            type="text"
            name="shipmentStatus"
            value={formData.shipmentStatus}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-4">
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>
        <div className="flex justify-between">
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
          <button onClick={() => onClose()} className="bg-red-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}



export const DeleteShipmentStatusModal: React.FC<{
  step: ShipmentStatus;
  onClose: () => void;
}> = ({ step, onClose, }) => {
  const handleSubmit = async () => {
    try {
      const response = await fetch(`${stepUrl}/${step.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    
      });

      if (!response.ok) throw new Error("Failed to update shipment");
      window.location.reload()
      onClose(); // Close modal after success
    } catch (error) {
      console.error("Error updating shipment:", error);
    }
  }
    return (
      <>
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg modal">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this order?</p>
            <div className="flex justify-between mt-4">
              <button onClick={() => handleSubmit()} className="bg-red-500 text-white px-4 py-2 rounded">
                Confirm
              </button>
              <button onClick={() => onClose()} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
    </>
  );
}
