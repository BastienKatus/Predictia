import { Outlet, Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';


export default function Root(props) {
  const buyReducer = useSelector(state => state.buyReducer)
  return (
    <>
      <div id="sidebar">
        <nav>
          <ul>
            <li>
                <Link to={`/`}>Accueil</Link>
            </li>
            <li>
                <Link to={`/teams_followed`}>Equipes Suivies</Link>
            </li>
            <li>
                <Link to={`/teams`}>Equipes</Link>
            </li>
            <li>
                <Link to={`/players`}>Joueurs</Link>
            </li>
            <li>
                <Link to={`/simulation`}>Simulation</Link>
            </li>
            <li>
                <Link to={`/login`}>Se connecter</Link>
            </li>
            <li>
                <Link to={`/register`}>S'inscrire</Link>
            </li>
            <p>[USER] : {buyReducer.price}<FontAwesomeIcon icon={faCoins} /></p>
          </ul>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}