import React, { useState, useEffect } from 'react';
import CardTeam from './CardTeam';
import { useDispatch, useSelector } from 'react-redux';
import { getTeams } from '../redux/actions';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const TeamTable = (props) => {
  const [selectedTeam, setSelectedTeam] = useState({name: ''});
  const [teamList, setTeamList] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataReducer = useSelector(state => state.dataReducer)

  useEffect(() => {
    if(dataReducer.teams.length !== 0){
      setTeamList(dataReducer.teams)
    }
    else{
      fetch('/soccerManager/clubs')
        .then(response => response.json())
        .then(data => {
          dispatch(getTeams(data));
          setTeamList(data)
        })
        .catch(error => console.error('Erreur lors de la récupération des clubs', error));
    }
  }, []);

  const handleButtonClick = (teamId) => {
    navigate('/team/' + teamId)
  };

  return (
    <div className="card-table-container">
      <table className="card-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {teamList.map((team) => (
            <tr
              key={team.clubId}
            >
              <td>{team.name}</td>
              <td><button>
            <FontAwesomeIcon icon={faEye} onClick={() => { handleButtonClick(team.clubId) }}/></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamTable;