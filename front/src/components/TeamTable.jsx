import React, { useState, useEffect } from 'react';
import CardTeam from './CardTeam';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const TeamTable = (props) => {
  const [selectedTeam, setSelectedTeam] = useState({name: ''});
  const [teamList, setTeamList] = useState([]);
  const [league, setLeague] = useState('');
  const routeParams = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataReducer = useSelector(state => state.dataReducer)

  useEffect(() => {
    if(routeParams.id !== 'all'){
      setLeague(routeParams.id)
      const filteredTeams = dataReducer.teams.filter(
        (team) => team.domesticCompetitionId === routeParams.id
      );
      setTeamList(filteredTeams)
    }
    else{
      setTeamList(dataReducer.teams)
    }
  }, []);

  const handleLeagueChange = (event) => {
    setLeague(event.target.value);
    const filteredTeams = dataReducer.teams.filter(
      (team) => team.domesticCompetitionId === event.target.value
    );
    setTeamList(filteredTeams);
  };
  
  const handleDoubleClick = (teamId) => {
    navigate('/team/' + teamId)
  };

  return (
    <>
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
    </div>
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