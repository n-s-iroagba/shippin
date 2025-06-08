"use client"

import {  useState } from "react"
import { DeleteShipmentModal, EditShipmentModal } from "@/components/ShipmentModals"
import Image from "next/image"
import { useParams } from "next/navigation"
import Loading from "@/components/Loading"
import type { ShipmentDetails, ShippingStage } from "@/types/shipment.types"
import { protectedApi } from "@/utils/apiUtils"

import {
  AddShippingStageModal,
  DeleteShippingStageModal,
  EditShippingStageModal,
} from "@/components/ShipmentStageModal"
import { useGetSingle } from "@/hooks/useGet"
import { routes } from "@/data/routes"
import { useAuth } from "@/hooks/useAuth"

const AdminShipmentDetails = () => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [selectedShippingStage, setSelectedShippingStage] = useState<ShippingStage | null>(null)
  const [showEditShippingStageModal, setShowEditShippingStageModal] = useState(false)
  const [showDeleteShippingStageModal, setShowDeleteShippingStageModal] = useState(false)
  const [showAddShippingStageModal, setShowAddShippingStageModal] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [approvalError, setApprovalError] = useState<string | null>(null)
  const [showConfirmApproval, setShowConfirmApproval] = useState<string | null>(null)
  const params = useParams()
  const shipmentId = Number(params.id)
 const {id:adminId,displayName}= useAuth()
  const {error, loading, data:shipmentDetails} = useGetSingle<ShipmentDetails>(routes.shipment.details(shipmentId),true)






    const handleApprovePayment = async (shippingStageId: string, amountPaid: number) => {
    try {
      setIsApproving(true)
      setApprovalError(null)

      if (!amountPaid || amountPaid <= 0) {
        setApprovalError("Invalid payment amount")
        return
      }

      const response = await protectedApi.post(`/statuses/${shippingStageId}/approve-payment`, {
        paymentDate: new Date().toISOString(),
        amountPaid: amountPaid,
      })

      if (response) {
        alert("Payment approved successfully")
        window.location.reload()
      }
    } catch (error) {
      console.error("Error approving payment:", error)
      setApprovalError("Failed to approve payment. Please try again.")
    } finally {
      setIsApproving(false)
      setShowConfirmApproval(null)
    }
  }

  if (loading) return <Loading />
  if (error) return <div>Error: {error}</div>
  if (!shipmentDetails) return <div>No shipment found</div>

  return (
    <div className="bg-white text-black">
      <h2 className="font-bold mb-2 mt-3 text-center text-black">Shipment Details</h2>
      <div className="space-y-2 text-black">
        <p className="rounded border-b-4 p-2">
          <strong>Shipment ID:</strong> {shipmentDetails.shipmentID}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Sender:</strong> {shipmentDetails.senderName}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Receipient Email:</strong> {shipmentDetails.receipientEmail}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Pick Up Point:</strong> {shipmentDetails.sendingPickupPoint}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Take off address:</strong> {shipmentDetails.shippingTakeoffAddress}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Destination Address:</strong> {shipmentDetails.receivingAddress}
        </p>

        <p className="rounded border-b-4 p-2">
          <strong>Recipient Name:</strong> {shipmentDetails.recipientName}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Shipment Description:</strong> {shipmentDetails.shipmentDescription}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Expected Time Of Arrival:</strong>{" "}
          {shipmentDetails.expectedTimeOfArrival
            ? new Date(shipmentDetails.expectedTimeOfArrival).toLocaleDateString()
            : "Not set"}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Freight Type:</strong> {shipmentDetails.freightType}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Weight in kg:</strong> {shipmentDetails.weight}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Dimension in inches:</strong> {shipmentDetails.dimensionInInches}
        </p>

        <div className="flex justify-evenly">
          <div className="my-2">
            <button onClick={() => setShowEditModal(true)} className="bg-blue-500 text-white p-1 rounded">
              Edit Shipment
            </button>
          </div>
          <div className="my-2">
            <button onClick={() => setShowDeleteModal(true)} className="bg-red-500 text-white p-1 rounded">
              Delete Shipment
            </button>
          </div>
        </div>

        <p className="rounded border-b-4 p-2"></p>
        <h2 className="text-md font-semibold text-center">Shipment Status</h2>

        <div className="flex justify-center">
          <button
            onClick={() => setShowAddShippingStageModal(true)}
            className="text-black bg-blue p-1 rounded bg-goldenrod"
          >
            Add Shipment Status
          </button>
        </div>

        {approvalError && <div className="p-3 bg-red-100 text-red-700 rounded-lg my-2">{approvalError}</div>}

        <ul>
          {shipmentDetails.ShippingStages.map((step: ShippingStage) => (
            <li key={step.id} className="flex justify-evenly border-b p-1">
              <div className="flex flex-col w-[60%] justify-between">
                <h4 className="text-center font-bold">Status:</h4>
                <div className="min-h-[40px] break-words whitespace-normal text-black text-center">{step.title}</div>
                <div className="min-h-[40px] break-words whitespace-normal text-black text-center">
                  Location: {step.location}
                </div>
                <div className="min-h-[40px] break-words whitespace-normal text-black text-center">
                  {step.carrierNote}
                </div>
                <div className="min-h-[40px] break-words whitespace-normal text-black text-center">
                  {new Date(step.dateAndTime).toLocaleString()}
                </div>
                <div className="min-h-[40px] break-words whitespace-normal text-black text-center">
                  Payment Status:{" "}
                  <span
                    className={`font-bold ${
                      step.paymentStatus === "PAID"
                        ? "text-green-600"
                        : step.paymentStatus === "PENDING"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {step.paymentStatus}
                  </span>
                </div>
                <div className="min-h-[40px] break-words whitespace-normal text-black text-center">
                  Fee: ${step.feeInDollars}
                </div>
                <div className="min-h-[40px] break-words whitespace-normal text-black text-center">
                  Amount Paid: ${step.amountPaid || 0}
                </div>
                <div className="min-h-[40px] break-words whitespace-normal text-black text-center">
                  Payment Date: {step.paymentDate ? new Date(step.paymentDate).toLocaleDateString() : "Not paid"}
                </div>
                <div className="min-h-[40px] break-words whitespace-normal text-black text-center">
                  {step.percentageNote}% of shipment value
                </div>

                {step.supportingDocument && (
                  <div className="my-2">
                    <button className="bg-gray-500 text-white p-1 rounded">view supporting document</button>
                    <Image
                      src={`data:image/jpeg;base64,${step.supportingDocument}`}
                      alt="Supporting document"
                      className="max-w-full h-auto max-h-40 mx-auto mt-2"
                    />
                  </div>
                )}

                {step.paymentReceipt && (
                  <div className="my-2">
                    <button className="bg-green-500 text-white p-1 rounded">view payment receipt</button>
                    <Image
                      src={`data:image/jpeg;base64,${step.paymentReceipt}`}
                      alt="Payment receipt"
                      className="max-w-full h-auto max-h-40 mx-auto mt-2"
                    />
                  </div>
                )}

                {step.paymentStatus === "PENDING" && step.paymentReceipt && (
                  <>
                    {showConfirmApproval === step.id ? (
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 my-2">
                        <p className="font-medium mb-2">Confirm payment approval:</p>
                        <p>Amount: ${step.feeInDollars}</p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleApprovePayment(step.id, Number(step.feeInDollars))}
                            className="bg-green-600 text-white p-2 rounded"
                            disabled={isApproving}
                          >
                            {isApproving ? "Processing..." : "Confirm"}
                          </button>
                          <button
                            onClick={() => setShowConfirmApproval(null)}
                            className="bg-gray-500 text-white p-2 rounded"
                            disabled={isApproving}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowConfirmApproval(step.id)}
                        className="bg-green-600 text-white p-2 rounded my-2"
                      >
                        Approve Payment
                      </button>
                    )}
                  </>
                )}

                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setShowEditShippingStageModal(true)
                      setSelectedShippingStage(step)
                    }}
                    className="bg-yellow-500 w-[10rem] text-white p-1 mx-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteShippingStageModal(true)
                      setSelectedShippingStage(step)
                    }}
                    className="bg-red-500 text-white p-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showAddShippingStageModal && (
        <AddShippingStageModal onClose={() => setShowAddShippingStageModal(false)} shipmentId={shipmentDetails.id} />
      )}
      {showEditModal && (
        <EditShipmentModal
          shipment={shipmentDetails}
          onClose={() => setShowEditModal(false)}
          onUpdate={() => setShowEditShippingStageModal(false)}
        />
      )}
      {showDeleteModal && <DeleteShipmentModal shipment={shipmentDetails} onDelete={() => setShowDeleteModal(false)} />}

      {showEditShippingStageModal && selectedShippingStage && (
        <EditShippingStageModal
          isOpen={showEditShippingStageModal}
          initialData={selectedShippingStage}
          onClose={() => setShowEditShippingStageModal(false)}
        />
      )}
      {showDeleteShippingStageModal && selectedShippingStage && (
        <DeleteShippingStageModal
          onDeleted={() => setShowDeleteShippingStageModal(false)}
          statusId={selectedShippingStage.id}
        />
      )}
    </div>
  )
}

export default AdminShipmentDetails
