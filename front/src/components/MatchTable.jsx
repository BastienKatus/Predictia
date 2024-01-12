import React, { useState, useEffect } from 'react';
import CardTeam from './CardTeam';
import { useDispatch, useSelector } from 'react-redux';
import Match from './Match';

const TeamTable = (props) => {
  const [followedMatches, setFollowedMatches] = useState([]);
  const [allMatches, setAllMatches] = useState([]);

  const userReducer = useSelector(state => state.userReducer)

  useEffect(() => {
    const data = [
      { team1: 'Real', team2:'Barca', logo1: '', logo2: '' },
      { team1: 'AC Ajaccio', team2:'ASSE', logo1: '', logo2: '', id1: 1147, id2: 54 },
      { team1: 'Paris', team2:'Tamere', logo1: '', logo2: '' },
    ];
  
    if (userReducer.followedTeams === [] || !userReducer.followedTeams) {
      followedMatches = []
      allMatches = data
    }
    else{
      setFollowedMatches(data.filter((match) =>
        userReducer.followedTeams.includes(match.id1) || userReducer.followedTeams.includes(match.id2)
      ));
      setAllMatches(data.filter((match) =>
        !userReducer.followedTeams.includes(match.id1) && !userReducer.followedTeams.includes(match.id2)
      ));
    }
  }, []);

  return (
    <div>
      {followedMatches.length !== 0 && <h1>Equipe suivies</h1>}
      {followedMatches.map((match, index) => (
          <Match
          team1={match.team1}
          team2={match.team2}
        />
      ))}
      {allMatches !== [] && <h1>Toutes les équipes</h1>}
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