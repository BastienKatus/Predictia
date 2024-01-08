import { combineReducers } from "redux"

const initial = {
    price: 0,
}
export const buyReducer=(state=initial, action) => {
    const{type, payload} = action
    switch(type){
        case "buy":
            return {
                price: state.price+payload.price
            }
        case "sell":
            return{
                price: state.price-payload.price
            }
        default:
            return state
    }
}

export default combineReducers({
    buyReducer,
})