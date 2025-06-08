"use client"

import type { ShippingStage ,CreateShippingStage} from "@/types/shipment.types"
import { protectedApi } from "@/utils/apiUtils"
import type React from "react"
import { useEffect, useState } from "react"

interface ModalProps {
  onClose: () => void
  shipmentId: number
}


// Create a separate interface for the form state that allows File objects
interface CreateShippingStageForm extends Omit<CreateShippingStage, 'supportingDocument'> {
  supportingDocument: File | null
}

export const AddShippingStageModal: React.FC<ModalProps> = ({ onClose, shipmentId }) => {
  const [formData, setFormData] = useState<CreateShippingStageForm>({
    title: "",
    location: "",
    dateAndTime: new Date().toISOString().slice(0, 16),
    carrierNote: "",
    paymentStatus: "NO_PAYMENT_REQUIRED",
    percentageNote: "",
    feeInDollars: 0,
    supportingDocument: null,
    longitude: 0,
    latitude: 0
  })

  const [requiresFee, setRequiresFee] = useState(false)
  const [requiresDocument, setRequiresDocument] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        supportingDocument: file,
      }))
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      // Validation
      if (!formData.title.trim()) {
        setError("Title is required")
        return
      }
      if (!formData.location.trim()) {
        setError("Location is required")
        return
      }
      if (!formData.carrierNote.trim()) {
        setError("Carrier note is required")
        return
      }

      const form = new FormData()
      form.append("title", formData.title)
      form.append("location", formData.location)
      form.append("carrierNote", formData.carrierNote)
      form.append("dateAndTime", formData.dateAndTime)
      form.append("paymentStatus", requiresFee ? "UNPAID" : "NO_NEED_FOR_PAYMENT")
     form.append('feeInDollars', (formData.feeInDollars ?? 0).toString());
      form.append("percentageNote", (formData.percentageNote??0).toString())
      form.append("requiresFee", requiresFee.toString())
      form.append("longitude", formData.longitude.toString())
      form.append("latitude", formData.latitude.toString())

      if (requiresDocument && formData.supportingDocument) {
        form.append("supportingDocument", formData.supportingDocument)
      }

      // Debug: Log FormData contents
      console.log("FormData contents:");
      for (const [key, value] of form.entries()) {
        console.log(key, value);
      }

      // AWAIT the POST call
      const result = await protectedApi.post(`/admin/status/${shipmentId}`, form);
      console.log("Post result:", result);
      
      onClose()
      // window.location.reload()
    } catch (error) {
      console.error("Error creating shipment status:", error)
      setError(error instanceof Error ? error.message : "Failed to create shipping stage")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Add Shipment Stage</h2>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <label className="block mb-2">
          Title:
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Location:
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Longitude:
          <input
            name="longitude"
            type="number"
            value={formData.longitude}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Latitude:
          <input
            name="latitude"
            type="number"
            value={formData.latitude}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Carrier Note:
          <textarea
            name="carrierNote"
            value={formData.carrierNote}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          Date and Time:
          <input
            type="datetime-local"
            name="dateAndTime"
            value={formData.dateAndTime}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <label className="block mb-2">
          <input
            type="checkbox"
            checked={requiresDocument}
            onChange={() => setRequiresDocument((prev) => !prev)}
            className="mr-2"
          />
          Requires Supporting Document?
        </label>

        {requiresDocument && (
          <label className="block mb-2">
            Supporting Document:
            <input
              type="file"
              name="supportingDocument"
              className="w-full p-2 border rounded mb-4"
              onChange={handleFileChange}
              accept="image/*,.pdf"
            />
          </label>
        )}

        <label className="block mb-2">
          <input
            type="checkbox"
            checked={requiresFee}
            onChange={() => setRequiresFee((prev) => !prev)}
            className="mr-2"
          />
          Requires Fee?
        </label>

        {requiresFee && (
          <>
            <input
              className="w-full p-2 border rounded mb-2"
              type="number"
              placeholder="Fee ($)"
              name="feeInDollars"
              value={formData.feeInDollars}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
            <input
              className="w-full p-2 border rounded mb-2"
              type="number"
              placeholder="Percentage Note"
              name="percentageNote"
              value={formData.percentageNote}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </>
        )}

        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded" disabled={isSubmitting}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

interface Props {
  isOpen: boolean
  onClose: () => void
  initialData: ShippingStage
}

export const EditShippingStageModal: React.FC<Props> = ({ isOpen, onClose, initialData }) => {
  const [formState, setFormState] = useState<ShippingStage & { supportingDocument: File | null }>({
    ...initialData,
    supportingDocument: null,
  })
  const [requiresDocument, setRequiresDocument] = useState(!!initialData.supportingDocument)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setFormState({ ...initialData, supportingDocument: null })
      setRequiresDocument(!!initialData.supportingDocument)
      setError(null)
    }
  }, [isOpen, initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
  }

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setFormState((prev) => ({
      ...prev,
      supportingDocument: file,
    }));
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      setError(null)

      // Validation
      if (!formState.title.trim()) {
        setError("Title is required")
        return
      }
      if (!formState.location.trim()) {
        setError("Location is required")
        return
      }

      const formData = new FormData()

      // Add all form fields
      formData.append("title", formState.title)
      formData.append("location", formState.location)
      formData.append("carrierNote", formState.carrierNote)
      formData.append("dateAndTime", formState.dateAndTime)
      formData.append("paymentStatus", formState.paymentStatus)
      formData.append("feeInDollars", (formState.feeInDollars || 0).toString())
      formData.append("percentageNote", (formState.percentageNote || "").toString())
      formData.append("amountPaid", (formState.amountPaid || 0).toString())
      formData.append("paymentDate", formState.paymentDate || "")
      formData.append("longitude", formState.longitude.toString())
      formData.append("latitude", formState.latitude.toString())

      if (formState.supportingDocument) {
        formData.append("supportingDocument", formState.supportingDocument)
      }

        const result = await protectedApi.patch(`/admin/status/${formState.shipmentDetailsId}`, formData);
      console.log("Post result:", result);

    

      onClose()
      window.location.reload()
    } catch (error) {
      console.error("Error updating shipment status:", error)
      setError(error instanceof Error ? error.message : "Failed to update shipping stage")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Shipping Stage</h2>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formState.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formState.location}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
           <label className="block mb-2">
          Longitude:
          <input
            name="longitude"
            type="number"
            value={formState.longitude}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>
           <label className="block mb-2">
          Latitude:
          <input
            name="latitude"
            type="number"
            value={formState.latitude}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>


          <div>
            <label className="block font-medium">Date and Time</label>
            <input
              type="datetime-local"
              name="dateAndTime"
              value={formState.dateAndTime ? new Date(formState.dateAndTime).toISOString().slice(0, 16) : ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Carrier Note</label>
            <textarea
              name="carrierNote"
              value={formState.carrierNote}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Payment Status</label>
            <select
              name="paymentStatus"
              value={formState.paymentStatus}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="NO_NEED_FOR_PAYMENT">No Payment Required</option>
              <option value="UNPAID">Yet to be Paid</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Percentage Note</label>
              <input
                type="number"
                name="percentageNote"
                value={formState.percentageNote || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block font-medium">Fee (USD)</label>
              <input
                type="number"
                name="feeInDollars"
                value={formState.feeInDollars || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block font-medium">Amount Paid</label>
              <input
                type="number"
                name="amountPaid"
                value={formState.amountPaid || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block font-medium">Payment Date</label>
              <input
                type="date"
                name="paymentDate"
                value={formState.paymentDate ? new Date(formState.paymentDate).toISOString().slice(0, 10) : ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">
              <input
                type="checkbox"
                checked={requiresDocument}
                onChange={() => setRequiresDocument((prev) => !prev)}
                className="mr-2"
              />
              Update Supporting Document?
            </label>

            {requiresDocument && (
              <input type="file" onChange={handleFileChange} className="w-full" accept="image/*,.pdf" />
            )}

            {typeof initialData.supportingDocument === "string" && initialData.supportingDocument && (
              <div className="text-blue-500 text-sm mt-1">Current document available</div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface DeleteStatusModalProps {
  statusId: string
  onDeleted: () => void
}

export const DeleteShippingStageModal: React.FC<DeleteStatusModalProps> = ({ statusId, onDeleted }) => {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    try {
      setDeleting(true)
      setError(null)

      const response = await protectedApi.delete(`/admin/status/${statusId}`)

      if (response) {
        alert("Shipping stage deleted successfully")
        onDeleted()
        window.location.reload()
      }
    } catch (error) {
      console.error("Error deleting shipment status:", error)
      setError("Failed to delete shipping stage. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Delete Shipping Stage</h2>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <p className="mb-6 text-gray-700">
          Are you sure you want to delete this shipping stage? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onDeleted}
            className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}
