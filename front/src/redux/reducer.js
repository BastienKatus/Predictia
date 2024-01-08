import { combineReducers } from "redux"

const initialState = {
    currentUser: null
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOG_IN':
        return {
            ...state,
            currentUser: action.payload
        };
        default:
        return state;
    }
};

export default combineReducers({
    userReducer,
})
