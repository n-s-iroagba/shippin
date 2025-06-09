"use client";
import { useState } from "react";
import { DocumentModal } from "@/components/DocumentModal";
import { PaymentApprovalModal } from "@/components/PaymentApprovalModal";
import { Spinner } from "@/components/Spinner";
import ErrorAlert from "@/components/ErrorAlert";
import { TruckIcon } from "@heroicons/react/24/outline";
import { useGetList } from "@/hooks/useGet";
import { ShippingStage } from "@/types/shipment.types";
import PendingPaymentCard from "@/components/PendingPaymentCard";
import { routes } from "@/data/routes";
import { useAuth } from "@/hooks/useAuth";

export default function ShippingStageCrudPage() {
  const {id} = useAuth()
  const {
    data: shippingStages,
    loading,
    error,
  } = useGetList<ShippingStage>(routes.stage.unapprovedPayments(id));
  const [stageForDocument, setStageForDocument] =
    useState<ShippingStage | null>(null);
  const [stageForPayment, setStageForPayment] = useState<ShippingStage | null>(
    null
  );
  const [documentType, setDocumentType] = useState<
    "supportingDocument" | "paymentReceipt"
  >("supportingDocument");

  if (loading) {
    return <Spinner className="w-10 h-10 text-blue-600" />;
  }

  if (error) {
    return <ErrorAlert message={error || "Failed to load shipping stages"} />;
  }

  const handleViewDocument = (
    stage: ShippingStage,
    type: "supportingDocument" | "paymentReceipt"
  ) => {
    setStageForDocument(stage);
    setDocumentType(type);
  };

  const handleApprovePayment = (stage: ShippingStage) => {
    setStageForPayment(stage);
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

          {!shippingStages || shippingStages.length === 0 ? (
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
              {shippingStages.map((stage) => (
                <PendingPaymentCard
                  key={stage.id}
                  shippingStage={stage}
                  onViewDocument={handleViewDocument}
                  onApprovePayment={handleApprovePayment}
                />
              ))}
            </div>
          )}

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

          {stageForPayment && (
            <PaymentApprovalModal
              onClose={() => setStageForPayment(null)}
              shippingStage={stageForPayment}
            />
          )}
        </div>
      </div>
    </>
  );
}
