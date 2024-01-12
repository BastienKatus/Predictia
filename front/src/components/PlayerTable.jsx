import React, { useState, useEffect } from 'react';
import CardPlayer from './CardPlayer';
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const PlayerTable = (props) => {
  const [selectedPlayer, setSelectedPlayer] = useState({
    name: '',
  });
  const [playerList, setPlayerList] = useState([]);
  const [filteredPlayerList, setFilteredPlayerList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [positionList, setPositionList] = useState([
    {id : 1, name : "Goalkeeper"},
    {id : 2, name : "Defender"},
    {id : 3, name : "Midfield"},
    {id : 4, name : "Attack"}
  ]);

  const dispatch = useDispatch();

  useEffect(() => {
    fetch('/soccerManager/players/club/' + props.clubId)
      .then(response => response.json())
      .then(data => {
        setPlayerList(data)
        setFilteredPlayerList(data)
      })
      .catch(error => console.error('Erreur lors de la récupération des clubs', error));
    
  }, [])

  const handlePositionChange = (e) => {
    setSelectedPosition(e.target.value)
    if(e.target.value !== ""){
      const filteredPlayers = playerList.filter(
        (player) => player.position === e.target.value
      );
      setFilteredPlayerList(filteredPlayers);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="card-table-container">
      <label>
        Poste :
        <select value={selectedPosition} onChange={handlePositionChange}>
          <option value="">Tous les postes</option>
          {positionList.map((position) => (
            <option key={position.id} value={position.name}>
              {position.name}
            </option>
          ))}
        </select>
      </label>
      <table className="card-table">
      <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Valeur</th>
            <th>Poste</th>
            <th>Pied fort</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredPlayerList.map((player) => (
            <tr
              key={player.playerId}
              onDoubleClickCapture={() => {
                setSelectedPlayer(player);
                openModal();
              }}
            >
              <td>{player.firstName}</td>
              <td>{player.lastName}</td>
              <td>{player.marketValueInEur}</td>
              <td>{player.subPosition}</td>
              <td>{player.foot}</td>
              </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <CardPlayer card={selectedPlayer} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerTable;