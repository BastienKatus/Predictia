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
  }, []);

  return (
    <>
      <h1>{team.name}</h1>
      {team.stadiumName && <p><strong>Nom du stade: </strong>{team.stadiumName}</p>}
      {team.stadiumSeats && <p><strong>Nombre de place dans le stade: </strong>{team.stadiumSeats}</p>}
      {team.lastSeason && <p><strong>Dernière saison: </strong>{team.lastSeason}</p>}
      {team.coachName && <p><strong>Nom du coach: </strong>{team.coachName}</p>}
      <PlayerTable clubId={routeParams.id} />
    </>
  );
};

export default Team;
