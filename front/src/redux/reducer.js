import { combineReducers } from "redux"

const initialState = {
    currentUser: null,
    teams: [],
    competitions: []
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOG_IN':
          return {
            ...state,
            currentUser: action.payload
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
        default:
        return state;
    }
};

export default combineReducers({
    userReducer,
    dataReducer
})
