import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCompetitions, getTeams } from '../redux/actions';
import MatchTable from './MatchTable'

const Home = () => {

  const dispatch = useDispatch();
  const dataReducer = useSelector(state => state.dataReducer)
  const userReducer = useSelector(state => state.userReducer)

  useEffect(() => {
    if(dataReducer.competitions.length === 0){
      fetch('/soccerManager/competitions')
        .then(response => response.json())
        .then(data => {
          dispatch(getCompetitions(data));
        })
        .catch(error => console.error('Erreur lors de la récupération des compétitions', error));
    }
    if(dataReducer.teams.length === 0){
      fetch('/soccerManager/clubs')
        .then(response => response.json())
        .then(data => {
          dispatch(getTeams(data));
        })
        .catch(error => console.error('Erreur lors de la récupération des clubs', error));
    }
  }, []);

  return (
    <>
    <MatchTable/>
    </>
  );
};

export default Home;