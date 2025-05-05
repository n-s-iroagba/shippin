import { SERVER_URL, stepUrl } from "@/data/urls";
import { ShipmentStatus } from "@/types/shipment.types";
import React, { useState } from "react";

interface ModalProps {
  onClose: () => void;
  shipmentId: number;
}

export const AddShipmentStatusModal: React.FC<ModalProps> = ({
  onClose,
  shipmentId,
}) => {
  const [formData, setFormData] = useState<ShipmentStatus>({
    title: "",
    dateAndTime: new Date().toISOString().split("T")[0],
    feeInDollars: 0,
    amountPaid: 0,
    paymentDate: null,
    percentageNote: null,
    paymentReceipt: null,
    paymentStatus:'NO_NEED_FOR_PAYMENT',
    requiresFee: false,
    supportingDocument: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, type, value } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? true : value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/admin/status/${shipmentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, shipmentDetailsId: shipmentId }),
      });
      if (!response.ok) throw new Error("Failed to add shipment status");
      window.location.reload();
      onClose();
    } catch (error) {
      console.error("Error creating shipment status:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Add Shipment Stage</h2>

        <input
          className="w-full p-2 border rounded mb-2"
          placeholder="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <textarea
          className="w-full p-2 border rounded mb-2"
          placeholder="Carrier Note"
          name="carrierNote"
          value={formData.carrierNote}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded mb-2"
          type="date"
          name="dateAndTime"
          value={formData.dateAndTime}
          onChange={handleChange}
        />
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            name="requiresFee"
            checked={formData.requiresFee}
            onChange={handleChange}
            className="mr-2"
          />
          Requires Fee?
        </label>

        {formData.requiresFee && (
          <>
            <input
              className="w-full p-2 border rounded mb-2"
              type="number"
              placeholder="Fee ($)"
              name="feeInDollars"
              value={formData.feeInDollars ?? ""}
              onChange={handleChange}
            />

            <input
              className="w-full p-2 border rounded mb-2"
              type="number"
              placeholder="Percentage Note"
              name="percentageNote"
              value={formData.percentageNote ?? ""}
              onChange={handleChange}
            />
          </>
        )}

        <input
          className="w-full p-2 border rounded mb-4"
          placeholder="Supporting Document URL"
          name="supportingDocument"
          value={formData.supportingDocument}
          onChange={handleChange}
        />

        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

interface EditShipmentStatusModalProps {
  step: ShipmentStatus;
  onClose: () => void;
}

export default function EditShipmentStatusModal({
  step,
  onClose,
}: EditShipmentStatusModalProps) {
  const [formData, setFormData] = useState<ShipmentStatus>({
    ...step,
    dateAndTime: step.dateAndTime ?? new Date().toISOString(),
    paymentDate: step.paymentDate ?? "",
    feeInDollars: step.feeInDollars ?? 0,
    amountPaid: step.amountPaid ?? 0,
    percentageNote: step.percentageNote,
    paymentReceipt: step.paymentReceipt ?? "",
    supportingDocument: step.supportingDocument ?? "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, type, value } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? true : value });
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
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Edit Shipment Status</h2>

        <label className="block mb-2">
          Title:
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            type="text"
          />
        </label>

        <label className="block mb-2">
          Carrier Note:
          <input
            name="carrierNote"
            value={formData.carrierNote}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            type="text"
          />
        </label>

        <label className="block mb-2">
          Date:
          <input
            type="date"
            name="dateAndTime"
            value={formData.dateAndTime?.toString().substring(0, 10)}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          Requires Fee:
          <input
            type="checkbox"
            name="requiresFee"
            checked={formData.requiresFee}
            onChange={handleChange}
            className="ml-2"
          />
        </label>

        {formData.requiresFee && (
          <>
            (
            <label className="block mb-2">
              Payment Status:
              <select
                name="paymentStatus"
                value={formData.paymentStatus??'YET_TO_BE_PAID'}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="PAID">PAID</option>
                <option value="YET_TO_BE_PAID">YET TO BE PAID</option>
                <option value="PENDING">PENDING</option>
              </select>
            </label>
            <label className="block mb-2">
              Fee in Dollars:
              <input
                type="number"
                name="feeInDollars"
                value={formData.feeInDollars ?? ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </label>
            <label className="block mb-2">
              Amount Paid:
              <input
                type="number"
                name="amountPaid"
                value={formData.amountPaid ?? ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </label>
            <label className="block mb-2">
              Payment Date:
              <input
                type="date"
                name="paymentDate"
                value={
                  formData.paymentDate
                    ? new Date(formData.paymentDate)
                        .toISOString()
                        .substring(0, 10)
                    : ""
                }
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </label>
            <label className="block mb-2">
              Payment Receipt:
              <input
                type="text"
                name="paymentReceipt"
                value={formData.paymentReceipt ?? ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </label>
            <label className="block mb-2">
              Percentage Note:
              <input
                type="text"
                name="percentageNote"
                value={formData.percentageNote ?? ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </label>
            )
          </>
        )}

        <label className="block mb-4">
          Supporting Document:
          <input
            type="text"
            name="supportingDocument"
            value={formData.supportingDocument ?? ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>

        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
