import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logIn } from '../redux/actions';

const UserProfile = ({ userId }) => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userReducer = useSelector(state => state.userReducer);
  const dataReducer = useSelector(state => state.dataReducer);

  const [user, setUser] = useState(null);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const [teamList, setTeamList] = useState([]);
  const [favoriteTeam, setFavoriteTeam] = useState([]);
  const [filteredTeamList, setFilteredTeamList] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [leagueList, setLeagueList] = useState([]);

  useEffect(() => {
    fetch('/users/' + routeParams.id)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setFavoriteTeam(data.favoriteClubId);
      })
      .catch((error) =>
        console.error('Erreur de récupération des informations utilisateurs:', error)
      );
  }, [routeParams.id]);

  useEffect(() => {
    fetch('/soccerManager/clubs/BigLeagueOnly')
      .then(response => response.json())
      .then(data => {
        setTeamList(data);
      })
      .catch(error => console.error('Erreur lors de la récupération des compétitions', error));
  }, []);

  useEffect(() => {
    const filteredCompetitions = dataReducer.competitions.filter(
      (league) => league.competitionId === 'ES1' || league.competitionId === 'FR1' || league.competitionId === 'NL1' || league.competitionId === 'PO1' || league.competitionId === 'IT1' || league.competitionId === 'L1' || league.competitionId === 'GB1'
    );
    setLeagueList(filteredCompetitions);
  }, [dataReducer.competitions]);

  useEffect(() => {
    if (selectedLeague === "") {
      setFilteredTeamList(dataReducer.teams);
    } else {
      const filteredTeams = teamList.filter(
        (team) => selectedLeague !== '' && team.domesticCompetitionId === selectedLeague
      );
      setFilteredTeamList(filteredTeams);
    }
    if (selectedLeague === "" && teamList.length > 0) {
      const teamLeagueId = user?.favoriteClubId ? teamList.find(team => team.clubId === user.favoriteClubId)?.domesticCompetitionId : null;
      if (teamLeagueId) {
        setSelectedLeague(teamLeagueId);
      }
    }
  }, [teamList, selectedLeague, user?.favoriteClubId]);

  const handleChange = (name, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleLeagueChange = (e) => {
    setSelectedLeague(e.target.value);
  };

  const handleFavoriteTeamChange = (e) => {
    setFavoriteTeam(e.target.value);
  };

  const handleSave = () => {
    const updatedUser = { ...user, favoriteClubId: favoriteTeam };
    fetch(`/users/modify/${routeParams.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        fetch('/soccerManager/clubs/' + data.favoriteClubId)
          .then(response => response.json())
          .then(data2 => {
            dispatch(logIn(data.username, data.id, data.followedTeamsId, data2.url_logo));
          })
        setSuccess("Informations mises à jour avec succès !");
        setIsModalOpen(true);
      })
      .catch((error) => {
        setError("Erreur de mise à jour de l'utilisateur");
        setIsModalOpen(true);
        console.error('Erreur de mise à jour de l\'utilisateur:', error);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!user) {
    return <div>Chargement en cours...</div>;
  }

  return (
    <div className="user-profile-container">
      <h2><img className="logo-xl" src={userReducer.favoriteClubLogo} />Profil</h2>
      <div className="form-group">
        <label>Nom d'utilisateur:</label>
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Adresse e-mail:</label>
        <input
          type="text"
          name="mail"
          value={user.mail}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Nom:</label>
        <input
          type="text"
          name="lastname"
          value={user.lastname}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Prénom:</label>
        <input
          type="text"
          name="firstname"
          value={user.firstname}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Equipe favorite :</label>
        <div>
          <label className="label-form-xs">
            Ligue :
          </label>
          <select value={selectedLeague} onChange={handleLeagueChange}>
            <option value="">Toutes les ligues</option>
            {leagueList.map((league) => (
              <option key={league.competitionId} value={league.competitionId}>
                {league.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-form-xs">
            Equipe :
          </label>
          <select value={favoriteTeam} onChange={handleFavoriteTeamChange}>
            <option value="">Selectionner une équipe</option>
            {filteredTeamList.map((team) => (
              <option key={team.clubId} value={team.clubId}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button className="save-user-button" onClick={handleSave}>
        Enregistrer
      </button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
