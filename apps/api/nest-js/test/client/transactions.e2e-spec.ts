import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('Client Transactions (e2e)', () => {
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

  describe('POST /client/transactions', () => {
    it('should send money between accounts', () => {
      return request(app.getHttpServer())
        .post('/client/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          senderAccountId: 'sender-account-id',
          receiverAccountId: 'receiver-account-id',
          amount: 100,
        })
        .expect(200);
    });
  });
});
