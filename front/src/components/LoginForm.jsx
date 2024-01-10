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

    console.log('hello')

    fetch('/auth/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({"username": username,"password": password}),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.username);
      dispatch(logIn(data.username));
      handleRouting()
    })
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div>
        <label>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;