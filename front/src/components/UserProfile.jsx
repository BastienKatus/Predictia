import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { dataReducer } from '../redux/reducer';
import { faV } from '@fortawesome/free-solid-svg-icons';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const routeParams = useParams();
  const [favoriteTeam, setFavoriteTeam] = useState(null);

  useEffect(() => {
    fetch('/users/' + routeParams.id)
        .then(response => response.json())
        .then(data => {
          setUser(data);
        })
        .catch(error => console.error('Erreur de récupération des informations utilisateurs:', error));
  }, []);
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Profil</h2>
      <p>Nom d'utilisateur : {user.username}</p>
      <p>Adresse e-mail : {user.mail}</p>
      <p>Nom : {user.lastname}</p>
      <p>Prénom : {user.firstname}</p>
      <p>Equipe favorite : {user.favoriteClubId}</p>
    </div>
  );
};

export default UserProfile;
