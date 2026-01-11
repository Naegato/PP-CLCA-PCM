import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('Advisor Loans (e2e)', () => {
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

  describe('GET /advisor/loans/pending', () => {
    it('should get pending loan requests', () => {
      return request(app.getHttpServer())
        .get('/advisor/loans/pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('POST /advisor/loans/:id/grant', () => {
    it('should grant a loan request', () => {
      const loanId = 'test-loan-id';
      return request(app.getHttpServer())
        .post(`/advisor/loans/${loanId}/grant`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('POST /advisor/loans/:id/reject', () => {
    it('should reject a loan request', () => {
      const loanId = 'test-loan-id';
      return request(app.getHttpServer())
        .post(`/advisor/loans/${loanId}/reject`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });
});
