"use client"

import {  useEffect, useState } from "react"
import {  EditShipmentModal } from "@/components/ShipmentModals"
import { useParams, useRouter } from "next/navigation"
import type { Shipment, Stage } from "@/types/shipment.types"


import {
  AddStageModal,
  EditStageModal,
} from "@/components/stageModal"
import { useGetSingle } from "@/hooks/useGet"
import { routes } from "@/data/routes"
import { useAuth } from "@/hooks/useAuth"
import AdminStageCard from "@/components/AdminStageCard"
import { DocumentModal } from "@/components/DocumentModal"
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal"
import { Spinner } from "@/components/Spinner"
import ErrorAlert from "@/components/ErrorAlert"

const AdminShipment = () => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [stageForDocument, setStageForDocument] =
    useState<Stage | null>(null);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null)
  const [showEditStageModal, setShowEditStageModal] = useState(false)
  const [showAddStageModal, setShowAddStageModal] = useState(false)
   const [documentType, setDocumentType] = useState<
    "supportingDocument" | "paymentReceipt"
  >("supportingDocument");
  const router = useRouter()
  const params = useParams()
  const shipmentId = Number(params.id)
  const {displayName,loading}= useAuth()
  const {error, loading:detailsLoading, data:shipment} = useGetSingle<Shipment>(routes.shipment.details(shipmentId),true)

  const handleViewDocument = (
    stage: Stage,
    type: "supportingDocument" | "paymentReceipt"
  ) => {
    setStageForDocument(stage);
    setDocumentType(type);
  };
  const editStageInit = (stage: Stage) =>{
    setSelectedStage(stage)
    setShowEditStageModal(true)
  }
  const deleteStageInit = (stage: Stage) =>{
    setSelectedStage(stage)
    setShowDeleteModal(true)
    }

  useEffect(()=>{
    if(!loading || !displayName ){
      router.push('/login')
  }},[displayName, loading, router]
)
  if (loading|| detailsLoading) return <Spinner/>
  if (error) return  <ErrorAlert message={error}/>
  if (!shipment) return <ErrorAlert message={'No shipment found'}/>

  return (
    <div className="bg-white text-black">
      <h4 className="font-bold mb-2 mt-3 text-center text-black">{displayName}</h4>
      <h2 className="font-bold mb-2 mt-3 text-center text-black">Shipment Details</h2>
      <div className="space-y-2 text-black">
        <p className="rounded border-b-4 p-2">
          <strong>Shipment ID:</strong> {shipment.shipmentID}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Sender:</strong> {shipment.senderName}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Receipient Email:</strong> {shipment.receipientEmail}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Pick Up Point:</strong> {shipment.sendingPickupPoint}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Take off address:</strong> {shipment.shippingTakeoffAddress}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Destination Address:</strong> {shipment.receivingAddress}
        </p>

        <p className="rounded border-b-4 p-2">
          <strong>Recipient Name:</strong> {shipment.recipientName}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Shipment Description:</strong> {shipment.shipmentDescription}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Expected Time Of Arrival:</strong>{" "}
          {shipment.expectedTimeOfArrival
            ? new Date(shipment.expectedTimeOfArrival).toLocaleDateString()
            : "Not set"}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Freight Type:</strong> {shipment.freightType}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Weight in kg:</strong> {shipment.weight}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Dimension in inches:</strong> {shipment.dimensionInInches}
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
            onClick={() => setShowAddStageModal(true)}
            className="text-black bg-blue p-1 rounded bg-goldenrod"
          >
            Add Shipment Status
          </button>
        </div>

   

  {showEditModal && (
        <EditShipmentModal
          shipment={shipment}
          onClose={() => setShowEditModal(false)}
          onUpdate={() => setShowEditStageModal(false)}
        />
      )}
    
      {showDeleteModal && <DeleteConfirmationModal message='Shipmen' type={'shipment'}  id={shipment.id} onClose={() => setShowDeleteModal(false)} />}

      {showAddStageModal && (
        <AddStageModal onClose={() => setShowAddStageModal(false)} shipmentId={shipment.id} />
      )}
              <div>
          {shipment.Stages.map((stage: Stage) => (
            <AdminStageCard
                          key={stage.id}
                          Stage={stage}
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

      {showEditStageModal && selectedStage && (
        <EditStageModal
          isOpen={showEditStageModal}
          initialData={selectedStage}
          onClose={() => setShowEditStageModal(false)}
        />
      )}
       {selectedStage && (
                <DeleteConfirmationModal
                  onClose={() => setSelectedStage(null)}
                  id={selectedStage.id}
                  type={'stage'}
                  message='Shipment Stage'
                />
              )}
    </div>
  )
}

export default AdminShipment
