import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

const FollowTeams = (props) => {
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [teamList, setTeamList] = useState([]);
    const [league, setLeague] = useState('');

    const dataReducer = useSelector(state => state.dataReducer);
    const routeParams = useParams();
    const navigate = useNavigate();

    useEffect(() => {
      setTeamList(dataReducer.teams)
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
        fetch('/users/followedteams/' + routeParams.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedTeams),
          })
          .then(response => console.log(response))
          .then(json => {
            console.log(json.id)
            handleRouting()
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
