import React from 'react';

const Home = ({ color }) => {
  console.log('i am on the component ', color);
  return <div>Hello home</div>;
};
Home.getInitialProps = () => {
  console.log('i am on the server');
  return { color: 'red' };
};
export default Home;
