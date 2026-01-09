import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('Advisor Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /advisor/auth/login', () => {
    it('should login an advisor', () => {
      return request(app.getHttpServer())
        .post('/advisor/auth/login')
        .send({
          email: 'advisor@test.com',
          password: 'password123',
        })
        .expect(200);
    });
  });

  describe('POST /advisor/auth/register', () => {
    it('should register a new advisor', () => {
      return request(app.getHttpServer())
        .post('/advisor/auth/register')
        .send({
          firstname: 'John',
          lastname: 'Doe',
          email: 'newadvisor@test.com',
          password: 'password123',
        })
        .expect(201);
    });
  });
});
