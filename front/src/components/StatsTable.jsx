import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CardPlayer from './CardPlayer';

const StatsTable = (props) => {
  const [stats, setStats] = useState([]);
  const [statsGoal, setStatsGoal] = useState([]);
  const [clubName, setClubName] = useState('');
  const routeParams = useParams();
  const dataReducer = useSelector(state => state.dataReducer);
  
  useEffect(() => {
    fetch('/soccerManager/clubs/statistics_goals?clubId=' + props.id + '&season=' + props.year)
      .then(response => response.json())
      .then(data => {
        setStatsGoal(data)
      })
      .catch(error => console.error('Erreur lors de la récupération des statistiques', error));
    fetch('/soccerManager/clubs/statistics?clubId=' + props.id + '&season=' + props.year)
      .then(response => response.json())
      .then(data => {
        setStats(data)
      })
      .catch(error => console.error('Erreur lors de la récupération des statistiques', error));
      getClubName()
  }, []);

  const getClubName = () => {
    fetch('/soccerManager/clubs/' + props.id)
      .then(response => response.json())
      .then(data => {
        setClubName(data.name);
      })
      .catch(error => console.error('Erreur lors de la récupération du club', error));
  }

  return (
    <>
    <h1 className='stat-h1'>Statistiques en {props.year} : {clubName}</h1>
    {Object.keys(statsGoal).length !== 0 ? (
    <div className='filters'>
      <div className="stats-container">
        <div className="stat-card">
          <h4>Classement du club</h4>
          <p className="stat-p">Position: {stats["calculate-club-ranking"]["data"][0]["position"]}</p>
          <p className="stat-p">Points: {stats["calculate-club-ranking"]["data"][0]["points"]}</p>
        </div>

        <div className="stat-card">
          <h4>Victoires</h4>
          <p className="stat-p">Domicile: {stats["calculate-wins"]["data"][0]["victoires_domicile"]}</p>
          <p className="stat-p">Extérieur: {stats["calculate-wins"]["data"][0]["victoires_exterieur"]}</p>
        </div>

        <div className="stat-card">
          <h4>Défaites</h4>
          <p className="stat-p">Domicile: {stats["calculate-losses"]["data"][0]["defaites_domicile"]}</p>
          <p className="stat-p">Extérieur: {stats["calculate-losses"]["data"][0]["defaites_exterieur"]}</p>
        </div>

        <div className="stat-card">
          <h4>5 derniers matchs</h4>
          <p className="stat-p">Victoires: {stats["calculate-form-last-5-matches"]["data"][0]["victoires_5_derniers"]}</p>
          <p className="stat-p">Défaites: {stats["calculate-form-last-5-matches"]["data"][0]["defaites_5_derniers"]}</p>
          <p className="stat-p">Nuls: {stats["calculate-form-last-5-matches"]["data"][0]["nul_5_derniers"]}</p>
        </div>

        <div className="stat-card">
          <h4>Cartons jaunes</h4>
          <p className="stat-p">Nombre: {stats["calculate-yellow-cards"]["nombre_cartons_jaunes"]}</p>
          <p className="stat-p">Moyenne par match: {stats["calculate-average-yellow-cards-per-match"]["moyenne_cartons_jaunes_par_match"]}</p>

        </div>

        <div className="stat-card">
          <h4>Cartons rouges</h4>
          <p className="stat-p">Nombre: {stats["calculate-red-cards"]["nombre_cartons_rouges"]}</p>
          <p className="stat-p">Moyenne par match: {stats["calculate-red-cards-and-average"]["data"][0]["moyenne_cartons_rouges_par_match"]}</p>
        </div>
      </div>
        -
      <div className="stats-container">
        <div className="stat-card">
          <h4>Buts marqués :</h4>
          <p className="stat-p">Total: {Math.round(statsGoal["calculate-goals-scored"]["data"][0]["buts_marques_par_match_total"]*100)/100}</p>
          <p className="stat-p">Domicile: {Math.round(statsGoal["calculate-goals-scored"]["data"][0]["buts_marques_par_match_domicile"]*100)/100}</p>
          <p className="stat-p">Extérieur: {Math.round(statsGoal["calculate-goals-scored"]["data"][0]["buts_marques_par_match_exterieur"]*100)/100}</p>
        </div>

        <div className="stat-card">
          <h4>Moyenne de buts</h4>
          <p className="stat-p">Total: {Math.round(statsGoal["calculate-average-goals-scored"]["data"][0]["moyenne_buts_marques_total"]*100)/100}</p>
          <p className="stat-p">Domicile: {Math.round(statsGoal["calculate-average-goals-scored"]["data"][0]["moyenne_buts_marques_domicile"]*100)/100}</p>
          <p className="stat-p">Extérieur: {Math.round(statsGoal["calculate-average-goals-scored"]["data"][0]["moyenne_buts_marques_exterieur"]*100)/100}</p>
        </div>

        <div className="stat-card">
          <h4>Buts encaissés</h4>
          <p className="stat-p">Total: {statsGoal["calculate-total-goals-conceded"]["data"][0]["total_buts_encaisses_total"]}</p>
          <p className="stat-p">Domicile: {statsGoal["calculate-total-goals-conceded"]["data"][0]["total_buts_encaisses_domicile"]}</p>
          <p className="stat-p">Extérieur: {statsGoal["calculate-total-goals-conceded"]["data"][0]["total_buts_encaisses_exterieur"]}</p>
        </div>

        <div className="stat-card">
          <h4>Matchs avec des buts marqués</h4>
          <p className="stat-p">Total: {statsGoal["calculate-goals-matches"]["data"][0]['nombre_matchs_avec_buts']}</p>
        </div>

        <div className="stat-card">
          <h4>Matchs avec des buts encaissés</h4>
          <p className="stat-p">Total: {statsGoal["calculate-conceded-goals-matches"]["data"][0]['nombre_matchs_avec_buts_encaisses']}</p>
        </div>

        <div className="stat-card">
          <h4>Moyenne de la minute du premier but</h4>
          <p className="stat-p">{Math.round(statsGoal["calculate-average-minute-first-goal"].minute_moyenne_premier_but*10)/10} minutes</p>
        </div>
      </div>
    </div>
    )
    :
    (
      <p>Chargement en cours...</p>
    )}
    </>
  );
};

export default StatsTable;
