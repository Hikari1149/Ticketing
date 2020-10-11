import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedEvent } from '@hitickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create a fake data event

  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: 'concert',
    userId: mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    data,
    msg,
  };
};

it(`creates and saves a ticket`, async () => {
  // call the onMessage function with the data object + message object
  const { listener, msg, data } = await setup();
  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);

  // write assertions to make sure a ticket was created.
});

it(`acks the message`, async () => {
  // call the onMessage function with the data object + message object
  const { data, listener, msg } = await setup();
  await listener.onMessage(data, msg);
  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
