// import { Admin } from './Admin';
// import { ShipmentDetails } from './ShipmentDetails';
// import { ShipmentStatus } from './ShipmentStatus';
// import { ShipmentWallet } from './ShipmentWallet';

// export function applyAssociations() {
//   // Admin → ShipmentDetails
//   Admin.hasMany(ShipmentDetails, {
//     foreignKey: 'adminId',
//     as: 'shipmentDetails',
//   });
// //   ShipmentDetails.belongsTo(Admin, {
// //     foreignKey: 'adminId',
// //     as: 'creator',
// //   });

//   // ShipmentDetails → ShipmentStatus
//   ShipmentDetails.hasMany(ShipmentStatus, {
//     foreignKey: 'shipmentDetailsId',
//     as: 'statusHistory',
//   });
// //   ShipmentStatus.belongsTo(ShipmentDetails, {
// //     foreignKey: 'shipmentDetailsId',
// //     as: 'status',
// //   });

//   // Admin → ShipmentWallet
//   Admin.hasMany(ShipmentWallet, {
//     foreignKey: 'adminId',
//     as: 'wallets',
//   });
// //   ShipmentWallet.belongsTo(Admin, {
// //     foreignKey: 'adminId',
// //     as: 'owner',
// //   });
// }


// // then, after you import and initialize all your models...a
// applyAssociations();

// // Optionally sync
// // sequelize.sync({ alter: true });
