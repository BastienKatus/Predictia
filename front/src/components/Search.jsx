import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CardPlayer from './CardPlayer';

const Search = (props) => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noResponse, setNoResponse] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState({ name: '' });

  const dispatch = useDispatch();
  const routeParams = useParams();
  const navigate = useNavigate();
  const dataReducer = useSelector(state => state.dataReducer)

  useEffect(() => {
    fetch('/soccerManager/players/search?name=' + routeParams.search)
      .then((response) => response.json())
      .then((data) => {
        if(data.length === 0){
          setNoResponse(true)
          setPlayers([])
        }
        else{
          setPlayers(data)
        }
      })
      .catch((error) =>
        console.error('Erreur lors de la récupération des joueurs', error)
      );
    fetch('/soccerManager/clubs/search?name=' + routeParams.search)
      .then((response) => response.json())
      .then((data) => {
        if(data.length === 0){
          setNoResponse(true)
          setTeams([])
        }
        else{
          setTeams(data)
        }
      })
      .catch((error) =>
        console.error('Erreur lors de la récupération des équipes', error)
      );
  }, [routeParams.search]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDoubleClick = (teamId) => {
    navigate('/team/' + teamId);
  };

  return (
    <>
      <h1>Résultat de la recherche : '{routeParams.search}'</h1>
      {players.length !== 0 || teams.length !== 0 || noResponse ? (
      <div className="search-container">
        {players.length !== 0 &&(
          <div class="search-player">
          <h3>Joueurs :</h3>
          <div className="card-table-container">
          <table className="card-table">
            <thead>
              <tr>
                <th>Prénom</th>
                <th>Nom</th>
                <th>Valeur</th>
                <th>Poste</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
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
      </div>
      )
      }
      {teams.length !== 0 &&(
      <div class="search-team">
        <h3>Equipes :</h3>
        <div className="card-table-container">
          <table className="card-table">
            <thead>
              <tr>
                <th>Nom</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr
                  key={team.clubId}
                  onDoubleClickCapture={() => { handleDoubleClick(team.clubId) }}
                >
                  <td>{team.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )
      }
    </div>
    )
    :
    (
      <p>Chargement en cours...</p>
    )}
    </>
  );
};

export default Search;