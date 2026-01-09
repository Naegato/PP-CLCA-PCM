import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('Advisor Messages (e2e)', () => {
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

  describe('POST /advisor/discussions/:id/reply', () => {
    it('should reply to a discussion', () => {
      const discussionId = 'test-discussion-id';
      return request(app.getHttpServer())
        .post(`/advisor/discussions/${discussionId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          text: 'Test reply',
        })
        .expect(201);
    });
  });

  describe('POST /advisor/discussions/:id/close', () => {
    it('should close a discussion', () => {
      const discussionId = 'test-discussion-id';
      return request(app.getHttpServer())
        .post(`/advisor/discussions/${discussionId}/close`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('POST /advisor/discussions/:id/transfer', () => {
    it('should transfer a discussion to another advisor', () => {
      const discussionId = 'test-discussion-id';
      return request(app.getHttpServer())
        .post(`/advisor/discussions/${discussionId}/transfer`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          newAdvisorId: 'new-advisor-id',
        })
        .expect(200);
    });
  });
});
