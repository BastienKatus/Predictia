import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

const FollowTeams = (props) => {
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [teamList, setTeamList] = useState([]);
    const [league, setLeague] = useState('');
    const [filter, setFilter] = useState('');

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

    const handleFilterChange = (event) => {
      setFilter(event.target.value);
      const filteredTeams = dataReducer.teams.filter(
        (team) => team.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setTeamList(filteredTeams);
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
        <h1>Suivez vos équipes préférées</h1>
        <div className='filters'>
          <label htmlFor="league">Ligue :</label>
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
          <label htmlFor="filter">Nom :</label>
          <input
            type="text"
            id="filter"
            name="filter"
            value={filter}
            onChange={handleFilterChange}
          />
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
