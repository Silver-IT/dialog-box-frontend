import {
  GET_COLLECTIONS,
  ADD_NEW_COLLECTION,
  GET_MINT_PRICE,
  UPDATE_COLLECTION,
} from "../../types";

const INITIAL_STATE = {
  collections: [],
};

export const collectionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_COLLECTIONS:
      return {
        ...action.payload,
      };
    case ADD_NEW_COLLECTION:
      const result = { ...state };
      result.collections = result.collections.concat(action.payload.collection);
      return result;
    case UPDATE_COLLECTION:
      let resultState = { ...state };
      for (let i = 0; i < resultState.collections.length; i++) {
        if (resultState.collections[i].address == action.payload.address) {
          resultState.collections[i].logo_uri = action.payload.new_logo_uri;
        }
      }
      return resultState;
    default:
      return state;
  }
};

const MINT_PRICE_STATE = {
  data: null,
};

