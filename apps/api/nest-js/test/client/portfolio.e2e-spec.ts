import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('Client Portfolio (e2e)', () => {
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

  describe('POST /client/portfolio', () => {
    it('should create a portfolio for an account', () => {
      return request(app.getHttpServer())
        .post('/client/portfolio')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          accountId: 'test-account-id',
        })
        .expect(201);
    });
  });

  describe('GET /client/portfolio/:accountId', () => {
    it('should get portfolio for an account', () => {
      const accountId = 'test-account-id';
      return request(app.getHttpServer())
        .get(`/client/portfolio/${accountId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });
});
