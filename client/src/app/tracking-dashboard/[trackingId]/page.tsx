"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBox, faDollarSign, faFileAlt, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "next/navigation"
import type { Shipment } from "@/types/shipment.types"
import type { Stage } from "@/types/stage.types"
import PaymentModal from "@/components/PaymentModal"
import type { CryptoWallet } from "@/types/crypto-wallet.types"
import type { SocialMedia } from "@/types/social-media.types"
import { useGetSingle, useGetList } from "@/hooks/useGet"
import { routes } from "@/data/routes"
import { DocumentModal } from "@/components/DocumentModal"
import { Spinner } from "@/components/Spinner"
import ErrorAlert from "@/components/ErrorAlert"

const ShipmentTrackingDashboard: React.FC = () => {
  const [uploadModalStat, setUploadModalStat] = useState<Stage | null>(null)
  const [paymentModalStat, setPaymentModalStat] = useState<Stage | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<{ url: string; title: string } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const params = useParams()
  const trackingId = params.trackingId as string

  // Fetch shipment data
  const { data: shipmentData, loading: shipmentLoading, error: shipmentError } = useGetSingle<{
    shipment: Shipment;
    Stages: Stage[];
  }>(routes.shipment.track(Number(trackingId)));

  // Fetch crypto wallets
  const { data: cryptoWallets, loading: walletsLoading, error: walletsError } = useGetList<CryptoWallet>(routes.cryptoWallet.list(0));

  // Fetch social media links
  const { data: socialMediaLinks, loading: socialMediaLoading, error: socialMediaError } = useGetList<SocialMedia>(routes.socialMedia.list(0));

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      if (selectedDocument?.url.startsWith('blob:')) {
        URL.revokeObjectURL(selectedDocument.url)
      }
    }
  }, [selectedDocument])

  if (shipmentLoading || walletsLoading || socialMediaLoading) {
    return <Spinner />
  }

  if (shipmentError || walletsError || socialMediaError) {
    return (
      <div className="text-center p-4">
        <ErrorAlert message={shipmentError || walletsError || socialMediaError || "An error occurred while loading data"} />
      </div>
    )
  }

  if (!shipmentData) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">No shipment data found</p>
      </div>
    )
  }

  const { shipment, Stages } = shipmentData

  const handleUploadReceipt = async (file: File) => {
    if (!uploadModalStat) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('paymentReceipt', file)

      const response = await fetch(routes.stage.uploadReceipt(uploadModalStat.id), {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload receipt')
      }

      setUploadModalStat(null)
      window.location.reload()
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload receipt')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      {/* Payment Alert */}
      {Stages?.some((s) => s.paymentStatus === "UNPAID" || s.paymentStatus === "PENDING") && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-6 mb-8 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <FontAwesomeIcon icon={faDollarSign} className="text-amber-600 h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-900">Payment Required</h3>
              <p className="text-amber-700">
                Please complete the payment for the following stages to continue shipping
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Shipment Details */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <FontAwesomeIcon icon={faBox} className="text-blue-600 h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shipment Details</h2>
            <p className="text-gray-600">Tracking ID: {shipment.shipmentID}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem label="Shipment ID" value={shipment.shipmentID} />
          <DetailItem label="Content" value={shipment.shipmentDescription} />
          <DetailItem label="Sender" value={shipment.senderName} />
          <DetailItem label="Sending Port" value={shipment.sendingPickupPoint} />
          <DetailItem label="Delivery Address" value={shipment.receivingAddress} />
          <DetailItem label="Recipient" value={shipment.recipientName} />
          <DetailItem label="Freight Type" value={shipment.freightType} />
          <DetailItem
            label="Expected Arrival"
            value={new Date(shipment.expectedTimeOfArrival).toLocaleDateString()}
          />
        </div>
      </div>

      {/* Shipping Stages */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-green-100 p-3 rounded-full">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-600 h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shipping Stages</h2>
            <p className="text-gray-600">Track your shipment&apos;s progress</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Most Recent Stage */}
          {Stages?.[0] && (
            <div className="flex gap-6">
              <div className="flex-none">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faBox} className="text-blue-600 h-6 w-6" />
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900">{Stages[0].title}</h3>
                  <p className="text-blue-700 mt-1">{Stages[0].carrierNote || 'No notes available'}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-sm text-blue-600">
                      {new Date(Stages[0].dateAndTime).toLocaleString()}
                    </span>
                    <span className="text-sm text-blue-600">{Stages[0].location}</span>
                  </div>
                  {Stages[0].amountPaid && Stages[0].amountPaid > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="text-gray-600">
                        Payment Amount: <span className="text-lg font-medium text-amber-600">${Stages[0].amountPaid}</span>
                      </div>
                      <div className="text-gray-600">
                        Payment Status:{" "}
                        <span
                          className={`font-medium ${
                            Stages[0].paymentStatus === "PAID"
                              ? "text-green-600"
                              : Stages[0].paymentStatus === "PENDING"
                                ? "text-blue-600"
                                : "text-red-600"
                          }`}
                        >
                          {Stages[0].paymentStatus}
                        </span>
                      </div>

                      {Stages[0].paymentDate && (
                        <div className="text-gray-600">
                          Payment Date:{" "}
                          <span className="font-medium">
                            {new Date(Stages[0].paymentDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {Stages[0].feeName && (
                        <div className="text-gray-600">
                          Fee Name: <span className="font-medium">{Stages[0].feeName}</span>
                        </div>
                      )}

                      {Stages[0].paymentReceipts && Stages[0].paymentReceipts.length > 0 && (
                        <div className="mt-4">
                          <button
                            onClick={() => {
                              const receipt = Stages[0].paymentReceipts[0]
                              const blob = new Blob([receipt], { type: 'application/pdf' })
                              const url = URL.createObjectURL(blob)
                              setSelectedDocument({ url, title: 'Payment Receipt' })
                            }}
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                          >
                            <FontAwesomeIcon icon={faFileAlt} />
                            View Receipt ({Stages[0].paymentReceipts.length})
                          </button>
                        </div>
                      )}

                      {Stages[0].paymentStatus === "UNPAID" && (
                        <div className="mt-4">
                          <button
                            onClick={() => setPaymentModalStat(Stages[0])}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                          >
                            Make Payment
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Previous Stages */}
          {Stages?.slice(1).map((stage) => (
            <div key={stage.id} className="flex gap-6">
              <div className="flex-none">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faBox} className="text-gray-600 h-6 w-6" />
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900">{stage.title}</h3>
                  <p className="text-gray-700 mt-1">{stage.carrierNote || 'No notes available'}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {new Date(stage.dateAndTime).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">{stage.location}</span>
                  </div>
                  {stage.amountPaid && stage.amountPaid > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="text-gray-600">
                        Payment Amount: <span className="text-lg font-medium text-amber-600">${stage.amountPaid}</span>
                      </div>
                      <div className="text-gray-600">
                        Payment Status:{" "}
                        <span
                          className={`font-medium ${
                            stage.paymentStatus === "PAID"
                              ? "text-green-600"
                              : stage.paymentStatus === "PENDING"
                                ? "text-blue-600"
                                : "text-red-600"
                          }`}
                        >
                          {stage.paymentStatus}
                        </span>
                      </div>

                      {stage.paymentDate && (
                        <div className="text-gray-600">
                          Payment Date:{" "}
                          <span className="font-medium">
                            {new Date(stage.paymentDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {stage.feeName && (
                        <div className="text-gray-600">
                          Fee Name: <span className="font-medium">{stage.feeName}</span>
                        </div>
                      )}

                      {stage.paymentReceipts && stage.paymentReceipts.length > 0 && (
                        <div className="mt-4">
                          <button
                            onClick={() => {
                              const receipt = stage.paymentReceipts[0]
                              const blob = new Blob([receipt], { type: 'application/pdf' })
                              const url = URL.createObjectURL(blob)
                              setSelectedDocument({ url, title: 'Payment Receipt' })
                            }}
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                          >
                            <FontAwesomeIcon icon={faFileAlt} />
                            View Receipt ({stage.paymentReceipts.length})
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Modal */}
      {selectedDocument && (
        <DocumentModal
          onClose={() => {
            if (selectedDocument.url.startsWith('blob:')) {
              URL.revokeObjectURL(selectedDocument.url)
            }
            setSelectedDocument(null)
          }}
          document={selectedDocument.url as unknown as File}
          title={selectedDocument.title}
          stageName=""
        />
      )}

      {/* Upload Receipt Modal */}
      {uploadModalStat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-6">Upload Payment Receipt</h3>
            {uploadError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{uploadError}</div>}
            <div className="mb-6">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleUploadReceipt(file)
                }}
                className="w-full p-2 border border-gray-300 rounded-lg"
                disabled={isUploading}
              />
              <p className="mt-2 text-sm text-gray-500">
                Accepted formats: JPG, PNG, GIF, PDF (max 10MB)
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setUploadModalStat(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={() => setUploadModalStat(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModalStat && (
        <PaymentModal
          statusId={paymentModalStat.id.toString()}
          onClose={() => setPaymentModalStat(null)}
          feeInDollars={paymentModalStat.amountPaid || 0}
          cryptoWallets={cryptoWallets}
          socialMediaLinks={socialMediaLinks}
          paymentStatus={paymentModalStat.paymentStatus}
          paymentNotes={paymentModalStat.feeName}
        />
      )}
    </div>
  )
}

interface DetailItemProps {
  label: string
  value: string | number | Date
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">
      {value instanceof Date ? value.toLocaleDateString() : value}
    </dd>
  </div>
)

export default ShipmentTrackingDashboard