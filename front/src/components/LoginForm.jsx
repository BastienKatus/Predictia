import React, { useState } from 'react';
import { logIn } from '../redux/actions';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';

const LoginForm = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

    fetch('/auth/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({"username": username,"password": password}),
    })
    .then((response) => response.json())
    .then((data) => {
      dispatch(logIn(data.username));
      handleRouting()
    })
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
    </form>
  );
};

export default LoginForm;