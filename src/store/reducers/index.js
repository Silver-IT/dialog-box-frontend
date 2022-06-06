import { combineReducers } from "redux";
import { authReducer } from "./auth";
import { collectionReducer, mintPriceReducer } from "./collection";
import { nftReducer } from "./nft";
import { articleReducer } from "./article";
import { adminReducer } from "./admin";

const reducers = combineReducers({
  authReducer,
  collectionReducer,
  mintPriceReducer,
  nftReducer,
  articleReducer,
  adminReducer,
});

export default reducers;
