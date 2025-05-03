"use client";;
import { Shipment } from "@/app/types/Shipment";
import { adminShipmentUrl, shipmentUrl } from "@/data/urls";
import React, { useState } from "react";


export const CreateShipmentModal: React.FC<{
  onClose: () => void;
  onCreate: (shipment: Shipment) => void;
}> = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    senderName: '',
    sendingAddress: '',
    receivingAddress: '',
    recipientName: '',
    currentLocation: '',
    shipmentDescription: '',
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const adminId = '1'
  // Handle form submission
  const handleSubmit = async () => {
    try {
      const response =  await fetch(`${adminShipmentUrl}/${adminId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to create shipment");

      const result = await response.json();
      onCreate(result); // Pass data back to parent
      onClose(); // Close modal after success
    } catch (error) {
      console.error("Error creating shipment:", error);
    }
  };

  return (
    <div id="default-modal" className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl mb-4">Create Shipment</h2>
        <input className="border p-2 w-full mb-2" name="senderName" placeholder="Sender Name" onChange={handleChange} />
        <input className="border p-2 w-full mb-2" name="sendingAddress" placeholder="Sending Address" onChange={handleChange} />
        <input className="border p-2 w-full mb-2" name="receivingAddress" placeholder="Destination" onChange={handleChange} />
        <input className="border p-2 w-full mb-2" name="recipientName" placeholder="Recipient Name" onChange={handleChange} />
        <input className="border p-2 w-full mb-2" name="currentLocation" placeholder="Current Location" onChange={handleChange} />
        <textarea className="border p-2 w-full mb-2" name="shipmentDescription" placeholder="Shipment Description" onChange={handleChange} />

        <div className="flex justify-end space-x-2">
          <button className="bg-gray-400 text-white px-4 py-2" onClick={onClose}>Cancel</button>
          <button className="bg-blue-500 text-white px-4 py-2" onClick={handleSubmit}>Create</button>
        </div>
      </div>
    </div>
  );
};

export const EditShipmentModal: React.FC<{
  shipment: Shipment;
  onClose: () => void;
}> = ({ shipment, onClose, }) => {
  const [form, setForm] = useState<Shipment>(shipment);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const response = await fetch(`${shipmentUrl}/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to update shipment");
      window.location.reload()
      onClose(); // Close modal after success
    } catch (error) {
      console.error("Error updating shipment:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl mb-4">Edit Shipment</h2>
        <input className="border p-2 w-full mb-2" name="shipmentID" value={form.shipmentID} readOnly />
        <input className="border p-2 w-full mb-2" name="senderName" value={form.senderName} onChange={handleChange} />
        <input className="border p-2 w-full mb-2" name="sendingAddress" value={form.sendingAddress} onChange={handleChange} />
        <input className="border p-2 w-full mb-2" name="receivingAddress" value={form.receivingAddress} onChange={handleChange} />
        <input className="border p-2 w-full mb-2" name="recipientName" value={form.recipientName} onChange={handleChange} />
        <textarea className="border p-2 w-full mb-2" name="shipmentDescription" value={form.shipmentDescription} onChange={handleChange} />

        <div className="flex justify-end space-x-2">
          <button className="bg-gray-400 text-white px-4 py-2" onClick={onClose}>Cancel</button>
          <button className="bg-blue-500 text-white px-4 py-2" onClick={handleSubmit}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};


export const DeleteShipmentModal: React.FC<{
  shipment: Shipment;
  onClose: () => void;
}> = ({ shipment, onClose, }) => {
  const handleSubmit = async () => {
    try {
      const response = await fetch(`${shipmentUrl}/${shipment.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },

      });

      if (!response.ok) throw new Error("Failed to update shipment");
      window.location.reload()
      onClose(); // Close modasl after success
    } catch (error) {
      console.error("Error updating shipment:", error);
    }
  }
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-xl mb-4">Delete Shipment</h2>
          <p>Are you sure you want to delete this shipment?</p>
          <button className="bg-red-500 text-white px-4 py-2 mt-2" onClick={handleSubmit}>Delete</button>
        </div>
      </div>
    );
  };