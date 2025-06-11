"use client"
import { CreateShipmentDto, type Shipment } from "@/types/shipment.types"
import type React from "react"
import { useState } from "react"

// Common modal container styles
const modalOverlayStyle = "fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
const modalBoxStyle = "bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"

export const CreateShipmentModal: React.FC<{
  onClose: () => void
  onCreate: (shipment: Shipment) => void
}> = ({ onClose, onCreate }) => {
  const [form, setForm] = useState<CreateShipmentDto>({
    senderName: "",
    sendingPickupPoint: "",
    shippingTakeoffAddress: "",
    receivingAddress: "",
    recipientName: "",
    receipientEmail: "",
    shipmentDescription: "",
    expectedTimeOfArrival: new Date(),
    freightType: "LAND" as const,
    weight: 0,
    dimensionInInches: "",
  })
  const adminId = 1 
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    })
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      setError(null)

      const formData = {
        ...form,
        expectedTimeOfArrival: new Date(form.expectedTimeOfArrival),
      }

      const response = await fetch(`http://localhost:8000/api/admin/shipment/${adminId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create shipment")
      }

      const result = await response.json()
      onCreate(result)
      onClose()
    } catch (error) {
      setError("Failed to create shipment")
      console.error("Error creating shipment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={modalOverlayStyle}>
      <div className={modalBoxStyle}>
        <h2 className="text-2xl font-bold mb-4">Create Shipment</h2>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <div className="grid grid-cols-1 gap-4 mb-4">
          <input
            required
            name="senderName"
            placeholder="Sender Name"
            value={form.senderName}
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            required
            name="sendingPickupPoint"
            placeholder="Pickup Point"
            value={form.sendingPickupPoint}
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            required
            name="shippingTakeoffAddress"
            placeholder="Takeoff Address"
            value={form.shippingTakeoffAddress}
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            required
            name="receivingAddress"
            placeholder="Destination Address"
            value={form.receivingAddress}
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            required
            name="recipientName"
            placeholder="Recipient Name"
            value={form.recipientName}
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            required
            type="email"
            name="receipientEmail"
            placeholder="Recipient Email"
            value={form.receipientEmail}
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <select
            name="freightType"
            value={form.freightType}
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="LAND">Land</option>
            <option value="SEA">Sea</option>
            <option value="AIR">Air</option>
          </select>

          <input
            required
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            value={form.weight}
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            required
            name="dimensionInInches"
            placeholder="Dimensions (LxWxH in inches)"
            value={form.dimensionInInches}
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            required
            type="datetime-local"
            name="expectedTimeOfArrival"
            value={form.expectedTimeOfArrival.toLocaleString()}
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <textarea
            required
            name="shipmentDescription"
            placeholder="Shipment Description"
            value={form.shipmentDescription}
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none h-24"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Shipment"}
          </button>
        </div>
      </div>
    </div>
  )
}

export const EditShipmentModal: React.FC<{
  shipment: Shipment
  onClose: () => void
  onUpdate: (updatedShipment: Shipment) => void
}> = ({ shipment, onClose, onUpdate }) => {
  const [form, setForm] = useState<Shipment>(shipment)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    })
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch(`http://localhost:3001/admin/shipment/${shipment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error("Failed to update shipment")
      }

      const result = await response.json()
      onUpdate(result)
      onClose()
    } catch (error) {
      setError( "Failed to update shipment")
      console.error("Error updating shipment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={modalOverlayStyle}>
      <div className={modalBoxStyle}>
        <h2 className="text-2xl font-bold mb-2">Edit Shipment</h2>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <div className="grid grid-cols-1 gap-4 mb-4">
          <input
            required
            name="senderName"
            value={form.senderName}
            placeholder="Sender Name"
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            required
            name="sendingPickupPoint"
            value={form.sendingPickupPoint}
            placeholder="Pickup Point"
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            required
            name="shippingTakeoffAddress"
            value={form.shippingTakeoffAddress}
            placeholder="Takeoff Address"
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            required
            name="receivingAddress"
            value={form.receivingAddress}
            placeholder="Destination Address"
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            required
            name="recipientName"
            value={form.recipientName}
            placeholder="Recipient Name"
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            required
            type="email"
            name="receipientEmail"
            value={form.receipientEmail}
            placeholder="Recipient Email"
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            required
            type="number"
            name="weight"
            value={form.weight}
            placeholder="Weight (kg)"
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            name="freightType"
            value={form.freightType}
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="LAND">Land</option>
            <option value="SEA">Sea</option>
            <option value="AIR">Air</option>
          </select>
          <input
            required
            name="dimensionInInches"
            value={form.dimensionInInches}
            placeholder="Dimensions (LxWxH in inches)"
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="datetime-local"
            name="expectedTimeOfArrival"
            value={new Date(form.expectedTimeOfArrival).toISOString().slice(0, 16)}
            onChange={(e) => setForm({ ...form, expectedTimeOfArrival: new Date(e.target.value) })}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <textarea
            required
            name="shipmentDescription"
            value={form.shipmentDescription}
            placeholder="Shipment Description"
            onChange={handleChange}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none h-24"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}

export const DeleteShipmentModal: React.FC<{
  shipment: Shipment
  onDelete: () => void
}> = ({ shipment, onDelete }) => {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    try {
      setDeleting(true)
      setError(null)

      const response = await fetch(`http://localhost:3001/admin/shipment/${shipment.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete shipment")
      }

      onDelete()
    } catch (error) {
      setError( "Failed to delete shipment")
      console.error("Error deleting shipment:", error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className={modalOverlayStyle}>
      <div className={modalBoxStyle}>
        <h2 className="text-2xl font-bold mb-4">Delete Shipment</h2>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <p className="mb-4">
          Are you sure you want to delete shipment <strong>{shipment.shipmentID}</strong>?
        </p>
        <p className="mb-4 text-red-600">This action cannot be undone.</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onDelete}
            disabled={deleting}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}
