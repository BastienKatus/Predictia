import React, { useState } from 'react';
import CardTeam from './CardTeam';
import { useDispatch } from 'react-redux';
import Match from './Match';

const TeamTable = (props) => {

  const data = [
    { team1: 'Real', team2:'Barca', logo1: '', logo2: '' },
    { team1: 'OL', team2:'ASSE', logo1: '', logo2: '' },
    { team1: 'Paris', team2:'Tamere', logo1: '', logo2: '' },
  ];

  let followedMatches = []
  let allMatches = []
  if (!props.followed) {
    followedMatches = []
    allMatches = data
  }
  else{
    followedMatches = data.filter((match) =>
      props.followed.includes(match.team1) || props.followed.includes(match.team2)
    );
    allMatches = data.filter((match) =>
      !props.followed.includes(match.team1) && !props.followed.includes(match.team2)
    );
  }

  return (
    <div>
      {props.followed && <h1>Equipe suivies</h1>}
      {followedMatches.map((match, index) => (
          <Match
          team1={match.team1}
          team2={match.team2}
        />
      ))}
      <h1>Toutes les équipes</h1>
      {allMatches.map((match, index) => (
        <Match
        key={index}
        team1={match.team1}
        team2={match.team2}
      />
    ))}
    </div>
  );
};

export default TeamTable;