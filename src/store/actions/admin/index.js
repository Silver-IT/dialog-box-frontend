import axios from "axios";
import { GET_ALL_ADMINS } from "../../types";
import Web3 from "web3";
import { toast } from "react-toastify";
import { toastOptions } from "../../../utils/toast";
import tokenManagerContractABI from "../../../config/abis/artTokenManager.json";

const web3 = new Web3(Web3.givenProvider);
const _Contract = new web3.eth.Contract(
    tokenManagerContractABI.abi,
    process.env.REACT_APP_TOKENMANAGER_CONTRACT_ADDRESS
);

export const getAllAdmins = async (dispatch) => {
    let res = await _Contract.methods.getAllAuthorizedAddresses().call();
    if(res){
        dispatch({
            type: GET_ALL_ADMINS,
            payload: {
                data: res
            }
        });
    }  
};

export const addAdmin = async (auth, address) => {
    await _Contract.methods.authorizeAddress(address).send({from: auth.authAddress}, function(err, transactionHash) {
        return err;
    })
};

export const delAdmin = async (auth, address) => {
    await _Contract.methods.unauthorizeAddress(address).send({from: auth.authAddress}, function(err, transactionHash) {
        return err;
    })
}
