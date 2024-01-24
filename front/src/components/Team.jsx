import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PlayerTable from './PlayerTable';
import HistoriqueTable from './HistoriqueTable';
import StatsTable from './StatsTable';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faHistory } from '@fortawesome/free-solid-svg-icons';

const Team = () => {
  const [team, setTeam] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalHistoryOpen, setIsModalHistoryOpen] = useState(false);
  const routeParams = useParams();
  const navigate = useNavigate();
  const dataReducer = useSelector(state => state.dataReducer);

  useEffect(() => {
    fetch('/soccerManager/clubs/' + routeParams.id)
        .then(response => response.json())
        .then(data => {
          setTeam(data);
        })
        .catch(error => console.error('Erreur lors de la récupération du club', error));
    }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setIsModalHistoryOpen(false)
  };

  const handleClick = (userId) => {
    setIsModalOpen(true)
  }

  const handleClickHistory = (userId) => {
    setIsModalHistoryOpen(true)
  }

  return (
    <>
      <div className="team-info-container">
      {team.url_logo && <img className='team-logo' src={team.url_logo} alt="Team Logo" />}
      <div className="team-details">
        <h1>{team.name}</h1>
        {team.stadiumName && <p><strong>Nom du stade: </strong>{team.stadiumName}</p>}
        {team.stadiumSeats && <p><strong>Nombre de place dans le stade: </strong>{team.stadiumSeats}</p>}
        {team.lastSeason && <p><strong>Dernière saison: </strong>{team.lastSeason}</p>}
        {team.coachName && <p><strong>Nom du coach: </strong>{team.coachName}</p>}
      </div>
      <div className="team-stats">
        <button onClick={() => handleClick()} className="team-stats-btn"><FontAwesomeIcon icon={faCircleInfo} size='xl'/></button> 
        <button onClick={() => handleClickHistory()} className="team-history-btn"><FontAwesomeIcon icon={faHistory} size='xl'/></button> 
      </div>
    </div>
      <PlayerTable clubId={routeParams.id} />

      {isModalHistoryOpen && (
        <div className="modal">
          <div className="modal-content-xl">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
          <HistoriqueTable gamesList={team.gamesList} />
          </div>
        </div>
      )}
          
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content-xl">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <StatsTable id={routeParams.id} year='2023' />
          </div>
        </div>
      )}
    </>
  );
};

export default Team;
