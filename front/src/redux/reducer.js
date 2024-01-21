import { combineReducers } from "redux"

const initialState = {
    currentUser: null,
    userId: -1,
    followedTeams: [],
    teams: [],
    matches: [],
    competitions: []
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOG_IN':
          return {
            ...state,
            currentUser: action.payload,
            userId: action.userId,
            followedTeams: action.followteams
          };
        case 'SAVE_FOLLOWED_TEAMS':
          return {
            ...state,
            followedTeams: action.payload
          };
        case 'LOG_OUT':
          return {
            ...state,
            currentUser: null
          };  
        default:
        return state;
    }
};

export const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_TEAMS':
          return {
            ...state,
            teams: action.payload
          };
        case 'GET_COMPETITIONS':
          return {
            ...state,
            competitions: action.payload
          };
          case 'GET_MATCHES':
            return {
              ...state,
              matches: action.payload
            };
        default:
        return state;
    }
};

export default combineReducers({
    userReducer,
    dataReducer
})
