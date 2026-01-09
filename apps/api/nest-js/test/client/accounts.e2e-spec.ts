import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('Client Accounts (e2e)', () => {
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

  describe('POST /client/accounts', () => {
    it('should create a normal account', () => {
      return request(app.getHttpServer())
        .post('/client/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'My Checking Account',
        })
        .expect(201);
    });
  });

  describe('POST /client/accounts/savings', () => {
    it('should create a savings account', () => {
      return request(app.getHttpServer())
        .post('/client/accounts/savings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'My Savings Account',
        })
        .expect(201);
    });
  });

  describe('GET /client/accounts/:id', () => {
    it('should get an account by id', () => {
      const accountId = 'test-account-id';
      return request(app.getHttpServer())
        .get(`/client/accounts/${accountId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('GET /client/accounts/:id/balance', () => {
    it('should get account balance', () => {
      const accountId = 'test-account-id';
      return request(app.getHttpServer())
        .get(`/client/accounts/${accountId}/balance`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('PATCH /client/accounts/:id', () => {
    it('should update account name', () => {
      const accountId = 'test-account-id';
      return request(app.getHttpServer())
        .patch(`/client/accounts/${accountId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Account Name',
        })
        .expect(200);
    });
  });

  describe('DELETE /client/accounts/:id', () => {
    it('should delete an account', () => {
      const accountId = 'test-account-id';
      return request(app.getHttpServer())
        .delete(`/client/accounts/${accountId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });
  });
});
