import { GET_COLLECTIONS, ADD_NEW_COLLECTION } from "../../types";

const INITIAL_STATE = {
    data: []
};

export const collectionReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case GET_COLLECTIONS:
            return {
                ...action.payload
            };
        case ADD_NEW_COLLECTION:
            return {
                data: [...state.data, action.payload.data]
            };    

        default:
            return state;
    }
};