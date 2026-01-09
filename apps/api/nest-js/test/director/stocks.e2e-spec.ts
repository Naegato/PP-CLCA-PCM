import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('Director Stocks (e2e)', () => {
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

  describe('POST /director/stocks', () => {
    it('should create a stock', () => {
      return request(app.getHttpServer())
        .post('/director/stocks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          symbol: 'AAPL',
          name: 'Apple Inc.',
          companyId: 'test-company-id',
        })
        .expect(201);
    });
  });

  describe('PATCH /director/stocks/:id', () => {
    it('should update a stock', () => {
      const stockId = 'test-stock-id';
      return request(app.getHttpServer())
        .patch(`/director/stocks/${stockId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Apple Inc. Updated',
          symbol: 'AAPL',
          isListed: true,
          companyId: 'test-company-id',
        })
        .expect(200);
    });
  });

  describe('DELETE /director/stocks/:id', () => {
    it('should delete a stock', () => {
      const stockId = 'test-stock-id';
      return request(app.getHttpServer())
        .delete(`/director/stocks/${stockId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });
  });

  describe('POST /director/stocks/:id/toggle-listing', () => {
    it('should toggle stock listing', () => {
      const stockId = 'test-stock-id';
      return request(app.getHttpServer())
        .post(`/director/stocks/${stockId}/toggle-listing`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });
});
