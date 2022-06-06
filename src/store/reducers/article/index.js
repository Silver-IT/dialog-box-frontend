import { GET_ABOUTUS, GET_CHARITY, GET_FAQ, GET_TERMS } from "../../types";

const INITIAL_STATE = {
    data: []
};

export const articleReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_ABOUTUS:
            return {
                ...state,
                ...action.payload
            };

        case GET_CHARITY:
            return {
                ...state,
                ...action.payload
            };
        
        case GET_FAQ:
            return {
                ...state,
                ...action.payload
            };

        case GET_TERMS:
            return {
                ...state,
                ...action.payload
            };
    
        default:
            return state;
    }
};