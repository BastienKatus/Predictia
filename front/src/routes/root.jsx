import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { logOut } from '../redux/actions';


export default function Root(props) {
  const userReducer = useSelector(state => state.userReducer)
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogOut = () => {
    dispatch(logOut());
    navigate('/');
  };


  return (
    <>
      <div id="sidebar">
        <nav>
          <ul>
            <li>
              <Link to={`/`}>Accueil</Link>
            </li>
            {userReducer.currentUser !== null && 
            <li>
              <Link to={`/teams_followed`}>Equipes Suivies</Link>
            </li>
            }
            <li>
              <Link to={`/teams`}>Equipes</Link>
            </li>
            <li>
              <Link to={`/players`}>Joueurs</Link>
            </li>

            {userReducer.currentUser !== null ? (
                    <>
                    <li>
                      <Link to={`/simulation`}>Simulation</Link>
                    </li>
                    </>
                ) : (
                    <>
                    <li>
                      <Link to={`/login`}>Se connecter</Link>
                    </li>
                    <li>
                      <Link to={`/register`}>S'inscrire</Link>
                    </li>
                    </>
                )
            }
            {userReducer.currentUser !== null && (
              <>
              <li>
                <Link onClick={handleLogOut}>Se Déconnecter</Link>
              </li>
              <p><FontAwesomeIcon icon={faUser} /> {userReducer.currentUser}</p>
              </>
            )}
          </ul>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}