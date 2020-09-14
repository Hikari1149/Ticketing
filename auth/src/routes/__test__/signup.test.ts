import request from 'supertest';

import { app } from '../../app';

it(`returns a 201 on successful signu`, async () => {
  return request(app)
    .post(`/api/users/signup`)
    .send({
      email: `t2@qq.com`,
      password: 'password',
    })
    .expect(201);
});

it(`returns a 400 with an invalid email`, async () => {
  return request(app)
    .post(`/api/users/signup`)
    .send({
      email: `t123123123c`,
      password: 'password',
    })
    .expect(400);
});

it(`returns a 400 with an invalid password`, async () => {
  return request(app)
    .post(`/api/users/signup`)
    .send({
      email: `t123123123c`,
      password: 'a',
    })
    .expect(400);
});

it(`returns a 400 with missing email and password`, async () => {
  await request(app)
    .post(`/api/users/signup`)
    .send({ email: '123@q.com' })
    .expect(400);
  await request(app)
    .post(`/api/users/signup`)
    .send({ password: '1231244' })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
