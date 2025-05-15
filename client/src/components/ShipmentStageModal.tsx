import { routes } from "@/data/constants";
import { PaymentStatus, ShippingStage } from "@/types/shipment.types";
import { protectedApi } from "@/utils/apiUtils";
import React, { useState } from "react";

interface ModalProps {
  onClose: () => void;
  shipmentId: number;
}

export const AddShippingStageModal: React.FC<ModalProps> = ({
  onClose,
  shipmentId,
}) => {
  const [formData, setFormData] = useState<Omit<ShippingStage,'id'|'paymentDate'|'amountPaid'|'paymentReceipt'>>({
    title: "",
   dateAndTime: new Date().toISOString().split("T")[0],
    feeInDollars: 0,


    percentageNote: null,

    paymentStatus: "NO_NEED_FOR_PAYMENT" as PaymentStatus,
    supportingDocument: "",
    carrierNote: "",
  });
  const [requiresFee, setRequiresFee] = useState(false)
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
      const payload = {
        ...formData,
        paymentStatus: requiresFee ? 'YET_TO_BE_PAID' : "NO_NEED_FOR_PAYMENT",
      };

  await protectedApi.post(routes.shippingStage.create(shipmentId),payload)
      onClose();
    } catch (error) {
      console.error("Error creating shipment status:", error);
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
            value={formData.dateAndTime?.toString().substring(0, 10)}
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
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        setFormData((prev) => ({
          ...prev,
          supportingDocument: file,
        }));
      }
    }}
  />
</label>

         <label className="block mb-2">
          <input type="checkbox" name="requiresFee" checked={requiresFee} onChange={()=>setRequiresFee(!requiresFee)} className="mr-2" />
          Requires Fee?
        </label>

        {requiresFee && (
          <>
            <input className="w-full p-2 border rounded mb-2" type="number" placeholder="Fee ($)" name="feeInDollars" value={formData.feeInDollars??0} onChange={handleChange} />
            <input className="w-full p-2 border rounded mb-2" type="number" placeholder="Percentage Note" name="percentageNote" value={formData.percentageNote ?? ""} onChange={handleChange} />
          </>
        )}

        <div className="flex justify-between">
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
};


interface EditShippingStageModalProps {
  status: ShippingStage;
  onClose: () => void;
}

export default function EditShippingStageModal({ status, onClose }: EditShippingStageModalProps) {
  const [formData, setFormData] = useState<ShippingStage>({
    ...status,
    dateAndTime: status.dateAndTime??new Date().toISOString().split("T")[0],
    paymentDate: status.paymentDate?.substring(0, 10) ?? "",
    feeInDollars: status.feeInDollars,
    amountPaid: status.amountPaid ?? 0,
    paymentReceipt: status.paymentReceipt ?? "",
    supportingDocument: status.supportingDocument ?? "",
    percentageNote: status.percentageNote ?? null,
 
  });
    const [requiresFee, setRequiresFee] = useState(false)


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]:  value });
  };


  const handleSubmit = async () => {
    try {
     await protectedApi.patch(routes.shippingStage.update(status.id),formData)

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
            value={formData.dateAndTime?.toString().substring(0, 10)}
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
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        setFormData((prev) => ({
          ...prev,
          supportingDocument: file,
        }));
      }
    }}
  />
</label>

         <label className="block mb-2">
          <input type="checkbox" name="requiresFee" checked={requiresFee} onChange={()=>setRequiresFee(!requiresFee)} className="mr-2" />
          Requires Fee?
        </label>

        {requiresFee && (
          <>
            <input className="w-full p-2 border rounded mb-2" type="number" placeholder="Fee ($)" name="feeInDollars" value={formData.feeInDollars??0} onChange={handleChange} />
            <input className="w-full p-2 border rounded mb-2" type="number" placeholder="Percentage Note" name="percentageNote" value={formData.percentageNote ?? ""} onChange={handleChange} />
          </>
        )}

        <div className="flex justify-between">
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}


interface DeleteStatusModalProps {
  statusId: number;
  onDeleted: () => void;
}

export const DeleteShippingStageModal: React.FC<DeleteStatusModalProps> = ({
  statusId,
  onDeleted,
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await protectedApi.delete(routes.shippingStage.delete(statusId));
      alert('Item deleted')
      onDeleted();

    } catch (error) {
      console.error("Error deleting shipment status:", error);
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4"> Deletion</h2>
        <p className="mb-6 text-gray-700">
          Are you sure you want to delete this shipment status?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onDeleted}
            className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
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
  );
};
