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

export const getAllAdmins = () => {
    return _Contract.methods.getAllAuthorizedAddresses().call();
};

export const addAdmin = (auth, address) => {
    return _Contract.methods.authorizeAddress(address).send({from: auth.authAddress});
};

export const delAdmin = (auth, address) => {
    return _Contract.methods.unauthorizeAddress(address).send({from: auth.authAddress}); 
}
