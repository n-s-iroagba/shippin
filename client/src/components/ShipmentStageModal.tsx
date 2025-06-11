
import { routes } from "@/data/constants";
import { Stage, StageCreationDto } from "@/types/shipment.types";
import { protectedApi } from "@/utils/apiUtils";
import React, { useEffect, useState } from "react";

interface ModalProps {
  onClose: () => void;
  shipmentId: number;
}

export const AddStageModal: React.FC<ModalProps> = ({ onClose, shipmentId }) => {
  const [formData, setFormData] = useState<Omit<StageCreationDto, 'id' | 'paymentDate' | 'amountPaid' | 'paymentReceipt'>>({
    title: '',
    dateAndTime: new Date().toISOString().split('T')[0],
    carrierNote: '',
    paymentStatus: 'NO_NEED_FOR_PAYMENT',
    percentageNote: null,
    feeInDollars: 0,
    supportingDocument: null,
  });

  const [requiresFee, setRequiresFee] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        supportingDocument: file,
      }));
    }
  };

  const handleSubmit = async () => {

    try {
      const form = new FormData();

      form.append('title', formData.title);
      form.append('carrierNote', formData.carrierNote);
      form.append('dateAndTime', formData.dateAndTime);
      form.append('paymentStatus', requiresFee ? 'YET_TO_BE_PAID' : 'NO_NEED_FOR_PAYMENT');
      form.append('feeInDollars', formData.feeInDollars?.toString() ?? '0');
      form.append('percentageNote', formData.percentageNote?.toString() ?? '');

      if (formData.supportingDocument) {
        form.append('supportingDocument', formData.supportingDocument);
      }

      for (const [key, val] of form.entries()) {
        console.log(`${key}:`, val);
      }


      const response = await fetch(routes.Stage.create(shipmentId), {
        method: 'POST',
        body: form,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.stage}`);
      }

      onClose();
    } catch (error) {
      console.error('Error creating shipment stage:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Add Shipment Stage</h2>

        <label className="block mb-2">
          Title:
          <input name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" />
        </label>

        <label className="block mb-2">
          Carrier Note:
          <textarea name="carrierNote" value={formData.carrierNote} onChange={handleChange} className="w-full p-2 border rounded" />
        </label>

        <label className="block mb-2">
          Date:
          <input
            type="date"
            name="dateAndTime"
            value={formData.dateAndTime}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-2">
          Supporting Document:
          <input
            type="file"
            name="supportingDocument"
            className="w-full p-2 border rounded mb-4"
            onChange={handleFileChange}
          />
        </label>

        <label className="block mb-2">
          <input
            type="checkbox"
            name="requiresFee"
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
              value={formData.feeInDollars ?? 0}
              onChange={handleChange}
            />
            <input
              className="w-full p-2 border rounded mb-2"
              type="number"
              placeholder="Percentage Note"
              name="percentageNote"
              value={formData.percentageNote ?? ''}
              onChange={handleChange}
            />
          </>
        )}

        <div className="flex justify-between">
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
            Create
          </button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};




interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: Stage;

}

export const EditStageModal: React.FC<Props> = ({ isOpen, onClose, initialData }) => {
  const [formState, setFormState] = useState<Stage>({ ...initialData, supportingDocument: null });

  useEffect(() => {
    if (isOpen) {
      setFormState({ ...initialData, supportingDocument: null });
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormState(prev => ({ ...prev, supportingDocument: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      if (key === 'supportingDocument' && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value ?? '');
      }
    });

    try {
      const response = await fetch(routes.Stage.update(initialData.id), {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.stage}`);
      }

      onClose();
    } catch (error) {
      console.error('Error creating shipment stage:', error);
    }
  }


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Edit Shipping Stage</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formState.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Date and Time</label>
            <input
              type="datetime-local"
              name="dateAndTime"
              value={formState.dateAndTime}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Carrier Note</label>
            <textarea
              name="carrierNote"
              value={formState.carrierNote}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
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
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="PARTIAL_PAYMENT">Failed</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Percentage Note</label>
              <input
                type="number"
                name="percentageNote"
                value={formState.percentageNote ?? ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium">Fee (USD)</label>
              <input
                type="number"
                name="feeInDollars"
                value={formState.feeInDollars ?? ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium">Amount Paid</label>
              <input
                type="number"
                name="amountPaid"
                value={formState.amountPaid}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium">Payment Date</label>
              <input
                type="date"
                name="paymentDate"
                value={formState.paymentDate ?? ''}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>  

          <div>
            <label className="block font-medium">Supporting Document</label>
            <input type="file" onChange={handleFileChange} className="w-full" />
            {typeof initialData.supportingDocument === 'string' && !formState.supportingDocument && (
              <a
                href={initialData.supportingDocument}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm mt-1 inline-block"
              >
                View current document
              </a>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};





