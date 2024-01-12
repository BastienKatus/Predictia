import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { saveFollowedTeams } from '../redux/actions';

const FollowTeams = (props) => {
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [teamList, setTeamList] = useState([]);
    const [league, setLeague] = useState('');

    const dataReducer = useSelector(state => state.dataReducer);
    const userReducer = useSelector(state => state.userReducer);
    const routeParams = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
      setTeamList(dataReducer.teams)
      if (userReducer.userId !== -1) {
        fetch('/users/' + routeParams.id)
          .then(response => response.json())
          .then(data => {
            setSelectedTeams(data.followedTeamsId)
          })
          .catch(error => console.error('Erreur lors de la récupération des clubs', error));
      }
    }, []);

    const handleLeagueChange = (event) => {
      setLeague(event.target.value);
    };

    useEffect(() => {
      const filteredTeams = dataReducer.teams.filter(
        (team) => league === '' || team.domesticCompetitionId === league
      );
      setTeamList(filteredTeams);
    }, [league, dataReducer.teams]);

    if (!dataReducer.teams || dataReducer.teams.length === 0) {
        return <div>Aucune équipe disponible</div>;
    }  
    
    function handleRouting(id) {
        navigate("/");
    }

    const toggleTeamSelection = (clubId) => {
        if (selectedTeams.includes(clubId)) {
          setSelectedTeams(selectedTeams.filter(id => id !== clubId));
        } else {
          setSelectedTeams([...selectedTeams, clubId]);
        }
    };

    const toggleSaveSelection = () => {
      dispatch(saveFollowedTeams(selectedTeams));
        fetch('/users/followedteams/' + routeParams.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"followedTeamIds" : selectedTeams}),
          })
          .then(response => response.json())
          .then(json => {
            handleRouting(json.id)
          })
    };

    const teamItems = teamList.map(team => (
        <div
          key={team.clubId}
          className={`team-grid-card${selectedTeams.includes(team.clubId) ? '-selected' : ''}`}
          onClick={() => toggleTeamSelection(team.clubId)}
        >
        <img src={team.logo} alt={team.name} />
        </div>
      ));
    
    return (
      <>
        <div>
          <label htmlFor="league">Sélectionner une ligue :</label>
          <select
            id="league"
            name="league"
            value={league}
            onChange={handleLeagueChange}
          >
            <option value="">Toutes les ligues</option>
            {dataReducer.competitions.map((competition) => (
              <option key={competition.competitionId} value={competition.competitionId}>
                {competition.name}
              </option>
            ))}
          </select>
        </div>
        <div className="team-grid-container">
            <div className="team-grid">
                {teamItems}
            </div>
        </div>
        <div className="center-button-container">
            <button className="follow-teams-button" onClick={toggleSaveSelection}>
              Sauvegarder
            </button>
        </div>
      </>
    );
};

export default FollowTeams;
