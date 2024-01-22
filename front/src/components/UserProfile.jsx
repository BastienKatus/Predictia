import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { faV } from '@fortawesome/free-solid-svg-icons';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const routeParams = useParams();

  useEffect(() => {
    fetch('/users/' + routeParams.id)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) =>
        console.error('Erreur de récupération des informations utilisateurs:', error)
      );
  }, [routeParams.id]);

  const handleChange = (name, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = () => {
    fetch(`/updateUser/${routeParams.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) =>
        console.error('Erreur de mise à jour de l\'utilisateur:', error)
      );
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile-container">
      <h2>Profil</h2>
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
        <label>Equipe favorite:</label>
        <input
          type="text"
          name="favoriteClubId"
          value={user.favoriteClubId}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
      </div>
      <button className="save-button" onClick={handleSave}>
        Enregistrer
      </button>
    </div>
  );
};

export default UserProfile;
