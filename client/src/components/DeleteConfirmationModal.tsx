"use client"


import { routes } from "@/data/routes"
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

interface DeleteModalProps {
  id: number | string
  onClose: () => void
  type: "shipment" | "wallet" | "stage" | "social-media"|'document-template'
  message: string
}

const API_ROUTES_MAP = {
  shipment: routes.shipment.delete,
  wallet: routes.cryptoWallet.delete,
  stage: routes.Stages.delete,
  "social-media": routes.socialMedia.delete,
  'document-template':routes.templates.delete
}

export function DeleteConfirmationModal({ id, onClose, type, message }: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setIsDeleting(true)
    setError("")

    try {
      const endpoint = API_ROUTES_MAP[type](id)
      if (!endpoint) throw new Error("Invalid deletion type")

      await remove(endpoint)
     
      window.location.reload()
      onClose()
     
    } catch (err) {
      console.error("Deletion failed:", err)
      setError("Failed to delete. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-50 relative max-w-md w-full">
        {/* Decorative Corner Borders */}
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-blue-800 opacity-20" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-blue-800 opacity-20" />

        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-blue-900 flex items-center gap-2">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            Confirm Delete
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="text-blue-700 mb-6">
          Are you sure you want to delete <span className="font-semibold">{message}</span>? This action cannot be
          undone.
        </p>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border-2 border-red-100">{error}</div>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2 border-2 border-blue-200 text-blue-800 rounded-xl hover:bg-blue-50 disabled:opacity-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin">🌀</div>
                Deleting...
              </>
            ) : (
              "Confirm Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}