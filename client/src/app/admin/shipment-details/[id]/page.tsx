"use client"

import {  useEffect, useState } from "react"
import {  EditShipmentModal } from "@/components/ShipmentModals"
import { useParams, useRouter } from "next/navigation"
import type { ShipmentDetails, ShippingStage } from "@/types/shipment.types"


import {
  AddShippingStageModal,
  EditShippingStageModal,
} from "@/components/ShipmentStageModal"
import { useGetSingle } from "@/hooks/useGet"
import { routes } from "@/data/routes"
import { useAuth } from "@/hooks/useAuth"
import AdminShippingStageCard from "@/components/AdminShippingStageCard"
import { DocumentModal } from "@/components/DocumentModal"
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal"
import { Spinner } from "@/components/Spinner"
import ErrorAlert from "@/components/ErrorAlert"

const AdminShipmentDetails = () => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [stageForDocument, setStageForDocument] =
    useState<ShippingStage | null>(null);
  const [selectedShippingStage, setSelectedShippingStage] = useState<ShippingStage | null>(null)
  const [showEditShippingStageModal, setShowEditShippingStageModal] = useState(false)
  const [showAddShippingStageModal, setShowAddShippingStageModal] = useState(false)
   const [documentType, setDocumentType] = useState<
    "supportingDocument" | "paymentReceipt"
  >("supportingDocument");
  const router = useRouter()
  const params = useParams()
  const shipmentId = Number(params.id)
  const {displayName,loading}= useAuth()
  const {error, loading:detailsLoading, data:shipmentDetails} = useGetSingle<ShipmentDetails>(routes.shipment.details(shipmentId),true)

  const handleViewDocument = (
    stage: ShippingStage,
    type: "supportingDocument" | "paymentReceipt"
  ) => {
    setStageForDocument(stage);
    setDocumentType(type);
  };
  const editStageInit = (stage: ShippingStage) =>{
    setSelectedShippingStage(stage)
    setShowEditShippingStageModal(true)
  }
  const deleteStageInit = (stage: ShippingStage) =>{
    setSelectedShippingStage(stage)
    setShowDeleteModal(true)
    }

  useEffect(()=>{
    if(!loading || !displayName ){
      router.push('/login')
  }},[displayName, loading, router]
)
  if (loading|| detailsLoading) return <Spinner/>
  if (error) return  <ErrorAlert message={error}/>
  if (!shipmentDetails) return <ErrorAlert message={'No shipment found'}/>

  return (
    <div className="bg-white text-black">
      <h4 className="font-bold mb-2 mt-3 text-center text-black">{displayName}</h4>
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

   

  {showEditModal && (
        <EditShipmentModal
          shipment={shipmentDetails}
          onClose={() => setShowEditModal(false)}
          onUpdate={() => setShowEditShippingStageModal(false)}
        />
      )}
    
      {showDeleteModal && <DeleteConfirmationModal message='Shipmen' type={'shipment'}  id={shipmentDetails.id} onClose={() => setShowDeleteModal(false)} />}

      {showAddShippingStageModal && (
        <AddShippingStageModal onClose={() => setShowAddShippingStageModal(false)} shipmentId={shipmentDetails.id} />
      )}
              <div>
          {shipmentDetails.ShippingStages.map((stage: ShippingStage) => (
            <AdminShippingStageCard
                          key={stage.id}
                          shippingStage={stage}
                          onViewDocument={handleViewDocument}
                          onEdit={editStageInit}
                          onDelete={deleteStageInit}
                          
                        />
          ))}

        </div>
          {stageForDocument && (
                    <DocumentModal
                      onClose={() => setStageForDocument(null)}
                      document={stageForDocument[documentType]}
                      title={`${
                        documentType === "supportingDocument"
                          ? "Supporting Document"
                          : "Payment Receipt"
                      } - ${stageForDocument.title}`}
                      stageName={stageForDocument.title}
                    />
                  )}
      </div>

      {showEditShippingStageModal && selectedShippingStage && (
        <EditShippingStageModal
          isOpen={showEditShippingStageModal}
          initialData={selectedShippingStage}
          onClose={() => setShowEditShippingStageModal(false)}
        />
      )}
       {selectedShippingStage && (
                <DeleteConfirmationModal
                  onClose={() => setSelectedShippingStage(null)}
                  id={selectedShippingStage.id}
                  type={'stage'}
                  message='Shipment Stage'
                />
              )}
    </div>
  )
}

export default AdminShipmentDetails
