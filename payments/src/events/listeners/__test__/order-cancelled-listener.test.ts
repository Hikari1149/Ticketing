import { OrderCanelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import {
  OrderCreatedEvent,
  OrderStatus,
  OrderCancelledEvent,
} from '@hitickets/common';

import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import mongoose from 'mongoose';
const setup = async () => {
  const listener = new OrderCanelledListener(natsWrapper.client);

  const order = Order.build({
    status: OrderStatus.Created,
    id: mongoose.Types.ObjectId().toHexString(),
    price: 10,
    userId: '123',
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: '123',
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn,
  };
  return {
    listener,
    data,
    msg,
    order,
  };
};

it('updates the status of the order', async () => {
  const { listener, order, msg, data } = await setup();
  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
it('acks the message', async () => {
  const { listener, order, msg, data } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
