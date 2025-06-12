"use client"

import { useEffect, useState } from "react"
import { EditShipmentModal } from "@/components/ShipmentModals"
import { useParams, useRouter } from "next/navigation"
import type { Shipment } from "@/types/shipment.types"
import { Stage } from "@/types/stage.types"
import { AddStageModal, EditStageModal } from "@/components/ShipmentStageModal"
import AdminStageCard from "@/components/AdminStageCard"

import { useGetSingle } from "@/hooks/useGet"
import { routes } from "@/data/routes"
import { useAuth } from "@/hooks/useAuth"


import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal"
import { Spinner } from "@/components/Spinner"
import ErrorAlert from "@/components/ErrorAlert"
import { 
  TruckIcon, 
  MapPinIcon, 
  CalendarIcon, 
  ScaleIcon, 
  CubeIcon,
  UserIcon,
  EnvelopeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline"

const AdminShipment = () => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showShipmentDeleteModal, setShowShipmentDeleteModal] = useState(false)
  const [showStageDeleteModal, setShowStageDeleteModal] = useState(false)
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null)
  const [showEditStageModal, setShowEditStageModal] = useState(false)
  const [showAddStageModal, setShowAddStageModal] = useState(false)
  
  const router = useRouter()
  const params = useParams()
  const shipmentId = Number(params.id)
  const { displayName, loading } = useAuth()
  const { error, loading: detailsLoading, data: shipment } = useGetSingle<Shipment>(routes.shipment.details(shipmentId), true)

 

  const editStageInit = (stage: Stage) => {
    setSelectedStage(stage)
    setShowEditStageModal(true)
  }

  const deleteStageInit = (stage: Stage) => {
    setSelectedStage(stage)
    setShowStageDeleteModal(true)
  }

  useEffect(() => {
    if (!loading && !displayName) {
      router.push('/login')
    }
  }, [displayName, loading, router])

  if (loading || detailsLoading) return <Spinner />
  if (error) return <ErrorAlert message={error} />
  if (!shipment) return <ErrorAlert message={'No shipment found'} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <TruckIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Shipment Details</h1>
                <p className="text-gray-600">Managed by {displayName}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowEditModal(true)} 
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PencilIcon className="w-4 h-4" />
                Edit Shipment
              </button>
              <button 
                onClick={() => setShowShipmentDeleteModal(true)} 
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Shipment Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-600" />
              Basic Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 w-32">Shipment ID:</div>
                <div className="font-semibold text-gray-900">{shipment.shipmentID}</div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 w-32">Sender:</div>
                <div className="font-semibold text-gray-900">{shipment.senderName}</div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 w-32">Recipient:</div>
                <div className="font-semibold text-gray-900">{shipment.recipientName}</div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                <div className="font-medium text-gray-600 w-32">Email:</div>
                <div className="font-semibold text-gray-900">{shipment.receipientEmail}</div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-blue-600" />
              Location Details
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 mb-1">Pickup Point:</div>
                <div className="font-semibold text-gray-900">{shipment.sendingPickupPoint}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 mb-1">Takeoff Address:</div>
                <div className="font-semibold text-gray-900">{shipment.origin}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 mb-1">Destination:</div>
                <div className="font-semibold text-gray-900">{shipment.receivingAddress}</div>
              </div>
            </div>
          </div>

          {/* Shipment Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CubeIcon className="w-5 h-5 text-blue-600" />
              Shipment Specifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 w-32">Freight Type:</div>
                <div className="font-semibold text-gray-900">{shipment.freightType}</div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <ScaleIcon className="w-4 h-4 text-gray-500" />
                <div className="font-medium text-gray-600 w-32">Weight:</div>
                <div className="font-semibold text-gray-900">{shipment.weight} kg</div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 w-32">Dimensions:</div>
                <div className="font-semibold text-gray-900">{shipment.dimensionInInches} inches</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 mb-1">Description:</div>
                <div className="font-semibold text-gray-900">{shipment.shipmentDescription}</div>
              </div>
            </div>
          </div>

          {/* Timeline Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              Timeline
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-600 w-32">ETA:</div>
                <div className="font-semibold text-gray-900">
                  {shipment.expectedTimeOfArrival
                    ? new Date(shipment.expectedTimeOfArrival).toLocaleDateString()
                    : "Not set"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipment Status Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Shipment Status</h2>
            <button
              onClick={() => setShowAddStageModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Add Stage
            </button>
          </div>

          <div className="space-y-6">
            {shipment.stages && shipment.stages.length > 0 ? (
              shipment.stages.map((stage: Stage) => (
                <AdminStageCard
                  key={stage.id}
                  Stage={stage}
                  onEdit={editStageInit}
                  onDelete={deleteStageInit}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <TruckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No stages yet</h3>
                <p className="text-gray-600 mb-4">Start tracking your shipment by adding the first stage</p>
                <button
                  onClick={() => setShowAddStageModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add First Stage
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showEditModal && (
          <EditShipmentModal
            shipment={shipment}
            onClose={() => setShowEditModal(false)}
            onUpdate={() => setShowEditModal(false)}
          />
        )}

        {showShipmentDeleteModal && (
          <DeleteConfirmationModal 
            message='Shipment' 
            type={'shipment'}  
            id={shipment.id} 
            onClose={() => setShowShipmentDeleteModal(false)} 
          />
        )}

        {showAddStageModal && (
          <AddStageModal 
            onClose={() => setShowAddStageModal(false)} 
            shipmentId={shipment.id} 
          />
        )}

        {showEditStageModal && selectedStage && (
          <EditStageModal
            isOpen={showEditStageModal}
            initialData={selectedStage}
            onClose={() => setShowEditStageModal(false)}
          />
        )}

        {showStageDeleteModal && selectedStage && (
          <DeleteConfirmationModal
            onClose={() => {
              setSelectedStage(null)
              setShowStageDeleteModal(false)
            }}
            id={selectedStage.id}
            type={'stage'}
            message='Shipment Stage'
          />
        )}

     
      </div>
    </div>
  )
}

export default AdminShipment
