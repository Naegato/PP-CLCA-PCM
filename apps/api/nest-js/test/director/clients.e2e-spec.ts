import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('Director Clients (e2e)', () => {
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

  describe('GET /director/clients', () => {
    it('should get all clients', () => {
      return request(app.getHttpServer())
        .get('/director/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('GET /director/clients/:id/accounts', () => {
    it('should get client accounts', () => {
      const clientId = 'test-client-id';
      return request(app.getHttpServer())
        .get(`/director/clients/${clientId}/accounts`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('POST /director/clients', () => {
    it('should create a client', () => {
      return request(app.getHttpServer())
        .post('/director/clients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstname: 'John',
          lastname: 'Client',
          email: 'johnclient@test.com',
          password: 'password123',
        })
        .expect(201);
    });
  });

  describe('PATCH /director/clients/:id', () => {
    it('should update a client', () => {
      const clientId = 'test-client-id';
      return request(app.getHttpServer())
        .patch(`/director/clients/${clientId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstname: 'John Updated',
          lastname: 'Client Updated',
          email: 'johnupdated@test.com',
        })
        .expect(200);
    });
  });

  describe('DELETE /director/clients/:id', () => {
    it('should delete a client', () => {
      const clientId = 'test-client-id';
      return request(app.getHttpServer())
        .delete(`/director/clients/${clientId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });
  });

  describe('POST /director/clients/:id/ban', () => {
    it('should ban a client', () => {
      const clientId = 'test-client-id';
      return request(app.getHttpServer())
        .post(`/director/clients/${clientId}/ban`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          reason: 'Violation of terms',
          endDate: '2026-12-31',
        })
        .expect(200);
    });
  });
});
