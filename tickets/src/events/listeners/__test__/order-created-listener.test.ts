import { natsWrapper } from '../../../nats-wrapper';
import { OrderCretaedListener } from '../order-created-listener';
import { Ticket } from '../../../models/ticket';
import { OrderCreatedEvent, OrderStatus } from '@hitickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCretaedListener(natsWrapper.client);

  // Create an savev a ticket

  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'aweraw',
  });
  await ticket.save();

  // Create the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: '123123',
    expiresAt: `aweraw`,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { data, msg, listener, ticket };
};

it(`sets the userId of the ticket`, async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});