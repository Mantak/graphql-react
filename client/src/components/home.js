import React from 'react';

const Home = () => {
  const token = localStorage.getItem('token');
  return (
    <div>{token}</div>
  );
};

export default Home;
