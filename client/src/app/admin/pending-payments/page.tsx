"use client";
import { useState } from "react";
import { DocumentModal } from "@/components/DocumentModal";
import { PaymentApprovalModal } from "@/components/PaymentApprovalModal";
import { Spinner } from "@/components/Spinner";
import ErrorAlert from "@/components/ErrorAlert";
import { TruckIcon } from "@heroicons/react/24/outline";
import { useGetList } from "@/hooks/useGet";

import PendingPaymentCard from "@/components/PendingPaymentCard";
import { routes } from "@/data/routes";
import { useAuth } from "@/hooks/useAuth";
import { Stage } from "@/types/stage.types";

export default function StageCrudPage() {
  const {id} = useAuth()
  const {
    data: Stages,
    loading,
    error,
  } = useGetList<Stage>(routes.stage.unapprovedPayments(id));
  const [stageForDocument, setStageForDocument] =
    useState<Stage | null>(null);
  const [stageForPayment, setStageForPayment] = useState<Stage | null>(
    null
  );
  const [documentType, setDocumentType] = useState<
    "supportingDocument" | "paymentReceipt"
  >("supportingDocument");
  const [selectedReceiptIndex, setSelectedReceiptIndex] = useState<number>(0);

  if (loading) {
    return <Spinner className="w-10 h-10 text-blue-600" />;
  }

  if (error) {
    return <ErrorAlert message={error || "Failed to load shipping stages"} />;
  }

  const handleViewDocument = (
    stage: Stage,
    type: "supportingDocument" | "paymentReceipt",
    receiptIndex?: number
  ) => {
    setStageForDocument(stage);
    setDocumentType(type);
    if (type === "paymentReceipt" && receiptIndex !== undefined) {
      setSelectedReceiptIndex(receiptIndex);
    }
  };

  const handleApprovePayment = (stage: Stage) => {
    setStageForPayment(stage);
  };

  // Get the document to display based on type
  const getDocumentToDisplay = () => {
    if (!stageForDocument) return null;
    
    if (documentType === "paymentReceipt") {
      // Return the selected payment receipt from the array
      return stageForDocument.paymentReceipts?.[selectedReceiptIndex] || null;
    }
    
    // For supporting documents, we'd need to add this field to the Stage type
    // For now, return null since it doesn't exist
    return null;
  };

  return (
    <>
      <div className="container mx-auto p-4 bg-blue-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
              Shipping Stages
            </h1>
            <div className="text-sm text-blue-700">
              Manage payment approvals and view shipping documents
            </div>
          </div>

          {!Stages || Stages.length === 0 ? (
            <div className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-100 text-center max-w-md mx-auto">
              <div className="flex justify-center mb-4">
                <TruckIcon className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                No Shipping Stages Yet
              </h3>
              <p className="text-blue-700">
                Shipping stages will appear here once shipments are created
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Stages.map((stage) => (
                <PendingPaymentCard
                  key={stage.id}
                  Stage={stage}
                  onViewDocument={handleViewDocument}
                  onApprovePayment={handleApprovePayment}
                />
              ))}
            </div>
          )}

          {stageForDocument && (
            <DocumentModal
              onClose={() => setStageForDocument(null)}
              document={getDocumentToDisplay()}
              title={
             
             `Payment Receipt ${selectedReceiptIndex + 1}`
             }
              stageName={stageForDocument.title}
            />
          )}

          {stageForPayment && (
            <PaymentApprovalModal
              onClose={() => setStageForPayment(null)}
              Stage={stageForPayment}
            />
          )}
        </div>
      </div>
    </>
  );
}
