import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { faV } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';

const UserProfile = ({ userId }) => {
    const userReducer = useSelector(state => state.userReducer)
    const dataReducer = useSelector(state => state.dataReducer)

    const [user, setUser] = useState(null);
    const routeParams = useParams();
    const [teamList, setTeamList] = useState([]);
    const [favoriteTeam, setFavoriteTeam] = useState([]);
    const [filteredTeamList, setFilteredTeamList] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState('');
    const [leagueList, setLeagueList] = useState([]);

    useEffect(() => {
        fetch('/users/' + routeParams.id)
            .then((response) => response.json())
            .then((data) => {
                setUser(data);
            })
            .catch((error) =>
                console.error('Erreur de récupération des informations utilisateurs:', error)
            );
    }, [routeParams.id]);

    useEffect(() => {
        fetch('/soccerManager/clubs/BigLeagueOnly')
            .then(response => response.json())
            .then(data => {
                setTeamList(data);
            })
            .catch(error => console.error('Erreur lors de la récupération des compétitions', error));
    }, []);

    useEffect(() => {
        const filteredCompetitions = dataReducer.competitions.filter(
            (league) => league.competitionId === 'ES1' || league.competitionId === 'FR1' || league.competitionId === 'NL1' || league.competitionId === 'PO1' || league.competitionId === 'IT1' || league.competitionId === 'L1' || league.competitionId === 'GB1'
        );
        setLeagueList(filteredCompetitions);

    }, [dataReducer.competitions]);

    useEffect(() => {
        if (selectedLeague === "") {
            setFilteredTeamList(dataReducer.teams)
        }
        else {
            const filteredTeams = teamList.filter(
                (team) => selectedLeague !== '' && team.domesticCompetitionId === selectedLeague
            );
            setFilteredTeamList(filteredTeams);
        }
        if (selectedLeague === "" && teamList.length > 0) {
            // Sélectionnez automatiquement la ligue si elle n'est pas sélectionnée et que la liste des équipes est disponible
            const teamLeagueId = user?.favoriteClubId ? teamList.find(team => team.clubId === user.favoriteClubId)?.domesticCompetitionId : null;
            if (teamLeagueId) {
                setSelectedLeague(teamLeagueId);
            }
        }
    }, [teamList, selectedLeague, user?.favoriteClubId]);
    
    useEffect(() => {
        if (selectedLeague === "") {
            setFilteredTeamList(dataReducer.teams)
        }
        else {
            const filteredTeams = teamList.filter(
                (team) => selectedLeague !== '' && team.domesticCompetitionId === selectedLeague
            );
            setFilteredTeamList(filteredTeams);
        }
    }, []);

    const handleChange = (name, value) => {
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleLeagueChange = (e) => {
        setSelectedLeague(e.target.value);
    };

    const handleSave = () => {
        fetch(`/updateUser/${routeParams.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
            .then((response) => response.json())
            .then((data) => {
                setUser(data);
            })
            .catch((error) =>
                console.error('Erreur de mise à jour de l\'utilisateur:', error)
            );
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-profile-container">
            <h2><img className="logo-xl" src={userReducer.favoriteClubLogo} />Profil</h2>
            <div className="form-group">
                <label>Nom d'utilisateur:</label>
                <input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Adresse e-mail:</label>
                <input
                    type="text"
                    name="mail"
                    value={user.mail}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Nom:</label>
                <input
                    type="text"
                    name="lastname"
                    value={user.lastname}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Prénom:</label>
                <input
                    type="text"
                    name="firstname"
                    value={user.firstname}
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
            </div><div className="form-group">
                <div>
                    <label>
                        Ligue :
                        <select value={selectedLeague} onChange={handleLeagueChange}>
                            <option value="">Toutes les ligues</option>
                            {leagueList.map((league) => (
                                <option key={league.competitionId} value={league.competitionId}>
                                    {league.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Equipe favorite :
                        <select value={user.favoriteClubId} onChange={(e) => handleChange(e.target.name, e.target.value)}>
                            <option value="">Selectionner une équipe</option>
                            {filteredTeamList.map((team) => (
                                <option key={team.clubId} value={team.clubId}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>
            <button className="save-button" onClick={handleSave}>
                Enregistrer
            </button>
        </div>
    );
};

export default UserProfile;
