import React, { useState } from 'react';
import CardPlayer from './CardPlayer';
import { useDispatch } from 'react-redux'

const PlayerTable = (props) => {
  const [selectedPlayer, setSelectedPlayer] = useState({
    name: '',
  });

  const dispatch = useDispatch();

  const data = [
    { name: 'Lionel Pepsi', club: 'dzd', age: 12, value: 277700, pied_fort: 'L', nb_match: 4 },
    { name: 'Christiano RonaldMcDonald', club: 'ddzdz', age: 43, value: 277700, pied_fort: 'L', nb_match: 4 },
    { name: 'Zizinédine Zizidane', club: 'dzd', age: 43, value: 277700, pied_fort: 'D', nb_match: 4 },
  ];

  return (
    <div className="card-table-container">
      <table className="card-table">
        <thead>
          <tr>
            <th>Prénom/Nom</th>
            <th>Club</th>
            <th>Age</th>
            <th>Valeur</th>
            <th>Pied fort</th>
            <th>Nombre de match</th>
          </tr>
        </thead>
        <tbody>
          {data.map((player, index) => (
            <tr
              key={index}
              className={selectedPlayer.name === player.name ? 'selected' : ''}
              onClick={() => setSelectedPlayer(player)}
            >
              <td>{player.name}</td>
              <td>{player.club}</td>
              <td>{player.age}</td>
              <td>{player.value}</td>
              <td>{player.pied_fort}</td>
              <td>{player.nb_match}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedPlayer.name !== '' && <CardPlayer card={selectedPlayer} />}

    </div>
  );
};

export default PlayerTable;