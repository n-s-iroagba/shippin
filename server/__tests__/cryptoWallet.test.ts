
import request from 'supertest';
import { app } from '../index';
import { CryptoWallet } from '../models/CryptoWallet';
import { Admin } from '../models/Admin';
import jwt from 'jsonwebtoken';

describe('Crypto Wallet API', () => {
  let authToken: string;
  let admin: any;

  beforeAll(async () => {
    admin = await Admin.create({
      email: 'test@example.com',
      password: 'hashedPassword',
    });
    authToken = jwt.sign({ id: admin.id }, process.env.JWT_SECRET || 'test-secret');
  });

  afterAll(async () => {
    await CryptoWallet.destroy({ where: {} });
    await Admin.destroy({ where: {} });
  });

  describe('GET /api/admin/crypto-wallets', () => {
    it('should return all crypto wallets for authenticated admin', async () => {
      const wallet = await CryptoWallet.create({
        adminId: admin.id,
        currency: 'BTC',
        walletAddress: '0x1234567890',
      });

      const response = await request(app)
        .get('/api/admin/crypto-wallets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].currency).toBe('BTC');
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/api/admin/crypto-wallets');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/admin/crypto-wallets', () => {
    it('should create a new crypto wallet', async () => {
      const response = await request(app)
        .post('/api/admin/crypto-wallets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currency: 'ETH',
          walletAddress: '0x9876543210',
        });

      expect(response.status).toBe(201);
      expect(response.body.currency).toBe('ETH');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/admin/crypto-wallets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });
});
