import React, { useState, useEffect } from 'react';
import CardTeam from './CardTeam';
import { useDispatch, useSelector } from 'react-redux';
import Match from './Match';

const TeamTable = (props) => {
  const [followedMatches, setFollowedMatches] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  // const [league, setLeague] = useState('');
  const [filter, setFilter] = useState('');

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

  // const handleLeagueChange = (event) => {
  //   setLeague(event.target.value);
  //   setFilter('');
  //   const filteredMatches = dataReducer.matches.filter(
  //     (match) => team.domesticCompetitionId === event.target.value
  //   );
  //   setAllMatches(filteredMatches);
  // };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    const filteredMatches = dataReducer.matches.filter(
      (match) => match.awayClubShortName.toLowerCase().includes(event.target.value.toLowerCase()) || match.homeClubShortName.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setAllMatches(filteredMatches);
  };

  return (
    <div>
      <label htmlFor="filter">Filtrer par nom :</label>
          <input
            type="text"
            id="filter"
            name="filter"
            value={filter}
            onChange={handleFilterChange}
          />
      {(followedMatches.length !== 0 && filter === '') && <h1>Equipes suivies</h1>}
      {filter === '' && followedMatches.map((match, index) => (
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