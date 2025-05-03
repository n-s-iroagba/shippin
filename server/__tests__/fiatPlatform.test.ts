
import request from 'supertest';
import { app } from '../index';
import { Admin } from '../models/Admin';
import { FiatPlatform } from '../models/FiatPlatform';
import jwt from 'jsonwebtoken';

describe('Fiat Platform Management Endpoints', () => {
  let adminToken: string;
  let testAdmin: any;
  let testPlatform: any;

  const platformData = {
    name: 'Test Platform',
    baseUrl: 'https://test.com',
    messageTemplate: 'Test payment {amount} for {statusId}'
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
    await FiatPlatform.destroy({ where: {} });
    
    testPlatform = await FiatPlatform.create({
      ...platformData,
      adminId: testAdmin.id
    });
  });

  afterAll(async () => {
    await FiatPlatform.destroy({ where: {} });
    await Admin.destroy({ where: {} });
  });

  describe('GET /api/admin/fiat-platforms', () => {
    it('should list all platforms for admin', async () => {
      const response = await request(app)
        .get('/api/admin/fiat-platforms')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('name', platformData.name);
      expect(response.body[0].adminId).toBe(testAdmin.id);
    });
  });

  describe('POST /api/admin/fiat-platforms', () => {
    it('should create a new platform', async () => {
      const newPlatform = {
        name: 'New Platform',
        baseUrl: 'https://new.com',
        messageTemplate: 'New payment {amount} for {statusId}'
      };

      const response = await request(app)
        .post('/api/admin/fiat-platforms')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newPlatform)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newPlatform.name);
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/admin/fiat-platforms')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body.message).toBe('Invalid input');
    });
  });

  describe('PUT /api/admin/fiat-platforms/:id', () => {
    it('should update platform details', async () => {
      const updates = {
        name: 'Updated Platform',
        baseUrl: 'https://updated.com'
      };

      const response = await request(app)
        .put(`/api/admin/fiat-platforms/${testPlatform.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.name).toBe(updates.name);
      expect(response.body.baseUrl).toBe(updates.baseUrl);
    });

    it('should return 404 for non-existent platform', async () => {
      const response = await request(app)
        .put('/api/admin/fiat-platforms/999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated' })
        .expect(404);

      expect(response.body.message).toBe('Fiat platform not found');
    });
  });

  describe('DELETE /api/admin/fiat-platforms/:id', () => {
    it('should delete platform', async () => {
      await request(app)
        .delete(`/api/admin/fiat-platforms/${testPlatform.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const deletedPlatform = await FiatPlatform.findByPk(testPlatform.id);
      expect(deletedPlatform).toBeNull();
    });

    it('should return 403 for unauthorized deletion', async () => {
      const otherAdmin = await Admin.create({
        name: 'Other Admin',
        email: 'other@admin.com',
        password: 'hashedPassword',
        isVerified: true
      });

      const otherToken = jwt.sign(
        { id: otherAdmin.id },
        process.env.JWT_SECRET || 'test-secret'
      );

      const response = await request(app)
        .delete(`/api/admin/fiat-platforms/${testPlatform.id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403);

      expect(response.body.message).toBe('Not authorized');
    });
  });
});
