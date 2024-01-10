import React, { useState, useEffect } from 'react';

const Match = ({ team1, team2, logo1, logo2 }) => {
  const [percentageTeam1, setPercentageTeam1] = useState(0);
  const [percentageTeam2, setPercentageTeam2] = useState(0);
  const [percentageTeam3, setPercentageTeam3] = useState(0);

  useEffect(() => {
  })

  const handleButtonClick = () => {
    const newPercentage = Math.floor(Math.random() * 100) + 1;
    setPercentageTeam1(newPercentage);
    setPercentageTeam2(100-newPercentage);
    setPercentageTeam3(100-newPercentage);
  };

  return (
    <div className="match-football">
    <div className="teams-container">
        <div className="team">
        <img src={logo1} alt={`${team1} logo`} />
        <p>{team1}</p>
        </div>

        <div className="versus">VS</div>

        <div className="team">
        <img src={logo2} alt={`${team2} logo`} />
        <p>{team2}</p>
        </div>
    </div>

    <div className="percentage-bar">
        <div className="percentage" style={{ width: `${percentageTeam1}%` }}>
        {percentageTeam1}%
        </div>
        <div className="percentage2" style={{ width: `${percentageTeam2}%` }}>
        {percentageTeam2}%
        </div>
        <div className="percentage3" style={{ width: `${percentageTeam3}%` }}>
        {percentageTeam3}%
        </div>
    </div>

    <button onClick={handleButtonClick}>Simuler le match</button>
    </div>
  );
};

export default Match;