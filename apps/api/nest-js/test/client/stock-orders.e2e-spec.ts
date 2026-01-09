import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('Client Stock Orders (e2e)', () => {
  let app: INestApplication<App>;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login to get auth token
    // TODO: Implement login to get valid token
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /client/stock-orders', () => {
    it('should get all client stock orders', () => {
      return request(app.getHttpServer())
        .get('/client/stock-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('POST /client/stock-orders', () => {
    it('should create a buy order', () => {
      return request(app.getHttpServer())
        .post('/client/stock-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          accountId: 'test-account-id',
          stockId: 'test-stock-id',
          side: 'BUY',
          price: 100,
          quantity: 10,
        })
        .expect(201);
    });

    it('should create a sell order', () => {
      return request(app.getHttpServer())
        .post('/client/stock-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          accountId: 'test-account-id',
          stockId: 'test-stock-id',
          side: 'SELL',
          price: 105,
          quantity: 5,
        })
        .expect(201);
    });
  });

  describe('POST /client/stock-orders/:id/match', () => {
    it('should match a stock order', () => {
      const orderId = 'test-order-id';
      return request(app.getHttpServer())
        .post(`/client/stock-orders/${orderId}/match`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('DELETE /client/stock-orders/:id', () => {
    it('should cancel a stock order', () => {
      const orderId = 'test-order-id';
      return request(app.getHttpServer())
        .delete(`/client/stock-orders/${orderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });
  });
});
