'use client'
import { useEffect, useState } from "react";
import { DeleteShipmentModal, EditShipmentModal } from "@/components/ShipmentModals";
import EditShipmentStatusModal, { AddShipmentStatusModal, DeleteShipmentStatusModal } from "@/components/ShipmentStatusModal";
import { useParams } from "next/navigation";
import { ShipmentStatus } from "@/app/types/ShipmentStatus";
import { Shipment } from "@/app/types/Shipment";
import { shipmentUrl } from "@/data/urls";
import Loading from "@/components/Loading";


const AdminShipmentDetails = ()=>{
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [shipmentDetails, setShipmentDetails] = useState<Shipment | null>(null);
    const [selectedShipmentStatus, setSelectedShipmentStatus] = useState <ShipmentStatus|null>(null)
    const [showEditShipmentStatusModal, setShowEditShipmentStatusModal] = useState(false)
    const [showDeleteShipmentStatusModal, setShowDeleteShipmentStatusModal] = useState(false)
    const [showAddShipmentStatusModal, setShowAddShipmentStatusModal] = useState(false)
    const params = useParams();
    const shipmentId = params.id;;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

useEffect(() => {
      if (!shipmentId) {
        return;
}

const fetchShipmentDetails = async () => {
  try {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('admin_token');
const response = await fetch(`${shipmentUrl}/${shipmentId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Failed to fetch shipment details";
        throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("Fetched Shipment Details:", data); 

    setShipmentDetails(data);
  } catch (error) {
    setError("An error occurred, try again later");
    console.error("Fetch Error:", error);
  } finally {
    setLoading(false);
  }
};  
      fetchShipmentDetails();
    }, [shipmentId]);

  // get the shipmentDetails.id from the url and write a useEffect hook to query the server and fetch the user details based off the
  if (loading) return <Loading/>
  if (error) return <div>Error: {error}</div>;
  if (!shipmentDetails) return <div>No shipment found</div>;


    return(
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
          <strong>Sending Port:</strong> {shipmentDetails.sendingAddress}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Delivery Address:</strong> {shipmentDetails.receivingAddress}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Recipient:</strong> {shipmentDetails.recipientName}
        </p>
        <p className="rounded border-b-4 border-goldenrod p-2">
          <strong>Description:</strong> {shipmentDetails.shipmentDescription}
        </p>

        <div className="flex justify-evenly">
        <div className="my-2 ">
        <button onClick={() => {
          setShowEditModal(true);

        }} className="bg-blue-500 text-white p-1 rounded">Edit Shipment</button>
      </div>
      <div className="my-2">
        <button onClick={() =>{
          setShowDeleteModal(true);
        }} className="bg-red-500 text-white p-1 rounded">Delete Shipment</button>
      </div>
      </div>
      <p className="rounded border-b-4 border-goldenrod p-2"></p>
      <h2 className="text-md font-semibold text-center">Shipment ShipmentStatus</h2>

      <div className="flex justify-center">
      <button onClick={() => {
        setShowAddShipmentStatusModal(true)
      }} className="text-white p-1 rounded bg-goldenrod">Add ShipmentStatus</button>
        </div>
      <ul>

        {shipmentDetails?.shipmentStatus?.map((step:ShipmentStatus) => (
          <>
          <li key={step.id} className="flex justify-evenly border-b p-1">

          <div className="flex flex-col w-[60%] justify-between ">
            <h4 className="text-center font-bold">Status: </h4>
            <span className="min-h-[40px] break-words whitespace-normal text-black text-center">{step.status}</span>
            <div className="flex justify-center">
            <button onClick={() => {
                setShowEditShipmentStatusModal(true);
                setSelectedShipmentStatus(step);
              }} className="bg-yellow-500 w-[10rem] text-white p-1 mx-2">Edit</button>
            </div>
            </div>


          <div className="flex flex-col justify-start">
            <h4 className="text-center font-bold">Processed Status: </h4>
            <span className="min-h-[40px] break-words whitespace-normal text-black text-center" >{step.shipmentStatus}</span>
            <div className="flex justify-center gap-2">
              {step.requiresPayment && step.shipmentStatus === 'Payment Needed' && (
                <>
                  <button onClick={async () => {
                    const res = await fetch(`/api/shipmentStatus/${step.id}/approve`, {
                      method: 'POST',
                      headers: { 
                        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
                        'Content-Type': 'application/json'
                      }
                    });
                    if (res.ok) {
                      alert('Payment approved');
                      window.location.reload();
                    }
                  }} className="bg-green-500 text-white p-1">
                    Approve
                  </button>
                  <button onClick={async () => {
                    const reason = prompt('Enter rejection reason:');
                    if (!reason) return;
                    
                    const res = await fetch(`/api/shipmentStatus/${step.id}/reject`, {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({ rejectionReason: reason })
                    });
                    if (res.ok) {
                      alert('Payment rejected');
                      window.location.reload();
                    }
                  }} className="bg-red-500 text-white p-1">
                    Reject
                  </button>
                </>
              )}
              <button onClick={() => {
                setShowDeleteShipmentStatusModal(true);
                setSelectedShipmentStatus(step);
              }} className="bg-red-500 text-white p-1">Delete</button>
            </div>
            </div>







          </li>

        </>
        ))}
      </ul>
    </div>
    {showEditModal &&  <EditShipmentModal shipment={shipmentDetails} onClose={() => setShowEditModal(false)}  />}
    {showDeleteModal && <DeleteShipmentModal shipment={shipmentDetails}  onClose={() => setShowDeleteModal(false)}  />}
    {showAddShipmentStatusModal && <AddShipmentStatusModal onClose={() => setShowAddShipmentStatusModal(false)} shipmentId={Number(shipmentDetails.id)} />}
    {showEditShipmentStatusModal && selectedShipmentStatus && <EditShipmentStatusModal step={selectedShipmentStatus} onClose={()=>setShowEditShipmentStatusModal(false)} />}
    {showDeleteShipmentStatusModal && selectedShipmentStatus && <DeleteShipmentStatusModal step={selectedShipmentStatus}  onClose={()=>setShowDeleteShipmentStatusModal(false)} />}

    </div>
    )
}
export default AdminShipmentDetails