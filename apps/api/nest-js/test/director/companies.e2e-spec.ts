import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('Director Companies (e2e)', () => {
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

  describe('GET /director/companies', () => {
    it('should get all companies', () => {
      return request(app.getHttpServer())
        .get('/director/companies')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('GET /director/companies/:id', () => {
    it('should get a company by id', () => {
      const companyId = 'test-company-id';
      return request(app.getHttpServer())
        .get(`/director/companies/${companyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('POST /director/companies', () => {
    it('should create a company', () => {
      return request(app.getHttpServer())
        .post('/director/companies')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Company Inc.',
        })
        .expect(201);
    });
  });

  describe('PATCH /director/companies/:id', () => {
    it('should update a company', () => {
      const companyId = 'test-company-id';
      return request(app.getHttpServer())
        .patch(`/director/companies/${companyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Company Inc. Updated',
        })
        .expect(200);
    });
  });

  describe('DELETE /director/companies/:id', () => {
    it('should delete a company', () => {
      const companyId = 'test-company-id';
      return request(app.getHttpServer())
        .delete(`/director/companies/${companyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);
    });
  });
});
