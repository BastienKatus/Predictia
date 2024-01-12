import React, { useState } from 'react';
import { logIn } from '../redux/actions';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import './css/signup.css';

const LoginForm = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  function handleRouting() {
    navigate("/");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    fetch('/auth/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({"username": username,"password": password}),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Nom d\'utilisateur ou mot de passe incorrect.'); // or you can use response.status to provide a more specific error message
        }
        return response.json();
    })
    .then((data) => {
        dispatch(logIn(data.username, data.id, data.followedTeamsId));
        setSuccess("Connexion réussie !");
        setTimeout(() => {
            handleRouting();
        }, 2000);
    })
    .catch((error) => {
        setError('Erreur : ' + error.message); // Handle the error state here
    });
  };


  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div>
        <label>
        Nom d'Utilisateur :
          <input type="text" value={username} onChange={handleUsernameChange} required />
        </label>
      </div>
      <div>
        <label>
          Mot de passe :
          <input type="password" value={password} onChange={handlePasswordChange} required />
        </label>
      </div>
      <button type="submit">Se connecter</button>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </form>
  );
};

export default LoginForm;