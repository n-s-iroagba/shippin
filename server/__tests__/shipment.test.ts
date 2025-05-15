
import request from 'supertest';
import { app } from '../index';
import { Admin } from '../models/Admin';
import { ShipmentDetails } from '../models/ShipmentDetails';
import { ShippingStage } from '../models/ShippingStage';
import jwt from 'jsonwebtoken';

describe('Shipment Management Endpoints', () => {
  let adminToken: string;
  let testAdmin: any;
  let testShipment: any;

  const shipmentData = {
    shipmentID: 'SHP123456',
    senderName: 'Test Sender',
    sendingPickupPoint: 'Test Pickup',
    shippingTakeoffAddress: 'Test Takeoff',
    receivingAddress: 'Test Receiving',
    recipientName: 'Test Recipient',
    shipmentDescription: 'Test Description',
    expectedTimeOfArrival: new Date(),
    freightType: 'AIR',
    weight: 100,
    dimensionInInches: '10x10x10',
    receipientEmail: 'recipient@test.com'
  };

  beforeAll(async () => {
    // Create test admin
    testAdmin = await Admin.create({
      name: 'Test Admin',
      email: 'test@admin.com',
      password: 'hashedPassword',
      isVerified: true
    });

    adminToken = jwt.sign(
      { id: testAdmin.id },
      process.env.JWT_SECRET || 'test-secret'
    );
  });

  beforeEach(async () => {
    await ShippingStage.destroy({ where: {} });
    await ShipmentDetails.destroy({ where: {} });
    
    testShipment = await ShipmentDetails.create({
      ...shipmentData,
      adminId: testAdmin.id
    });
  });

  afterAll(async () => {
    await ShippingStage.destroy({ where: {} });
    await ShipmentDetails.destroy({ where: {} });
    await Admin.destroy({ where: {} });
  });

  describe('POST /api/admin/shipment-details', () => {
    it('should create a new shipment', async () => {
      const response = await request(app)
        .post('/api/admin/shipment-details')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(shipmentData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.senderName).toBe(shipmentData.senderName);
    });

    it('should return 400 for invalid input', async () => {
      const invalidData = { ...shipmentData, freightType: 'INVALID' };
      
      const response = await request(app)
        .post('/api/admin/shipment-details')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toBe('Invalid input');
    });
  });

  describe('GET /api/admin/shipment-details', () => {
    it('should list all shipments for admin', async () => {
      const response = await request(app)
        .get('/api/admin/shipment-details')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('shipmentID');
      expect(response.body[0].adminId).toBe(testAdmin.id);
    });
  });

  describe('GET /api/admin/shipment-details/:id', () => {
    it('should get shipment details with statuses', async () => {
      const response = await request(app)
        .get(`/api/admin/shipment-details/${testShipment.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('shipmentDetails');
      expect(response.body).toHaveProperty('shippingStagees');
    });

    it('should return 404 for non-existent shipment', async () => {
      const response = await request(app)
        .get('/api/admin/shipment-details/999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.message).toBe('Shipment not found');
    });
  });

  describe('PUT /api/admin/shipment-details/:id', () => {
    it('should update shipment details', async () => {
      const updates = {
        recipientName: 'Updated Recipient',
        receivingAddress: 'Updated Address'
      };

      const response = await request(app)
        .put(`/api/admin/shipment-details/${testShipment.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.recipientName).toBe(updates.recipientName);
      expect(response.body.receivingAddress).toBe(updates.receivingAddress);
    });
  });

  describe('DELETE /api/admin/shipment-details/:id', () => {
    it('should delete shipment and its statuses', async () => {
      await request(app)
        .delete(`/api/admin/shipment-details/${testShipment.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const deletedShipment = await ShipmentDetails.findByPk(testShipment.id);
      expect(deletedShipment).toBeNull();
    });
  });

  describe('Shipment Status Management', () => {
    let testStatus: any;

    beforeEach(async () => {
      testStatus = await ShippingStage.create({
        shipmentDetailsId: testShipment.id,
        location: 'Test Location',
        status: 'In Progress',
        description: 'Test Status',
        timestamp: new Date()
      });
    });

    it('should create shipment status', async () => {
      const statusData = {
        location: 'New Location',
        status: 'Pending',
        description: 'New Status'
      };

      const response = await request(app)
        .post(`/api/admin/shipment-details/${testShipment.id}/statuses`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(statusData)
        .expect(201);

      expect(response.body.location).toBe(statusData.location);
    });

    it('should update shipment status', async () => {
      const updates = {
        location: 'Updated Location',
        status: 'Completed'
      };

      const response = await request(app)
        .put(`/api/admin/shipment-details/${testShipment.id}/statuses/${testStatus.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.location).toBe(updates.location);
      expect(response.body.status).toBe(updates.status);
    });

    it('should delete shipment status', async () => {
      await request(app)
        .delete(`/api/admin/shipment-details/${testShipment.id}/statuses/${testStatus.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const deletedStatus = await ShippingStage.findByPk(testStatus.id);
      expect(deletedStatus).toBeNull();
    });
  });
});
