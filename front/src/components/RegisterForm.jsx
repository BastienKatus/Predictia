import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {

  const navigate = useNavigate();

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [mail, setMail] = useState('');

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

  function handleRouting() {
    navigate("/login");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    fetch('/auth/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({"username": username,"password": password, "firstname": firstname, "lastname": lastname, "mail": mail}),
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
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input type="email" value={mail} onChange={handleMailChange} />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;