import React, { useState } from 'react';
import CardPlayer from './CardPlayer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const PlayerTable = (props) => {
  const [competitionList, setCompetitionList] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataReducer = useSelector(state => state.dataReducer)

  const handleButtonClick = (competitionId) => {
    navigate('/teams/' + competitionId)
  };

  return (
    <div className="card-table-container">
      <table className="card-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dataReducer.competitions.map((competition) => (
            <tr
              key={competition.competitionId}
            >
              <td>{competition.name}</td>
              <td>
                <button>
                < FontAwesomeIcon icon={faEye} onClick={() => { handleButtonClick(competition.competitionId) }}/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTable;