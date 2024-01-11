export const logIn = (username) => ({
    type: 'LOG_IN',
    payload: username
});
  
export const logOut = () => ({
  type: 'LOG_OUT'
});
  
export const getTeams = (teams) => ({
  type: 'GET_TEAMS',
  payload: teams
});

export const getCompetitions = (competitions) => ({
  type: 'GET_COMPETITIONS',
  payload: competitions
});

