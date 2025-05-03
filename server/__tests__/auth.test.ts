
import request from 'supertest';
import { app } from '../index';
import { Admin } from '../models/Admin';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

describe('Authentication Endpoints', () => {
  const testAdmin = {
    name: 'Test Admin',
    email: 'test@example.com',
    password: 'Test123456!'
  };

  const jwtSecret = process.env.JWT_SECRET || 'test-secret';

  beforeEach(async () => {
    await Admin.destroy({ where: {} });
  });

  const createVerifiedAdmin = async () => {
    const hashedPassword = await bcrypt.hash(testAdmin.password, 10);
    return Admin.create({
      ...testAdmin,
      password: hashedPassword,
      isVerified: true
    });
  };

  const createUnverifiedAdmin = async (verificationCode = '123456') => {
    const admin = await Admin.create({
      ...testAdmin,
      password: await bcrypt.hash(testAdmin.password, 10),
      isVerified: false,
      verificationCode
    });

    const verificationToken = jwt.sign(
      { adminId: admin.id, code: verificationCode },
      jwtSecret,
      { expiresIn: '1h' }
    );

    admin.verificationToken = verificationToken;
    await admin.save();
    
    return { admin, verificationToken };
  };

  describe('POST /api/admin/signup', () => {
    it('should create a new admin and return verification token', async () => {
      const response = await request(app)
        .post('/api/admin/signup')
        .send(testAdmin)
        .expect(201);

      expect(response.body.verificationToken).toBeDefined();
    });

    it('should return error for existing email', async () => {
      await createVerifiedAdmin();

      const response = await request(app)
        .post('/api/admin/signup')
        .send(testAdmin)
        .expect(400);

      expect(response.body.message).toBe('Admin with this email already exists');
    });
  });

  describe('POST /api/admin/verify-email', () => {
    it('should verify admin email with correct code', async () => {
      const { verificationToken } = await createUnverifiedAdmin();

      const response = await request(app)
        .post('/api/admin/verify-email')
        .send({ code: '123456', verificationToken })
        .expect(200);

      expect(response.body.loginToken).toBeDefined();
    });

    it('should return error for wrong verification code', async () => {
      const { verificationToken } = await createUnverifiedAdmin();

      const response = await request(app)
        .post('/api/admin/verify-email')
        .send({ code: '654321', verificationToken })
        .expect(400);

      expect(response.body.message).toBe('Wrong verification code');
    });
  });

  describe('POST /api/admin/login', () => {
    it('should login verified admin and return token', async () => {
      await createVerifiedAdmin();

      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: testAdmin.email,
          password: testAdmin.password
        })
        .expect(200);

      expect(response.body.loginToken).toBeDefined();
    });

    it('should return error for unverified admin', async () => {
      await createUnverifiedAdmin();

      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: testAdmin.email,
          password: testAdmin.password
        })
        .expect(409);

      expect(response.body.message).toBe('Email not verified');
      expect(response.body.verificationToken).toBeDefined();
    });
  });
});
