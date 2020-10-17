import 'express-async-errors';
import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompletedListener } from './events/listeners/expiration-completed-listener';
// start
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JTW_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI mus be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID mus be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID mus be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL mus be defined');
  }
  try {
    // nats
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGNIT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    // listener
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompletedListener(natsWrapper.client).listen();
    //db
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to mongodb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
