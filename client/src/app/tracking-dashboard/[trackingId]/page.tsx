"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBox, faInfoCircle, faDollarSign, faFileAlt, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "next/navigation"
import { SERVER_URL } from "@/data/urls"
import Loading from "@/components/Loading"
import type { ShipmentDetails, ShippingStage } from "@/types/shipment.types"
import DocumentModal from "@/components/DocumentModal"
import PaymentModal from "@/components/PaymentModal"
import type { CryptoWalletAttributes } from "@/types/crypto-wallet.types"
import type { SocialMediaAttributes } from "@/types/social-media.types"

const ShipmentTrackingDashboard: React.FC = () => {
  const [shipmentDetails, setShipmentDetails] = useState<{
    shipmentDetails: ShipmentDetails
    shippingStages: ShippingStage[]
  } | null>(null)
  const [uploadModalStat, setUploadModalStat] = useState<ShippingStage | null>(null)
  const [paymentModalStat, setPaymentModalStat] = useState<ShippingStage | null>(null)
  const [viewShipmentDetails, setViewShipmentDetails] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<{ url: string; title: string } | null>(null)
  const [cryptoWallets, setCryptoWallets] = useState<CryptoWalletAttributes[]>([])
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaAttributes[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const params = useParams()
  const trackingId = params.trackingId
  // Get coordinates from the most recent shipping stage
  const mostRecentStage = shipmentDetails?.shippingStages?.[0]
  const long = mostRecentStage?.longitude || -119.417931
  const lat = mostRecentStage?.latitude || 10.606619

  // Helper function to handle document display
  const handleDocumentView = (document: File | Buffer | null | undefined, title: string) => {
    if (!document) return

    let url: string
    
    if (document instanceof File) {
      // Handle File objects
      url = URL.createObjectURL(document)
    } else if (document instanceof Buffer || (document && typeof document === 'object')) {
      // Handle Buffer objects (assuming they're base64 encoded)
      url = `data:application/pdf;base64,${document.toString('base64')}`
    } else {
      console.error('Unsupported document type')
      return
    }

    setSelectedDocument({ url, title })
  }

  const handleUploadReceipt = async (file: File) => {
    if (!uploadModalStat) return

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Invalid file type. Please upload an image or PDF.")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File is too large. Maximum size is 5MB.")
      return
    }

    setIsUploading(true)
    setUploadError(null)

    const formData = new FormData()
    formData.append("paymentReceipt", file)

    try {
      const response = await fetch(`${SERVER_URL}/stagees/${uploadModalStat.id}/upload-receipt`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Upload failed")
      }

      window.location.reload()
    } catch (error) {
      console.error("Upload error:", error)
      setUploadError(error instanceof Error ? error.message : "Failed to upload receipt")
    } finally {
      setIsUploading(false)
    }
  }

  useEffect(() => {
    if (!trackingId) return

    const fetchShipmentDetails = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/track/shipment/${trackingId}`)
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || "Failed to fetch shipment details")
        }
        const data: {
          shipmentDetails: ShipmentDetails
          shippingStages: ShippingStage[]
        } = await response.json()
        setShipmentDetails(data)
      } catch (error) {
        alert(error instanceof Error ? error.message : "An error occurred, try again later")
        console.error("Fetch Error:", error)
      }
    }

    const fetchPaymentOptions = async () => {
      try {
        // Fetch crypto wallets
        const walletsResponse = await fetch(`${SERVER_URL}/crypto-wallets`)
        if (walletsResponse.ok) {
          const walletsData = await walletsResponse.json()
          setCryptoWallets(walletsData)
        }

        // Fetch social media links
        const socialResponse = await fetch(`${SERVER_URL}/social-media`)
        if (socialResponse.ok) {
          const socialData = await socialResponse.json()
          setSocialMediaLinks(socialData)
        }
      } catch (error) {
        console.error("Error fetching payment options:", error)
      }
    }

    fetchShipmentDetails()
    fetchPaymentOptions()
  }, [trackingId])

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      if (selectedDocument?.url.startsWith('blob:')) {
        URL.revokeObjectURL(selectedDocument.url)
      }
    }
  }, [selectedDocument])

  if (!shipmentDetails) return <Loading />

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-full mb-4">
            <FontAwesomeIcon icon={faBox} className="text-white h-8 w-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Shipment Tracking</h1>
          <p className="text-lg text-gray-600 font-medium">#{trackingId}</p>
        </div>

        {/* Payment Alert */}
        {shipmentDetails.shippingStages?.some((s) => s.paymentStatus === "UNPAID") && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-6 mb-8 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <FontAwesomeIcon icon={faDollarSign} className="text-amber-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-amber-800">Payment Required</h3>
                <p className="text-amber-700 mt-1">Complete payment to continue shipment processing</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-indigo-600 h-5 w-5" />
            <h3 className="text-lg font-semibold text-gray-900">Live Location</h3>
          </div>
          <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden border-2 border-gray-100">
            <iframe
              title="Google Map"
              className="w-full h-full"
              src={`https://www.google.com/maps?q=${lat},${long}&z=15&output=embed`}
              loading="lazy"
            />
            <div className="absolute inset-0 border-[3px] border-white/20 rounded-xl pointer-events-none" />
          </div>
        </div>
        
        <div>
          <button
            className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            onClick={() => setViewShipmentDetails(!viewShipmentDetails)}
          >
            {viewShipmentDetails ? "Collapse Shipment Details" : "View Shipment Details"}
          </button>
        </div>

        {/* Shipment Details Grid */}
        {viewShipmentDetails && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-8 flex items-center gap-3">
              <FontAwesomeIcon icon={faInfoCircle} className="text-indigo-600" />
              Shipment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem label="Shipment ID" value={shipmentDetails.shipmentDetails.shipmentID} />
              <DetailItem label="Content" value={shipmentDetails.shipmentDetails.shipmentDescription} />
              <DetailItem label="Sender" value={shipmentDetails.shipmentDetails.senderName} />
              <DetailItem label="Sending Port" value={shipmentDetails.shipmentDetails.sendingPickupPoint} />
              <DetailItem label="Delivery Address" value={shipmentDetails.shipmentDetails.receivingAddress} />
              <DetailItem label="Recipient" value={shipmentDetails.shipmentDetails.recipientName} />
              <DetailItem label="Freight Type" value={shipmentDetails.shipmentDetails.freightType} />
              <DetailItem
                label="Expected Arrival"
                value={new Date(shipmentDetails.shipmentDetails.expectedTimeOfArrival).toLocaleDateString()}
              />
            </div>
          </div>
        )}

        {/* Progress Timeline */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-8 flex items-center gap-3">
            <FontAwesomeIcon icon={faInfoCircle} className="text-indigo-600" />
            Shipment Progress
          </h3>
          
          {mostRecentStage && (
            <div className="space-y-8">
              {/* Most Recent Stage - Highlighted */}
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex gap-6">
                  <div className="flex-none">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
                      <FontAwesomeIcon icon={faBox} className="text-white h-5 w-5" />
                    </div>
                     <div className="w-[0.2cm] bg-blue-600 flex-1 mt-1"></div>
                  </div>

                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                        Current Status
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">{mostRecentStage.title}</h4>
                    <p className="text-gray-600 mb-1">Location: {mostRecentStage.location}</p>
                    <p className="text-gray-600 mb-2">Carrier note: {mostRecentStage.carrierNote}</p>
                    <small className="text-sm text-gray-500">{new Date(mostRecentStage.dateAndTime).toLocaleString()}</small>

                    {mostRecentStage.feeInDollars && mostRecentStage.feeInDollars > 0 && (
                      <div className="mt-4 space-y-2">
                        <div className="text-gray-600">
                          Fee Required: <span className="text-lg font-medium text-amber-600">${mostRecentStage.feeInDollars}</span>
                        </div>
                        <div className="text-gray-600">
                          Payment Status:{" "}
                          <span
                            className={`font-medium ${
                              mostRecentStage.paymentStatus === "PAID"
                                ? "text-green-600"
                                : mostRecentStage.paymentStatus === "PENDING"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {mostRecentStage.paymentStatus}
                          </span>
                        </div>
                        {mostRecentStage.percentageNote && (
                          <small className="text-sm text-gray-600">{mostRecentStage.percentageNote}% of shipment value</small>
                        )}

                        {mostRecentStage.amountPaid && (
                          <>
                            <div className="text-gray-600 mb-2">
                              Amount Paid: <span className="text-lg font-medium text-green-600">${mostRecentStage.amountPaid}</span>
                            </div>
                            <small className="text-sm text-gray-600">
                              Payment Date: {mostRecentStage.paymentDate && new Date(mostRecentStage.paymentDate).toLocaleDateString()}
                            </small>
                          </>
                        )}
                        
                        <div className="flex flex-col lg:flex-row gap-4">
                          {mostRecentStage.paymentStatus === "UNPAID" && (
                            <button
                              onClick={() => setPaymentModalStat(mostRecentStage)}
                              className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                              Make Payment
                            </button>
                          )}

                          {(mostRecentStage.paymentStatus === "UNPAID" || mostRecentStage.paymentStatus === "PENDING") &&
                            !mostRecentStage.paymentReceipt && (
                              <button
                                onClick={() => setUploadModalStat(mostRecentStage)}
                                className="inline-block bg-amber-500 text-white px-6 py-2.5 rounded-lg hover:bg-amber-600 transition-colors font-medium"
                              >
                                Upload Receipt
                              </button>
                            )}

                          {mostRecentStage.paymentReceipt && (
                            <button
                              onClick={() => handleDocumentView(mostRecentStage.paymentReceipt, "Payment Receipt")}
                              className="bg-green-500 text-white px-6 py-2.5 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
                            >
                              <FontAwesomeIcon icon={faFileAlt} />
                              View Receipt
                            </button>
                          )}

                          {mostRecentStage.supportingDocument && (
                            <button
                              onClick={() => handleDocumentView(mostRecentStage.supportingDocument, "Supporting Document")}
                              className="bg-gray-500 text-white px-6 py-2.5 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center gap-2"
                            >
                              <FontAwesomeIcon icon={faFileAlt} />
                              View Document
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Previous Stages - Skip the most recent stage (index 0) */}
              {(shipmentDetails.shippingStages || []).slice(1).map((stat, index) => (
                <div key={stat.id} className="flex gap-6 relative">
                  <div className="flex-none">
                    <div className="flex flex-col items-center h-full">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <FontAwesomeIcon icon={faBox} className="text-gray-500 h-5 w-5" />
                      </div>
                      {index < shipmentDetails.shippingStages.length - 2 && (
                        <div className="w-[0.2cm] bg-blue-600 flex-1 mt-1"></div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 pb-6">
                    <h4 className="text-lg font-semibold text-gray-900">{stat.title}</h4>
                    <p className="text-gray-600 mb-1">Location: {stat.location}</p>
                    <p className="text-gray-600 mb-2">Carrier note: {stat.carrierNote}</p>
                    <small className="text-sm text-gray-500">{new Date(stat.dateAndTime).toLocaleString()}</small>

                    {stat.feeInDollars && stat.feeInDollars > 0 && (
                      <div className="mt-4 space-y-2">
                        <div className="text-gray-600">
                          Fee Required: <span className="text-lg font-medium text-amber-600">${stat.feeInDollars}</span>
                        </div>
                        <div className="text-gray-600">
                          Payment Status:{" "}
                          <span
                            className={`font-medium ${
                              stat.paymentStatus === "PAID"
                                ? "text-green-600"
                                : stat.paymentStatus === "PENDING"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {stat.paymentStatus}
                          </span>
                        </div>
                        {stat.percentageNote && (
                          <small className="text-sm text-gray-600">{stat.percentageNote}% of shipment value</small>
                        )}

                        {stat.amountPaid && (
                          <>
                            <div className="text-gray-600 mb-2">
                              Amount Paid: <span className="text-lg font-medium text-green-600">${stat.amountPaid}</span>
                            </div>
                            <small className="text-sm text-gray-600">
                              Payment Date: {stat.paymentDate && new Date(stat.paymentDate).toLocaleDateString()}
                            </small>
                          </>
                        )}
                        
                        <div className="flex flex-col lg:flex-row gap-4">
                          {stat.paymentStatus === "UNPAID" && (
                            <button
                              onClick={() => setPaymentModalStat(stat)}
                              className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                              Make Payment
                            </button>
                          )}

                          {(stat.paymentStatus === "UNPAID" || stat.paymentStatus === "PENDING") &&
                            !stat.paymentReceipt && (
                              <button
                                onClick={() => setUploadModalStat(stat)}
                                className="inline-block bg-amber-500 text-white px-6 py-2.5 rounded-lg hover:bg-amber-600 transition-colors font-medium"
                              >
                                Upload Receipt
                              </button>
                            )}

                          {stat.paymentReceipt && (
                            <button
                              onClick={() => handleDocumentView(stat.paymentReceipt, "Payment Receipt")}
                              className="bg-green-500 text-white px-6 py-2.5 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
                            >
                              <FontAwesomeIcon icon={faFileAlt} />
                              View Receipt
                            </button>
                          )}

                          {stat.supportingDocument && (
                            <button
                              onClick={() => handleDocumentView(stat.supportingDocument, "Supporting Document")}
                              className="bg-gray-500 text-white px-6 py-2.5 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center gap-2"
                            >
                              <FontAwesomeIcon icon={faFileAlt} />
                              View Document
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document Modal */}
      {selectedDocument && (
        <DocumentModal 
          url={selectedDocument.url}
          title={selectedDocument.title}
          onClose={() => {
            if (selectedDocument.url.startsWith('blob:')) {
              URL.revokeObjectURL(selectedDocument.url)
            }
            setSelectedDocument(null)
          }}
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
              <p className="mt-2 text-sm text-gray-500">Accepted formats: JPEG, PNG, GIF, PDF. Max size: 5MB</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setUploadModalStat(null)}
                className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModalStat && (
        <PaymentModal
          
          onClose={() => setPaymentModalStat(null)}
          onSuccess={() => window.location.reload()}
          feeInDollars={Number(paymentModalStat.feeInDollars)}
          cryptoWallets={cryptoWallets}
          socialMediaLinks={socialMediaLinks}
        />
      )}
    </div>
  )
}

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 transition-all hover:border-indigo-100 hover:shadow-sm">
    <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</dt>
    <dd className="text-base font-medium text-gray-900">{value}</dd>
  </div>
)

export default ShipmentTrackingDashboard