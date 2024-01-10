import React, { useState, useEffect } from 'react';
import { getTeams } from '../redux/actions';
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

  useEffect(() => {
    if(dataReducer.teams.length === 0){
      fetch('/soccerManager/clubs')
        .then(response => response.json())
        .then(data => {
          dispatch(getTeams(data));
          setTeamList(data)
        })
        .catch(error => console.error('Erreur lors de la récupération des clubs', error));
    }
    else{
      setTeamList(dataReducer.teams)
    }
  }, []);

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

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  function handleRouting() {
    navigate("/login");
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
      .then((response) => {
        if (response.ok) {
          handleRouting()
        }
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
          Doit contenir au moins 8 caractères, dont au moins une minuscule, une majuscule et un chiffre.
        </small>
      </div>
      <button type="submit">S'inscire</button>
    </form>
  );
};

export default RegistrationForm;