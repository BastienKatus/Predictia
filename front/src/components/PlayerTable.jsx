import React, { useState, useEffect } from 'react';
import CardPlayer from './CardPlayer';

const PlayerTable = (props) => {
  const [selectedPlayer, setSelectedPlayer] = useState({ name: '' });
  const [playerList, setPlayerList] = useState([]);
  const [filteredPlayerList, setFilteredPlayerList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [filter, setFilter] = useState('');
  const [positionList] = useState([
    { id: 1, name: 'Goalkeeper' },
    { id: 2, name: 'Defender' },
    { id: 3, name: 'Midfield' },
    { id: 4, name: 'Attack' },
  ]);

  useEffect(() => {
    fetch('/soccerManager/players/club/' + props.clubId)
      .then((response) => response.json())
      .then((data) => {
        setPlayerList(data);
        setFilteredPlayerList(data);
      })
      .catch((error) =>
        console.error('Erreur lors de la récupération des joueurs', error)
      );
  }, [props.clubId]);

  const handlePositionChange = (e) => {
    setSelectedPosition(e.target.value);
    setFilter(''); // Reset player name filter when changing position
    if (e.target.value !== '') {
      const filteredPlayers = playerList.filter(
        (player) => player.position === e.target.value
      );
      setFilteredPlayerList(filteredPlayers);
    } else {
      setFilteredPlayerList(playerList);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    const filteredPlayers = playerList.filter(
      (player) =>
        player.firstName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        player.lastName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredPlayerList(filteredPlayers);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
    <h1>Joueurs</h1>
    <div className="filters">
      <label>
        Nom :
      </label>
      <input
        type="text"
        value={filter}
        onChange={handleFilterChange}
      />
      <label>
        Poste :
      </label>
      <select value={selectedPosition} onChange={handlePositionChange}>
        <option value="">Tous les postes</option>
        {positionList.map((position) => (
          <option key={position.id} value={position.name}>
            {position.name}
          </option>
        ))}
      </select>
    </div>
    <div className="card-table-container">
      <table className="card-table">
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Valeur</th>
            <th>Poste</th>
            <th>Pied fort</th>
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
              <td>{player.marketValueInEur} €</td>
              <td>{player.subPosition}</td>
              <td>{player.foot}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <CardPlayer card={selectedPlayer} />
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default PlayerTable;
