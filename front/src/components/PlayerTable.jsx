import React, { useState } from 'react';
import CardPlayer from './CardPlayer';
import { useDispatch } from 'react-redux'

const PlayerTable = (props) => {
  const [selectedPlayer, setSelectedPlayer] = useState({
    name: '',
  });
  const [playerList, setPlayerList] = useState([]);

  const dispatch = useDispatch();

  /*fetch('/soccerManager/players/' + props.clubId)
    .then(response => response.json())
    .then(data => setPlayerList(data))
    .catch(error => console.error('Erreur lors de la récupération des clubs', error));*/

  return (
    <div className="card-table-container">
      <table className="card-table">
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Club</th>
            <th>Valeur</th>
            <th>Pied fort</th>
          </tr>
        </thead>
        <tbody>
          {playerList.map((player) => (
            <tr
              key={player.playerId}
              className={selectedPlayer.lastName === player.lastName ? 'selected' : ''}
              onClick={() => setSelectedPlayer(player)}
            >
              <td>{player.firstName}</td>
              <td>{player.lastName}</td>
              <td>{player.currentClubId}</td>
              <td>{player.marketValueInEur}</td>
              <td>{player.foot}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedPlayer.name !== '' && <CardPlayer card={selectedPlayer} />}

    </div>
  );
};

export default PlayerTable;