import { GET_AUTH } from "../../types";

const INITIAL_STATE = {
    data: {
        authAddress: null,
        accountType: null
    }
};

export const authReducer = (state = INITIAL_STATE, action) => {
    
    switch (action.type) {
        case GET_AUTH:
            return {
                ...state,
                ...action.payload
            };

        default:
            return state;
    }
};