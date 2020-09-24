import request from 'supertest';

import { app } from '../../app';
import mongoose from 'mongoose';
it('return a 404 if the provided id dose not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: '123',
      price: 123,
    })
    .expect(404);
});

it('return a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: '123',
      price: 123,
    })
    .expect(401);
});

it('return 401 if the user does not own the ticket', async () => {});

it('return a 400 if the user provides an invalid title or price', async () => {});

it('', async () => {});

it('', async () => {});
