import React from 'react';
import axios from 'axios';
import buildClient from '../api/build-client';
const Home = ({ currentuser }) => {
  return currentuser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not sign in </h1>
  );
};
Home.getInitialProps = async ({ req }) => {
  const client = buildClient({ req });
  const { data } = await client.get(`/api/users/currentuser`);
  return data;
};
export default Home;
