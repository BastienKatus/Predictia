import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faHeart, faCoins } from '@fortawesome/free-solid-svg-icons';

const CardPlayer = ({ card }) => {
  return (
      <div className="card">
      <img className="card-image" src={card.imageUrl} alt={card.name} />
      <div className="card-details">
        <h2>{card.name}</h2>
        <p>
          <strong>Nationalité:</strong> {card.countryOfCitizenship}
        </p>
        <p>
          <strong>Club:</strong> {card.currentClubName}
        </p>
        <p>
          <strong>Position:</strong>{card.position}: {card.subPosition}
        </p>
        <p>
          <strong>Valeur marchande:</strong> Actuelle : {card.marketValueInEur}€, Plus grande : {card.highestMarketValueInEur}€
        </p>
        <p>
          <strong>Taille:</strong> {card.heightInCm}cm, <strong>Pied Fort:</strong> {card.foot}
        </p>
        <p>
          <strong>Naissance:</strong> {card.dateOfBirth}, {card.cityOfBirth}, {card.countryOfBirth}, {card.cityOfBirth}
        </p>
      </div>
    </div>
  );
};

export default CardPlayer;