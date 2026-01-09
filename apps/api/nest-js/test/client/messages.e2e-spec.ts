import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';

describe('Client Messages (e2e)', () => {
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

  describe('POST /client/messages', () => {
    it('should send a message to an advisor', () => {
      return request(app.getHttpServer())
        .post('/client/messages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          text: 'Hello, I need help',
          discussionId: null,
        })
        .expect(201);
    });

    it('should send a message to an existing discussion', () => {
      return request(app.getHttpServer())
        .post('/client/messages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          text: 'Follow-up message',
          discussionId: 'existing-discussion-id',
        })
        .expect(201);
    });
  });
});
