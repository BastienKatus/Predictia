import React, { useState, useEffect } from 'react';
import CardTeam from './CardTeam';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const TeamTable = () => {
  const [selectedTeam, setSelectedTeam] = useState({ name: '' });
  const [teamList, setTeamList] = useState([]);
  const [league, setLeague] = useState('');
  const [filter, setFilter] = useState('');
  const routeParams = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const dataReducer = useSelector(state => state.dataReducer);
  const userReducer = useSelector(state => state.userReducer);

  useEffect(() => {
    if (routeParams.id === 'followed') {
      const followedTeams = dataReducer.teams.filter(
        (team) => userReducer.followedTeams.includes(team.clubId)
      );
      setTeamList(followedTeams);
    } else if (routeParams.id !== 'all') {
      setLeague(routeParams.id);
      const filteredTeams = dataReducer.teams.filter(
        (team) => team.domesticCompetitionId === routeParams.id
      );
      setTeamList(filteredTeams);
    } else {
      setTeamList(dataReducer.teams);
    }
  }, [location]);

  const handleLeagueChange = (event) => {
    setLeague(event.target.value);
    setFilter('');
    const filteredTeams = dataReducer.teams.filter(
      (team) => team.domesticCompetitionId === event.target.value
    );
    setTeamList(filteredTeams);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    const filteredTeams = dataReducer.teams.filter(
      (team) => team.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setTeamList(filteredTeams);
  };

  const handleClick = (userId) => {
    navigate('/follow_teams/' + userId);
  }

  const handleDoubleClick = (teamId) => {
    navigate('/team/' + teamId);
  };

  return (
    <>
      {routeParams.id !== 'followed' ? (
        <div>
          <label htmlFor="league">Sélectionner une ligue :</label>
          <select
            id="league"
            name="league"
            value={league}
            onChange={handleLeagueChange}
          >
            <option value="">Toutes les ligues</option>
            {dataReducer.competitions.map((competition) => (
              <option key={competition.competitionId} value={competition.competitionId}>
                {competition.name}
              </option>
            ))}
          </select>
          <label htmlFor="filter">Filtrer par nom :</label>
          <input
            type="text"
            id="filter"
            name="filter"
            value={filter}
            onChange={handleFilterChange}
          />
        </div>
      ) : (
        <div>
          <button onClick={() => handleClick(userReducer.userId)}>Modifier les équipes suivies</button>
        </div>
      )}
      <div className="card-table-container">
        <table className="card-table">
          <thead>
            <tr>
              <th>Nom</th>
            </tr>
          </thead>
          <tbody>
            {teamList.map((team) => (
              <tr
                key={team.clubId}
                onDoubleClickCapture={() => { handleDoubleClick(team.clubId) }}
              >
                <td>{team.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TeamTable;
