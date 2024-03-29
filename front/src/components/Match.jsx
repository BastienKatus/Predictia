import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import StatsTable from './StatsTable';
import HistoriqueTable from './HistoriqueTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faHistory, faChartLine } from '@fortawesome/free-solid-svg-icons';

const Match = ({ match }) => {
  const [percentageHome, setPercentageHome] = useState(0);
  const [percentageAway, setPercentageAway] = useState(0);
  const [percentageDraw, setPercentageDraw] = useState(0);
  const [favoriteTeam, setFavoriteTeam] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalHistoryOpen, setIsModalHistoryOpen] = useState(false);
  const [teamId, setTeamId] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(match)
    setPercentageHome(Math.round(match.predictionWinHome*100))
    setPercentageAway(Math.round(match.predictionWinAway*100))
    setPercentageDraw(Math.round(match.predictionDraw*100))
    if ((match.predictionWinHome > match.predictionWinAway) && (match.predictionWinHome > match.predictionDraw)) {
      setFavoriteTeam(match.homeClubShortName + " vainqueur")
    }
    if ((match.predictionDraw > match.predictionWinAway) && (match.predictionWinHome < match.predictionDraw)){
      setFavoriteTeam(" match nul.")
    }
    if ((match.predictionWinHome < match.predictionWinAway) && (match.predictionWinAway > match.predictionDraw)){
      setFavoriteTeam(match.awayClubShortName + " vainqueur")
    }
    
    //0 => homeClubShortName
    //1 => num 
    //2 => awayClubShortName
  }, [match])

  const isMatchToday = () => {
    const today = new Date();
    const matchDate = new Date(match.gameDate);
  
    return today.toDateString() === matchDate.toDateString();
  };

  const handleButtonClick = () => {
      navigate('/simulation/');
  };

  const handleButtonNavigateTeamClick = (teamId) => {
      navigate('/team/' + teamId);
  };

  const handleTeamButtonClick = (id) => {
    setTeamId(id)
    setIsModalOpen(true)
  }

  const handleHistoryButtonClick = (id) => {
    setTeamId(id)
    setIsModalHistoryOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setIsModalHistoryOpen(false);
  };

  function formatDate(dateString) {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril',
      'Mai', 'Juin', 'Juillet', 'Août',
      'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
  
    const [year, month, day] = dateString.split('-');
    const monthName = months[parseInt(month, 10) - 1];
  
    return `${parseInt(day, 10)} ${monthName} ${year}`;
  }

  return (
    <>
      {percentageDraw !== 0 && (
        <div className="match-football">
        <p className='match-date'>
            Date : 
            {isMatchToday() ? " Aujourd'hui" : ' ' + formatDate(match.gameDate)}
        </p>
        <div className="teams-container">
            <div className="team">
              {match.homeClubLogoUrl && <img src={match.homeClubLogoUrl} />}
              <p>{match.homeClubShortName}</p>
            </div>
    
            <div className="versus">VS</div>
    
            <div className="team">
              {match.awayClubLogoUrl && <img src={match.awayClubLogoUrl} />}
              <p>{match.awayClubShortName}</p>
            </div>
        </div>
    
        <div className="percentage-bar">
            <div className={ percentageHome >= percentageAway ? "percentage" : "percentage3" } style={{ width: `${percentageHome}%` }}>
            {percentageHome}%
            </div>
            <div className="percentage2" style={{ width: `${percentageDraw}%` }}>
            {percentageDraw}%
            </div>
            <div className={ percentageHome < percentageAway ? "percentage" : "percentage3" } style={{ width: `${percentageAway}%` }}>
            {percentageAway}%
            </div>
        </div>
    
        <button className="team1-button" onClick={() => handleTeamButtonClick(match.homeClubId)}>
          <FontAwesomeIcon icon={faChartLine}/>
        </button>
    
        <button className="team2-button" onClick={() => handleTeamButtonClick(match.awayClubId)}>
          <FontAwesomeIcon icon={faChartLine}/>
        </button>
    
        <button className="team1-button-history" onClick={() => handleHistoryButtonClick(match.homeClubId)}>
          <FontAwesomeIcon icon={faHistory}/>
        </button>
    
        <button className="team2-button-history" onClick={() => handleHistoryButtonClick(match.awayClubId)}>
          <FontAwesomeIcon icon={faHistory}/>
        </button>
    
        <button className="team1-button-info" onClick={() => handleButtonNavigateTeamClick(match.homeClubId)}>
          <FontAwesomeIcon icon={faCircleInfo}/>
        </button>
    
      <button className="team2-button-info" onClick={() => handleButtonNavigateTeamClick(match.awayClubId)}>
        <FontAwesomeIcon icon={faCircleInfo}/>
      </button>
    
        <div>
          <p>Predictia indique {favoriteTeam}</p>
        </div>
    
        {/* <button onClick={handleButtonClick}>Simuler le match</button> */}
    
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content-xl">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <StatsTable id={teamId} year='2023' />
            </div>
          </div>
        )}
    
        {isModalHistoryOpen && (
          <div className="modal">
            <div className="modal-content-xl">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <HistoriqueTable clubId={teamId} year='2023' />
            </div>
          </div>
        )}
        </div>
      )}
    </>
  );
};

export default Match;