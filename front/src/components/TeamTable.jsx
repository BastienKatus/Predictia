import React, { useState } from 'react';
import CardTeam from './CardTeam';
import { useDispatch } from 'react-redux';

const TeamTable = (props) => {
  const [selectedTeam, setSelectedTeam] = useState({
    name: '',
  });

  const dispatch = useDispatch();

  const data = [
    { name: 'Real', league: 'Liga', classement: 1, followed: false },
    { name: 'Barca', league: 'Liga', classement: 4, followed: false },
    { name: 'OL', league: 'Ligue1', classement: 54, followed: true },
  ];

  const filteredData = props.followed === 'true' ? data.filter((team) => team.followed === true) : data;

  return (
    <div className="card-table-container">
      <table className="card-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Ligue</th>
            <th>Classement</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((team, index) => (
            <tr
              key={index}
              className={selectedTeam.name === team.name ? 'selected' : ''}
              onClick={() => setSelectedTeam(team)}
            >
              <td>{team.name}</td>
              <td>{team.league}</td>
              <td>{team.classement}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTeam.name !== '' && <CardTeam card={selectedTeam} />}
    </div>
  );
};

export default TeamTable;