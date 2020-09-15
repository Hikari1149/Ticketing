import request from 'supertest';

import { app } from '../../app';

it('responds with ddetails about the current user', async () => {
  const cookie = await global.signin();
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(response.body.currentuser.email).toEqual('test@test.com');
});

it(`responds with nnull if not authenticated`, async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(401);

  expect(response.body.currentuser).toEqual(undefined);
});