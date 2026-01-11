import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('Client Auth (e2e)', () => {
  let app: INestApplication<App>;
  let authToken: string;

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

  // describe('POST /client/auth/login', () => {
  //   it('should login a client', () => {
  //     return request(app.getHttpServer())
  //       .post('/client/auth/login')
  //       .send({
  //         email: 'client@test.com',
  //         password: 'password123',
  //       })
  //       .expect(200);
  //   });
  // });

  describe('POST /client/auth/register', () => {
    it('should register a new client', () => {
      return request(app.getHttpServer())
        .post('/client/auth/register')
        .send({
          firstname: 'Jane',
          lastname: 'Doe',
          email: 'newclient@test.com',
          password: 'password123',
        })
        .expect(201);
    });
  });

  // describe('POST /client/auth/logout', () => {
  //   it('should logout a client', () => {
  //     return request(app.getHttpServer())
  //       .post('/client/auth/logout')
  //       .set('Authorization', `Bearer ${authToken}`)
  //       .expect(200);
  //   });
  // });
  //
  // describe('POST /client/auth/password-reset/request', () => {
  //   it('should request password reset', () => {
  //     return request(app.getHttpServer())
  //       .post('/client/auth/password-reset/request')
  //       .send({
  //         email: 'client@test.com',
  //       })
  //       .expect(200);
  //   });
  // });
  //
  // describe('POST /client/auth/password-reset/confirm', () => {
  //   it('should confirm password reset', () => {
  //     return request(app.getHttpServer())
  //       .post('/client/auth/password-reset/confirm')
  //       .send({
  //         token: 'reset-token',
  //         newPassword: 'newpassword123',
  //       })
  //       .expect(200);
  //   });
  // });
});
