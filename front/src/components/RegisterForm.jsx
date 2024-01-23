import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import './css/signup.css';

const RegistrationForm = () => {

  const navigate = useNavigate();

  const dataReducer = useSelector(state => state.dataReducer)

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [mail, setMail] = useState('');
  const [favoriteTeam, setFavoriteTeam] = useState('');
  const [followedTeam, setFollowedTeam] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [filteredTeamList, setFilteredTeamList] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [leagueList, setLeagueList] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if(selectedLeague === ""){
      setFilteredTeamList(dataReducer.teams)
    }
    else{
      const filteredTeams = teamList.filter(
        (team) => selectedLeague !== '' && team.domesticCompetitionId === selectedLeague
      );
      setFilteredTeamList(filteredTeams);
    }
  }, [selectedLeague, dataReducer.teams]);

  const handleFirstnameChange = (e) => {
    setFirstname(e.target.value);
  };

  const handleLastnameChange = (e) => {
    setLastname(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleMailChange = (e) => {
    setMail(e.target.value);
  };

  const handleFavoriteTeamChange = (e) => {
    setFavoriteTeam(e.target.value);
  };

  const handleLeagueChange = (e) => {
    setSelectedLeague(e.target.value);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{12,}$/;
    return passwordRegex.test(password);
  };  

  function handleRouting(id) {
    navigate("/follow_teams/" + id);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (validatePassword(password)) {
      fetch('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"favoriteClubId" : favoriteTeam, "username": username,"password": password, "firstname": firstname, "lastname": lastname, "mail": mail}),
      })
      .then(response => response.json())
      .then(json => {
        setSuccess("Utilisateur ajouté avec succès !");
        setIsModalOpen(true)
        setTimeout(() => {
          handleRouting(json.id);
        }, 2000);
      })
    }
    else{
      setError("Le mot de passe n'est pas valide.")
      setIsModalOpen(true)
      setPassword('');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <div>
        <label>
          Prénom :
          <input type="text" value={firstname} onChange={handleFirstnameChange} />
        </label>
      </div>
      <div>
        <label>
          Nom :
          <input type="text" value={lastname} onChange={handleLastnameChange} />
        </label>
      </div>
      <div>
        <label>
          Nom d'Utilisateur :
          <input type="text" value={username} onChange={handleUsernameChange} required className={username ? '' : 'required-input'}/>
        </label>
      </div>
      <div className="label-group">
        <div className="filters">
          <label>
            Ligue :
            <select value={selectedLeague} onChange={handleLeagueChange}>
              <option value="">Toutes les ligues</option>
              {leagueList.map((league) => (
                <option key={league.competitionId} value={league.competitionId}>
                  {league.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Equipe favorite :
            <select value={favoriteTeam} onChange={handleFavoriteTeamChange}>
              <option value="">Selectionner une équipe</option>
              {filteredTeamList.map((team) => (
                <option key={team.clubId} value={team.clubId}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>
          </div>
        </div>
      <div>
        <label>
          Email:
          <input type="email" value={mail} onChange={handleMailChange} required className={mail ? '' : 'required-input'}/>
        </label>
      </div>
      <div>
        <label>
          Mot de passe :
          <input type="password" value={password} onChange={handlePasswordChange} required className={password ? '' : 'required-input'}/>
        </label>
        <small>
          Doit contenir au moins 12 caractères, une minuscule, une majuscule, un chiffre et un caractère spécial.
        </small>
      </div>
      <button type="submit">S'inscrire</button>
      {isModalOpen && (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </div>
      </div>
      )}
    </form>
  );
};

export default RegistrationForm;