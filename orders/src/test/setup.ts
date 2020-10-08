import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Collection } from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

// mock nats client
jest.mock('../nats-wrapper');
//jest.setTimeout(5000);

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = `asdf`;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  // Build a JWT payload {id,email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(), //use differnt id when sigin is calld
    email: '123123@cc.com',
  };
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build session Object. {jwt:MY_JWT}
  const session = { jwt: token };

  //Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  //Take JSON and encode it as base64

  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
