import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Simulation = (props) => {
  const [teamList, setTeamList] = useState([]);
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');

  const [predictionResult, setPredictionResult] = useState(null);

  const dataReducer = useSelector(state => state.dataReducer)

  useEffect(() => {
    setTeamList(dataReducer.teams)
  }, [dataReducer.teams]);


  useEffect(() => {
  }, [predictionResult]);

  const handleHomeTeamChange = (e) => {
    setHomeTeam(e.target.value);
  };

  const handleAwayTeamChange = (e) => {
    setAwayTeam(e.target.value);
  };

  const handleApplyPrediction = (e) => {
    let predictionURL = "/soccerManager/games/predict?homeTeamId=" + homeTeam + "&awayTeamId=" + awayTeam;
    fetch(predictionURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => {
        console.log("json", json);
        setPredictionResult(json);
      })
  };

  return (
    <div>
      <div>
        <label>
          Equipe à Domicile :
          <select onChange={handleHomeTeamChange}>
            <option value="">Selectionner l'équipe à domicile</option>
            {teamList.map((team) => (
              <option key={team.clubId} value={team.clubId}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Equipe Visiteur :
          <select onChange={handleAwayTeamChange}>
            <option value="">Selectionner l'équipe à visiteur</option>
            {teamList.map((team) => (
              <option key={team.clubId} value={team.clubId}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {predictionResult !== null && (
        <div className="percentage-bar">
          <div className="percentage" style={{ width: `${predictionResult.probabilite_victoire*100}%` }}>
            {Math.round(predictionResult.probabilite_victoire*100)}%
          </div>
          <div className="percentage2" style={{ width: `${predictionResult.probabilite_nul*100}%` }}>
            {Math.round(predictionResult.probabilite_nul*100)}%
          </div>
          <div className="percentage3" style={{ width: `${predictionResult.probabilite_defaite*100}%` }}>
            {Math.round(predictionResult.probabilite_defaite*100)}%
          </div>
        </div>
      )}

      <button onClick={handleApplyPrediction}>Appliquer la prédiction du match personnalisé</button>

    </div>
  );
};

export default Simulation;