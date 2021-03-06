import axios from "axios";
import {
  GET_COLLECTIONS,
  ADD_NEW_COLLECTION
} from "../../types";
import Web3 from "web3";
import artTokenContractABI from "../../../config/abis/artToken.json";
import artTokenManagerContractABI from "../../../config/abis/artTokenManager.json";
import { API_URL } from "../../../utils/constants";
import { toastOptions } from "../../../utils/toast";
import { toast } from "react-toastify";

const web3 = new Web3(Web3.givenProvider);
const _Contract = new web3.eth.Contract(
  artTokenManagerContractABI.abi,
  process.env.REACT_APP_TOKENMANAGER_CONTRACT_ADDRESS
);

export const getCollections = async (dispatch) => {
  axios.get(`${API_URL}/api/collections`).then((response) => {
    if (response.data.success) {
      dispatch({
        type: GET_COLLECTIONS,
        payload: {
          collections: response.data.result,
        },
      });
    }
  });
};

export const addNewCollection = async (collection, dispatch) => {
  dispatch({
    type: ADD_NEW_COLLECTION,
    payload: {
      collection: collection,
    },
  });
};

export const deployCollection = async (collection, auth) => {
  let toWei = web3.utils.toWei(collection.mint_price, "ether");

  return _Contract.methods
    .deployCollection(
      collection.title,
      collection.symbol,
      collection.base_uri,
      collection.logo_uri,
      collection.max_supply,
      toWei
    )
    .send({ from: auth.authAddress });
};

export const updateCollection = async (collection, auth) => {
  const web3 = new Web3(Web3.givenProvider);
  const _Contract = new web3.eth.Contract(
    artTokenContractABI.abi,
    collection.address
  );

  return _Contract.methods
    .setLogoURI(collection.logo_uri)
    .send({ from: auth.authAddress });
};

export const uploadCollectionImage = (formData) => {
  return axios.post(`${API_URL}/api/collection_image_upload`, formData);
};

