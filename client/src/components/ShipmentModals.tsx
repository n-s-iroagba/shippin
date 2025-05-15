"use client";
import { routes } from "@/data/constants";
import { ShipmentDetails } from "@/types/shipment.types";
import { protectedApi } from "@/utils/apiUtils";
import React, { useState } from "react";

// Common modal container styles
const modalOverlayStyle = "fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50";
const modalBoxStyle = "bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto";

export const CreateShipmentModal: React.FC<{
  onClose: () => void;
  onCreate: (shipment: ShipmentDetails) => void;
}> = ({ onClose, onCreate }) => {
  const [form, setForm] = useState<Omit<ShipmentDetails, 'id' | 'shipmentID' | 'adminId'>>({
    senderName: '',
    sendingPickupPoint: '',
    shippingTakeoffAddress: '',
    receivingAddress: '',
    recipientName: '',
    receipientEmail: '',
    shipmentDescription: '',
    expectedTimeOfArrival: new Date(),
    freightType: 'LAND',
    weight: 0,
    dimensionInInches: '',
  });
  const adminId = 1
  const [submitting, setSubmitting] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      const result = await protectedApi.post<Omit<ShipmentDetails, 'id' | 'shipmentID' | 'adminId'>, ShipmentDetails>(routes.shipment.create(String(adminId)), form)
      onCreate(result.data);
      setSubmitting(false)
      onClose();

    } catch (error) {
      setSubmitting(false)
      console.error("Error creating shipment:", error);
    }
  };

  return (
    <div className={modalOverlayStyle}>
      <div className={modalBoxStyle}>
        <h2 className="text-2xl font-bold mb-4">Create Shipment</h2>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <input required name="senderName" placeholder="Sender Name" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          <input required name="sendingPickupPoint" placeholder="Pickup Point" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          <input required name="shippingTakeoffAddress" placeholder="Takeoff Address" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          <input required name="receivingAddress" placeholder="Destination Address" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          <input required name="recipientName" placeholder="Recipient Name" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          <input required type="email" name="receipientEmail" placeholder="Recipient Email" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />

          <select name="freightType" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="LAND">Land</option>
            <option value="SEA">Sea</option>
            <option value="AIR">Air</option>
          </select>

          <input required type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          <input required name="dimensionInInches" placeholder="Dimensions (LxWxH in inches)" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          <input required type="datetime-local" name="expectedTimeOfArrival" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          <textarea required name="shipmentDescription" placeholder="Shipment Description" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none h-24" />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{submitting ? 'Creating shipment...' : 'Create Submit'}</button>
        </div>
      </div>
    </div>
  );
};

export const EditShipmentModal: React.FC<{
  shipment: ShipmentDetails;
  onClose: () => void;
  onUpdate: (updatedShipment: ShipmentDetails) => void;
}> = ({ shipment, onClose, onUpdate }) => {
  const [form, setForm] = useState<ShipmentDetails>(shipment);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const result = await protectedApi.patch<ShipmentDetails, ShipmentDetails>(
        routes.shipment.update(shipment.id),
        form
      );
      onUpdate(result.data);
      onClose();
    } catch (error) {
      console.error("Error updating shipment:", error);
      setError("An error occurred while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={modalOverlayStyle}>
      <div className={modalBoxStyle}>
        <h2 className="text-2xl font-bold mb-2">Edit Shipment</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}

        <div className="grid grid-cols-1 gap-4 mb-4">
          <input required name="senderName" value={form.senderName} placeholder="Sender Name" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          <input required name="sendingPickupPoint" value={form.sendingPickupPoint} placeholder="Pickup Point" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          <input required name="shippingTakeoffAddress" value={form.shippingTakeoffAddress} placeholder="Takeoff Address" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          <input required name="receivingAddress" value={form.receivingAddress} placeholder="Destination Address" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          <input required name="recipientName" value={form.recipientName} placeholder="Recipient Name" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          <input required type="email" name="receipientEmail" value={form.receipientEmail} placeholder="Recipient Email" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          <input required type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          <select name="freightType" value={form.freightType} onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">Select Freight Type</option>
            <option value="LAND">Land</option>
            <option value="SEA">Sea</option>
            <option value="AIR">Air</option>
          </select>
          <input required name="dimensionInInches" placeholder="Dimensions (LxWxH in inches)" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          <input
            type="datetime-local"
            name="expectedTimeOfArrival"
            value={new Date(form.expectedTimeOfArrival).toISOString().slice(0, 16)}
            onChange={(e) => setForm({ ...form, expectedTimeOfArrival: new Date(e.target.value) })}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <textarea required name="shipmentDescription" placeholder="Shipment Description" onChange={handleChange} className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none h-24" />
        </div>


        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};


export const DeleteShipmentModal: React.FC<{
  shipment: ShipmentDetails;
  onDelete: () => void;
}> = ({ shipment, onDelete }) => {
  const handleSubmit = async () => {
    try {
      await protectedApi.delete(routes.shipment.delete(shipment.id))
      onDelete();

    } catch (error) {
      console.error("Error deleting shipment:", error);
    }
  };

  return (
    <div className={modalOverlayStyle}>
      <div className={modalBoxStyle}>
        <h2 className="text-2xl font-bold mb-4">Delete Shipment</h2>
        <p className="mb-4">Are you sure you want to delete shipment {shipment.shipmentID}?</p>

        <div className="flex justify-end gap-2">
          <button onClick={onDelete} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Confirm Delete</button>
        </div>
      </div>
    </div>
  );
};
