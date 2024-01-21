export const logIn = (username, id, followedTeams) => ({
    type: 'LOG_IN',
    payload: username,
    userId: id,
    followteams: followedTeams
});
  
export const logOut = () => ({
  type: 'LOG_OUT'
});
  
export const getTeams = (teams) => ({
  type: 'GET_TEAMS',
  payload: teams
});
  
export const getMatches = (matches) => ({
  type: 'GET_MATCHES',
  payload: matches
});


export const getCompetitions = (competitions) => ({
  type: 'GET_COMPETITIONS',
  payload: competitions
});

export const saveFollowedTeams = (followedTeams) => ({
  type: 'SAVE_FOLLOWED_TEAMS',
  payload: followedTeams
});

