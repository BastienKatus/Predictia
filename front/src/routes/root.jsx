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
            <p className="sidebar-label">Données :</p>
            <li>
              <Link to={`/`}>Prochains Matchs</Link>
            </li>
            <li>
              <Link to={`/competitions`}>Compétitions</Link>
            </li>
            <li>
              <Link to={`/teams/all`}>Equipes</Link>
            </li>


            {userReducer.currentUser !== null ? (
                    <>
                    <li className="li-separation">
                      <p className="sidebar-label">Utilisateurs :</p>
                    </li>
                    <li>
                      <Link to={`/simulation`}>Simulation</Link>
                    </li>
                    <li>
                      <Link to={`/teams/followed`}>Equipes Suivies</Link>
                    </li>
                    </>
                ) : (
                    <div className="li-bas">
                    <li >
                      <Link to={`/login`}>Se connecter</Link>
                    </li>
                    <li>
                      <Link to={`/register`}>S'inscrire</Link>
                    </li>
                    </div>
                )
            }
            {userReducer.currentUser !== null && (
              <div className="li-bas">
                <li>
                <Link to={`/profile/${userReducer.userId}`}>Profile<img className="logo-xs" src={userReducer.favoriteClubLogo} /> {userReducer.currentUser}</Link>
                </li>
                <li>
                  <Link onClick={handleLogOut}>Se Déconnecter</Link>
                </li>
              </div>
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