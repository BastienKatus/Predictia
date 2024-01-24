import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CardPlayer from './CardPlayer';

const HistoriqueTable = (props) => {
  const [gamesList, setGamesList] = useState([]);
  
  useEffect(() => {
    if(props.clubId){
      fetch('/soccerManager/clubs/' + (props.clubId))
        .then(response => response.json())
        .then(data => {
          setGamesList(data.gamesList);
        })
        .catch(error => console.error('Erreur lors de la récupération du club', error));
    }
    else{
      setGamesList(props.gamesList)
    }
  }, []);

  function getResult(game) {
    if (game.homeClubGoals > game.awayClubGoals) {
      if(game.homeClubId === props.clubId){
        return "Gagné"
      }
      else{
        return "Perdu"
      }
    } else if (game.awayClubGoals > game.homeClubGoals) {
      if(game.awayClubId === props.clubId){
        return "Gagné"
      }
      else{
        return "Perdu"
      }
    } else {
        return "Nul";
    }

  }


  return (
    <>
    <h1>Historique des matchs :</h1>
    <div className="card-table-container">
      <table className="card-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Rencontre</th>
            <th>Résultat</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {gamesList.map((game) => (
            <tr
              key={game.gameId}
            >
              <td>{game.date}</td>
              <td>{game.homeClubName} - {game.awayClubName}</td>
              <td>{getResult(game)}</td>
              <td>{game.homeClubGoals} - {game.awayClubGoals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default HistoriqueTable;
