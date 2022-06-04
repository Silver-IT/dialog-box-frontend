import axios from 'axios';
import { GET_COLLECTIONS, ADD_NEW_COLLECTION } from "../../types";
import Web3 from "web3";
import artTokenContractABI from "../../../config/abis/artToken.json";
import artTokenManagerContractABI from "../../../config/abis/artTokenManager.json"; 
import { REACT_APP_API_URL }from "../../../utils/constants"

const web3 = new Web3(Web3.givenProvider);
const _Contract = new web3.eth.Contract(
    artTokenManagerContractABI.abi,
    process.env.REACT_APP_TOKENMANAGER_CONTRACT_ADDRESS
);

export const getCollections = async (dispatch) => {

    axios
        .get(`${REACT_APP_API_URL}/api/collections`)
        .then(response => {
            dispatch({
                type: GET_COLLECTIONS,
                payload: {
                    data: response.data
                }
            })
        })
};

export const addNewCollection = async (collection, dispatch) => {
    dispatch({
        type: ADD_NEW_COLLECTION,
        payload: {
            data: collection
        }
    })
};

export const deployCollection = async (collection, auth) => {

    let toWei = web3.utils.toWei(collection.mint_price, 'ether');

    await _Contract.methods.deployCollection(collection.title, collection.symbol, collection.init_base_uri, collection.init_logo_uri, collection.max_supply, toWei)
        .send({ from: auth.authAddress}, function(err, transactionHash) {
            return err;
        })
}

export const uploadCollectionImage = async (formData) => {
    let response = await axios.post(`${REACT_APP_API_URL}/api/collection_image_upload`, formData)
    return response.data.file;
};
