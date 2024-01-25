import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCompetitions, getTeams, getMatches } from '../redux/actions';
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
          const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
          dispatch(getTeams(sortedData));
        })
        .catch(error => console.error('Erreur lors de la récupération des clubs', error));
    }
    if(dataReducer.matches.length === 0){
      fetch('/soccerManager/nextgames/getAllNextGamesInRange')
        .then(response => response.json())
        .then(data => {
          dispatch(getMatches(data));
        })
        .catch(error => console.error('Erreur lors de la récupération des matchs', error));
    }
  }, []);

  return (
    <>
    <MatchTable/>
    </>
  );
};

export default Home;