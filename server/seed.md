
import { ShipmentDetails } from "./models/ShipmentDetails";
import { ShipmentStatus } from "./models/ShipmentStatus";
import { User } from "./models/User";


export async function seedDatabase() {
  try {
   
    // Create an Admin User
    const admin = await User.create({
      name: "John Doe",
      email: "admin@example.com",
      password: "hashedpassword",
      isVerified: true,
    });

    console.log("✅ Admin User Created:", admin.toJSON());

    // Create a Shipment under the Admin
    const shipment = await ShipmentDetails.create({
      shipmentID: "SHIP-001",
      senderName: "Alice",
      sendingAddress: "123 Sender St, City A",
      receivingAddress: "456 Receiver Ave, City B",
      recipientName: "Bob",
      shipmentDescription: "Electronics",
      adminId: admin.id,
    });

    console.log("✅ Shipment Created:", shipment.toJSON());

   await ShipmentStatus.create({
       status:'Request to ship',
       shipmentStatus:'Processed',
       date: new Date(),
       shipmentDetailsId:shipment.id
     })
     await ShipmentStatus.create({
       status:'Onboarding',
       shipmentStatus:'Processed',
       date:new Date (),
       shipmentDetailsId:shipment.id
 
     })
     await ShipmentStatus.create({
       status:'Onboarded',
       date:new Date (),
       shipmentStatus:'In transit',
       shipmentDetailsId:shipment.id
 
     })


    console.log("✅ Seeding Completed!");
  } catch (error) {
    console.error("❌ Seeding Error:", error);
  }
}

