"use client";

import { useEffect, useState } from "react";
import { DeleteShipmentModal, EditShipmentModal } from "@/components/ShipmentModals";

import { useParams } from "next/navigation";

import Loading from "@/components/Loading";
import { ShipmentDetails, ShippingStage } from "@/types/shipment.types";
import { protectedApi } from "@/utils/apiUtils";
import { routes } from "@/data/constants";
import EditShippingStageModal, { AddShippingStageModal, DeleteShippingStageModal } from "@/components/ShipmentStageModal";



const AdminShipmentDetails = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [shipmentDetails, setShipmentDetails] = useState<ShipmentDetails | null>(null);
    const [shippingStagees, setShippingStagees] = useState<ShippingStage[]>([]);
    const [selectedShippingStage, setSelectedShippingStage] = useState<ShippingStage | null>(null);
    const [showEditShippingStageModal, setShowEditShippingStageModal] = useState(false);
    const [showDeleteShippingStageModal, setShowDeleteShippingStageModal] = useState(false);
    const [showAddShippingStageModal, setShowAddShippingStageModal] = useState(false);
    const params = useParams();
    const shipmentId = params.id;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!shipmentId) return;

        const fetchShipmentDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const result = await protectedApi.get<{ shipment: ShipmentDetails, statuses: ShippingStage[] }>(routes.shipment.details(shipmentId as string));
                console.log(result);
                setShipmentDetails(result.shipment)
                setShippingStagees(result.statuses)

            } catch (error) {
                setError("An error occurred, try again later");
                console.error("Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShipmentDetails();
    }, [shipmentId]);


    if (loading) return <Loading />;
    if (error) return <div>Error: {error}</div>;
    if (!shipmentDetails) return <div>No shipment found</div>;

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
                    <strong>Expected Time Of Arrival:</strong> {'nothing yet'}
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
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="bg-blue-500 text-white p-1 rounded"
                        >
                            Edit Shipment
                        </button>
                    </div>
                    <div className="my-2">
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="bg-red-500 text-white p-1 rounded"
                        >
                            Delete Shipment
                        </button>
                    </div>
                </div>

                <p className="rounded border-b-4 border-goldenrod p-2"></p>
                <h2 className="text-md font-semibold text-center">Shipment Status</h2>

                <div className="flex justify-center">
                    <button
                        onClick={() => setShowAddShippingStageModal(true)}
                        className="text-black bg-blue p-1 rounded bg-goldenrod"
                    >
                        Add Shipment Status
                    </button>
                </div>

                <ul>
                    {shippingStagees.map((step: ShippingStage) => (
                        <li key={step.id} className="flex justify-evenly border-b p-1">
                            <div className="flex flex-col w-[60%] justify-between">
                                <h4 className="text-center font-bold">Status:</h4>
                                <div className="min-h-[40px] break-words whitespace-normal text-black text-center">
                                    {step.title}
                                </div>
                                <div className="min-h-[40px] break-words whitespace-normal text-black text-center">
                                    {step.carrierNote}
                                </div>
                                <div className="min-h-[40px] break-words whitespace-normal text-black text-center">
                                    {step.dateAndTime}
                                </div>
                                <div className="min-h-[40px] break-words whitespace-normal text-black text-center">
                                    {step.paymentStatus}
                                </div>
                                <div className="min-h-[40px] break-words whitespace-normal text-black text-center">
                                    {step.feeInDollars}
                                </div>
                                <div className="min-h-[40px] break-words whitespace-normal text-black text-center">
                                    {step.paymentDate}
                                </div>
                                <div className="min-h-[40px] break-words whitespace-normal text-black text-center">
                                    {step.percentageNote}
                                </div>
                                <button>
                                    view supporting document
                                </button>
                                <button>
                                    view payment reciept
                                </button>
                                <button>
                                    Approve payment
                                </button>

                                <div className="flex justify-center">
                                    <button
                                        onClick={() => {
                                            setShowEditShippingStageModal(true);
                                            setSelectedShippingStage(step);
                                        }}
                                        className="bg-yellow-500 w-[10rem] text-white p-1 mx-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDeleteShippingStageModal(true);
                                            setSelectedShippingStage(step);
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

            {showAddShippingStageModal && <AddShippingStageModal onClose={() => setShowAddShippingStageModal(false)} shipmentId={shipmentDetails.id} />}
            {showEditModal && <EditShipmentModal shipment={shipmentDetails} onClose={() => setShowEditModal(false)} onUpdate={() => setShowEditShippingStageModal(false)} />}
            {showDeleteModal && <DeleteShipmentModal shipment={shipmentDetails} onDelete={() => setShowDeleteModal(false)} />}

            {showEditShippingStageModal && selectedShippingStage && (
                <EditShippingStageModal status={selectedShippingStage} onClose={() => setShowEditShippingStageModal(false)} />
            )}
            {showDeleteShippingStageModal && selectedShippingStage && (
                <DeleteShippingStageModal onDeleted={() => setShowDeleteShippingStageModal(false)} statusId={selectedShippingStage.id} />
            )}
        </div>
    );
};

export default AdminShipmentDetails;