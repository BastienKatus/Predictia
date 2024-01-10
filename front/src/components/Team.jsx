import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import PlayerTable from './PlayerTable';

const Team = ({ teamId }) => {
  const [players, setPlayers] = useState(0);
  const routeParams = useParams();

  useEffect(() => {

  })

  return (
    <PlayerTable clubId={routeParams.id} />
  );
};

export default Team;