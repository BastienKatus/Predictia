import React, { useState, useEffect } from 'react';
import CardTeam from './CardTeam';
import { useDispatch, useSelector } from 'react-redux';
import Match from './Match';

const TeamTable = (props) => {
  const [followedMatches, setFollowedMatches] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [league, setLeague] = useState('');
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
  }, [dataReducer.matches, userReducer.followedTeams]);

  const handleLeagueChange = (event) => {
    setFilter('');
    setLeague(event.target.value);
    if(event.target.value === ''){
      setFollowedMatches(dataReducer.matches.filter((match) =>
        userReducer.followedTeams.includes(match.awayClubId) || userReducer.followedTeams.includes(match.homeClubId)
      ));
      setAllMatches(dataReducer.matches.filter((match) =>
        !userReducer.followedTeams.includes(match.awayClubId) && !userReducer.followedTeams.includes(match.homeClubId)
      ));
    }
    else{
      const filteredTeams = dataReducer.teams.filter(
        (team) => team.domesticCompetitionId === event.target.value
      );
      const teamIds = filteredTeams.map(team => team.clubId);
      const filteredMatches = dataReducer.matches.filter(match => {
        return teamIds.includes(match.homeClubId) || teamIds.includes(match.awayClubId);
      });
      setAllMatches(filteredMatches);
    }
  };

  const handleFilterChange = (event) => {
    setLeague('');
    setFilter(event.target.value);
    const filteredMatches = dataReducer.matches.filter(
      (match) => match.awayClubShortName.toLowerCase().includes(event.target.value.toLowerCase()) || match.homeClubShortName.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setAllMatches(filteredMatches);
  };

  return (
    <div>
      <div className='filters'>
        <label htmlFor="league">Ligue :</label>
        <select
          id="league"
          name="league"
          value={league}
          onChange={handleLeagueChange}
        >
          <option value=''>Toutes les ligues</option>
          {dataReducer.competitions.map((competition) => (
            <option key={competition.competitionId} value={competition.competitionId}>
              {competition.name}
            </option>
          ))}
        </select>
        <label htmlFor="filter">Equipe :</label>
        <input
          type="text"
          id="filter"
          name="filter"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>
      {(followedMatches.length !== 0 && filter === '' && league === '') && <h1>Equipes suivies</h1>}
      {filter === '' && league === '' && followedMatches.map((match, index) => (
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