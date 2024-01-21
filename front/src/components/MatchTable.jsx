import React, { useState, useEffect } from 'react';
import CardTeam from './CardTeam';
import { useDispatch, useSelector } from 'react-redux';
import Match from './Match';

const TeamTable = (props) => {
  const [followedMatches, setFollowedMatches] = useState([]);
  const [allMatches, setAllMatches] = useState([]);

  const userReducer = useSelector(state => state.userReducer)
  const dataReducer = useSelector(state => state.dataReducer)

  useEffect(() => {
    if (userReducer.followedTeams === [] || !userReducer.followedTeams) {
      followedMatches = []
      allMatches = dataReducer.matches
    }
    else{
      setFollowedMatches(dataReducer.matches.filter((match) =>
        userReducer.followedTeams.includes(match.awayClubId) || userReducer.followedTeams.includes(match.homeClubId)
      ));
      setAllMatches(dataReducer.matches.filter((match) =>
        !userReducer.followedTeams.includes(match.awayClubId) && !userReducer.followedTeams.includes(match.homeClubId)
      ));
    }
  }, [dataReducer.matches]);

  return (
    <div>
      {followedMatches.length !== 0 && <h1>Equipe suivies</h1>}
      {followedMatches.map((match, index) => (
          <Match
          key={index}
          match={match}
        />
      ))}
      {allMatches !== [] && <h1>Toutes les équipes</h1>}
      {allMatches.map((match, index) => (
        <Match
        key={index}
        match={match}
      />
    ))}
    </div>
  );
};

export default TeamTable;