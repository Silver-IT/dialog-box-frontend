import {
  GET_COLLECTIONS,
  ADD_NEW_COLLECTION,
  GET_MINT_PRICE,
  UPDATE_COLLECTION
} from "../../types";

const INITIAL_STATE = {
  collections: [],
};

export const collectionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_COLLECTIONS:
      return {
        ...action.payload
      };
    case ADD_NEW_COLLECTION:
      const result = { ...state };
      result.collections = result.collections.concat(action.payload.collection);
      return result;
    case UPDATE_COLLECTION:
      // const results = state.collections.filter(collection => {

      // })
      return result;  
    default:
      return state;
  }
};

const MINT_PRICE_STATE = {
  data: null,
};

export const mintPriceReducer = (state = MINT_PRICE_STATE, action) => {
  switch (action.type) {
    case GET_MINT_PRICE:
      return {
        ...action.payload,
      };

    default:
      return state;
  }
};
