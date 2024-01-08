import React, { useState } from 'react';
import MatchTable from './MatchTable'

const Home = () => {
  
  return (
    <>
    connecté :
    <MatchTable followed={'OL'}/>
    pas connecté :
    <MatchTable/>
    </>
  );
};

export default Home;