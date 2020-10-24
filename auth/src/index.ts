import 'express-async-errors';
import mongoose from 'mongoose';
import { app } from './app';

// db
const start = async () => {
  console.log('start up...');
  if (!process.env.JWT_KEY) {
    throw new Error('JTW_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required.');
  }
  try {
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
