import request from 'supertest';

import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@hitickets/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe');

it(`return a 404 when purchasing an order that does not exist`, async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: `12afwaef3`,
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it(`return a 401 when purchasing an order that doesnt belong to the user`, async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 20,
    version: 0,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: `12afwaef3`,
      orderId: order.id,
    })
    .expect(401);
});

it(`return a 400 when purchasing a cancelled order`, async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    status: OrderStatus.Cancelled,
    price: 20,
    version: 0,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', userId)
    .send({
      token: `12afwaef3`,
      orderId: order.id,
    })
    .expect(400);
});

it(`return a 201 with valid inputs`, async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    status: OrderStatus.Cancelled,
    price,
    version: 0,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', userId)
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.currency).toEqual('usd');

  // const stripeCharges = await stripe.charges.list({ limit: 50 });
  // const stripeCharge = stripeCharges.data.find((charge) => {
  //   return charge.amount === price * 100;
  // });
  // expect(stripeCharge).toBeDefined();

  // const payment = await Payment.findOne({
  //   orderId: order.id,
  //   stripeId: stripeCharge!.id,
  // });
  // expect(payment).not.toBeNull();
});
