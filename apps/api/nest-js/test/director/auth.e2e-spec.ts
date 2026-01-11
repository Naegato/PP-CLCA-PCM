import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('Director Auth (e2e)', () => {
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

  describe('POST /director/auth/login', () => {
    it('should login a director', () => {
      return request(app.getHttpServer())
        .post('/director/auth/login')
        .send({
          email: 'director@test.com',
          password: 'password123',
        })
        .expect(200);
    });
  });

  describe('POST /director/auth/register', () => {
    it('should register a new director', () => {
      return request(app.getHttpServer())
        .post('/director/auth/register')
        .send({
          firstname: 'Robert',
          lastname: 'Smith',
          email: 'newdirector@test.com',
          password: 'password123',
        })
        .expect(201);
    });
  });
});
