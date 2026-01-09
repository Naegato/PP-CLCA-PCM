import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('Director Savings (e2e)', () => {
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

  describe('PATCH /director/savings/rate', () => {
    it('should change the saving rate', () => {
      return request(app.getHttpServer())
        .patch('/director/savings/rate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'savings',
          rate: 2.5,
        })
        .expect(200);
    });
  });
});
