import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

const FollowTeams = (props) => {
    const [selectedTeams, setSelectedTeams] = useState([]);

    const dataReducer = useSelector(state => state.dataReducer);
    const routeParams = useParams();
    const navigate = useNavigate();

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
        /*fetch('/user/' + routeParams.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"favoriteClubId" : favoriteTeam, "username": username,"password": password, "firstname": firstname, "lastname": lastname, "mail": mail}),
          })
          .then(response => response.json())
          .then(json => {
            console.log(json.id)
            handleRouting()
          })*/
    };

    const teamItems = dataReducer.teams.map(team => (
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
