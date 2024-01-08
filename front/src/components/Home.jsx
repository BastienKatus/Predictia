import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import MatchTable from './MatchTable'

const Home = () => {
  const userReducer = useSelector(state => state.userReducer)

  return (
    <>
    {
      userReducer.currentUser !== null ? (
        <>
        <MatchTable followed={'OL'}/>
        </>
      ) : (
        <>
        <MatchTable/>
        </>
      )
    } 
    </>
  );
};

export default Home;