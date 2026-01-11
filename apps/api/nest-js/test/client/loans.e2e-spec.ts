import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('Client Loans (e2e)', () => {
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

  describe('GET /client/loans', () => {
    it('should get all client loans', () => {
      return request(app.getHttpServer())
        .get('/client/loans')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('POST /client/loans/request', () => {
    it('should request a new loan', () => {
      return request(app.getHttpServer())
        .post('/client/loans/request')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 10000,
        })
        .expect(201);
    });
  });

  describe('POST /client/loans/simulate', () => {
    it('should simulate a loan', () => {
      return request(app.getHttpServer())
        .post('/client/loans/simulate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          principal: 10000,
          interestRate: 3.5,
          durationMonths: 12,
        })
        .expect(200);
    });
  });

  describe('POST /client/loans/repay', () => {
    it('should repay a loan', () => {
      return request(app.getHttpServer())
        .post('/client/loans/repay')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          accountId: 'test-account-id',
          loanId: 'test-loan-id',
          amount: 500,
        })
        .expect(200);
    });
  });
});
