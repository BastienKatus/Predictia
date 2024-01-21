import React, { useState, useEffect } from 'react';

const Match = ({ match }) => {
  const [percentageHome, setPercentageHome] = useState(0);
  const [percentageAway, setPercentageAway] = useState(0);
  const [percentageDraw, setPercentageDraw] = useState(0);
  const [favoriteTeam, setFavoriteTeam] = useState(0);

  useEffect(() => {
    setPercentageHome(match.predictionWinHome)
    setPercentageAway(match.predictionWinAway)
    setPercentageDraw(match.predictionDraw)
  }, [])

  const handleButtonClick = () => {
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
    <div className="match-football">
    <p className='match-date'>Date : {formatDate(match.gameDate)}</p>
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
        <div className="percentage" style={{ width: `${percentageHome}%` }}>
        {percentageHome}%
        </div>
        <div className="percentage2" style={{ width: `${percentageDraw}%` }}>
        {percentageDraw}%
        </div>
        <div className="percentage3" style={{ width: `${percentageAway}%` }}>
        {percentageAway}%
        </div>
    </div>

    <div>
      <p>Predictia indique {favoriteTeam} vainqueur</p>
    </div>

    <button onClick={handleButtonClick}>Simuler le match</button>
    </div>
  );
};

export default Match;