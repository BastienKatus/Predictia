import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faHeart, faCoins } from '@fortawesome/free-solid-svg-icons';

const CardPlayer = ({ card }) => {
  if (!card) {
    return <div className="card-details">Sélectionnez une carte pour voir les détails</div>;
  }

  return (
      <div className="card-details">
        <div className="card-details-top">
          <div className="card-details-energy">
            <FontAwesomeIcon icon={faBolt} /> {card.energy}
          </div>
          <div className>
            <p><strong>{card.name}</strong></p>
          </div>
          <div className="card-details-hp">
            <FontAwesomeIcon icon={faHeart} /> {card.hp}
          </div>
        </div>
        <div className="card-details-image">
          <img src={card.image} alt={card.name} />
        </div>
        <div className="card-details-bottom">
          <div className="card-details-family">
            <p><strong>Description:</strong><br /> {card.description}</p>
            <p><strong>Famille:</strong><br /> {card.family}</p>
            <p><strong>Affinité:</strong><br /> {card.affinity}</p>
          </div>
          <div className="card-details-price">
            <p><FontAwesomeIcon icon={faCoins} /> {card.price}</p>
          </div>
        </div>
      </div>
  );
};

export default CardPlayer;