import request from 'supertest';
import { app } from '../../app';

it('has a route handler to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: '123', price: 23 });

  expect(response.status).toEqual(201);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);
});
it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '123',
      price: -10,
    })
    .expect(400);
});
it('create a ticket with valid inputs', async () => {
  // add in a check to make sure a ticket was saved
  await request(app)
    .post('/api/tickets')
    .send({
      title: '123aaw',
      price: 20,
    })
    .expect(201);
});
