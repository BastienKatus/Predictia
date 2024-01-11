import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

const RegistrationForm = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dataReducer = useSelector(state => state.dataReducer)

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [mail, setMail] = useState('');
  const [favoriteTeam, setFavoriteTeam] = useState('');
  const [teamList, setTeamList] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [leagueList, setLeagueList] = useState([
    { id: 1, name: 'Premier League' },
    { id: 2, name: 'La Liga' },
    { id: 3, name: 'Bundesliga' },
    { id: 4, name: 'Serie A' },
    { id: 5, name: 'Ligue 1' },
  ]);

  useEffect(() => {
    setTeamList(dataReducer.teams)
  }, []);

  useEffect(() => {
    setLeagueList(dataReducer.competitions);
  }, [dataReducer.competitions]);

  useEffect(() => {
    if (selectedLeague) {
      const filteredTeams = dataReducer.teams.filter(
        (team) => team.domesticCompetitionId === selectedLeague
      );
      setTeamList(filteredTeams);
    } else {
      setTeamList([]);
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
        handleRouting(json.id)
      })

      setFirstname('');
      setLastname('');
      setPassword('');
      setMail('');
      setUsername('');
      setFavoriteTeam('');
    }
    else{
      console.log('Le mot de passe est incorrect')
      setPassword('');
    }
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
          Nom d'Utilisateur : *
          <input type="text" value={username} onChange={handleUsernameChange} required className={username ? '' : 'required-input'}/>
        </label>
      </div>
      <div className="label-group">
      <div>
          <label>
            Ligue :
            <select value={selectedLeague} onChange={handleLeagueChange}>
              <option value="">Select a league</option>
              {leagueList.map((league) => (
                <option key={league.competitionId} value={league.competitionId}>
                  {league.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Equipe favorite :
            <select value={favoriteTeam} onChange={handleFavoriteTeamChange}>
              <option value="">Selectionner une équipe</option>
              {teamList.map((team) => (
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
          Email: *
          <input type="email" value={mail} onChange={handleMailChange} required className={mail ? '' : 'required-input'}/>
        </label>
      </div>
      <div>
        <label>
          Mot de passe : *
          <input type="password" value={password} onChange={handlePasswordChange} required className={password ? '' : 'required-input'}/>
        </label>
        <small>
          Doit contenir au moins 12 caractères, dont au moins une minuscule, une majuscule, un chiffre et un caractère spécial.
        </small>
      </div>
      <button type="submit">S'inscire</button>
    </form>
  );
};

export default RegistrationForm;