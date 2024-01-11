import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PlayerTable from './PlayerTable';
import { useSelector } from 'react-redux';

const Team = () => {
  const [team, setTeam] = useState({});
  const routeParams = useParams();
  const dataReducer = useSelector(state => state.dataReducer);

  useEffect(() => {
    const filteredTeam = dataReducer.teams.find(
      team => team.clubId === parseInt(routeParams.id)
    );
    setTeam(filteredTeam);
  }, [dataReducer.teams, routeParams.id]);

  return (
    <>
      <h1>{team.name}</h1>
      {team.stadiumName && <p>Nom du stade: {team.stadiumName}</p>}
      {team.stadiumSeats && <p>Nombre de place dans le stade: {team.stadiumSeats}</p>}
      {team.lastSeason && <p>Dernière saison: {team.lastSeason}</p>}
      {team.coachName && <p>Nom du coach: {team.coachName}</p>}

      <PlayerTable clubId={routeParams.id} />
    </>
  );
};

export default Team;
