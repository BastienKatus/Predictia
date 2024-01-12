import React, { useState } from 'react';
import CardPlayer from './CardPlayer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

const PlayerTable = (props) => {
  const [competitionList, setCompetitionList] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataReducer = useSelector(state => state.dataReducer)

  const handleDoubleClick = (competitionId) => {
    navigate('/teams/' + competitionId)
  };

  return (
    <div className="card-table-container">
      <table className="card-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Pays</th>
          </tr>
        </thead>
        <tbody>
          {dataReducer.competitions.map((competition) => (
            <tr
              key={competition.competitionId}
              onDoubleClickCapture={() => { handleDoubleClick(competition.competitionId) }}
            >
              <td>{competition.name}</td>
              <td>{competition.subType === 'first_tier' && 'Division 1'}</td>
              <td>{competition.countryName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTable;