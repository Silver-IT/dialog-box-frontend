import { toastOptions } from "../utils/toast";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { GET_AUTH } from "../store/types";
import Web3 from "web3";
import tokenManagerContractABI from "../config/abis/artTokenManager.json";
import { ACCOUNT_TYPE } from "./constants";
import { getChainId } from "./common";

const web3 = new Web3(Web3.givenProvider);
const _Contract = new web3.eth.Contract(
  tokenManagerContractABI.abi,
  process.env.REACT_APP_TOKENMANAGER_CONTRACT_ADDRESS
);

export const connectMetaMask = async (dispatch) => {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(async (accounts) => {
        console.log("eth_accounts:", accounts);
        if (accounts.length > 0) {
          const address = accounts[0];
          const connectedChainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          if (connectedChainId != getChainId().chain_id) {
            let res = switchNetwork(address, dispatch);
            console.log("network different", connectedChainId);
          } else {
            checkAccountType(address, dispatch);
          }
        }
      })
      .catch((err) => {
        if (err.code === 4001) {
          toast.error("Please connect to MetaMask!", toastOptions);
        } else {
          toast.error(err.message, toastOptions);
        }
      });
  } else {
    toast.error("Please install MetaMask!", toastOptions);
  }
};

export const checkIfLoggedIn = (dispatch) => {
  window.ethereum.request({ method: 'eth_accounts' }).then(async (accounts) => {
    console.log("eth_accounts:", accounts);
    if (accounts.length > 0) {
      const address = accounts[0];
      const connectedChainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      if (connectedChainId != getChainId().chain_id) {
        let res = switchNetwork(address, dispatch);
        console.log("network different", connectedChainId);
      } else {
        checkAccountType(address, dispatch);
      }
    }
  })
} 

const switchNetwork = async (address, dispatch) => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: getChainId().chain_id }],
    });
    checkAccountType(address, dispatch);
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: getChainId().chain_id,
              chainName: getChainId().chain_name,
              rpcUrls: [getChainId().rpc_urls],
            },
          ],
        });
        checkAccountType(address, dispatch);
      } catch (addError) {
        toast.error(addError.message, toastOptions);
      }
    }
    toast.error(switchError.message, toastOptions);
  }
};

export const checkAccountType = async (address, dispatch) => {
  let res = await _Contract.methods.owner().call();
  if (res.toLowerCase() == address.toLowerCase()) {
    const data = { authAddress: address, accountType: ACCOUNT_TYPE.OWNER };
    dispatch({
      type: GET_AUTH,
      payload: data,
    });
  } else {
    let res = await _Contract.methods.isAuthorizedUser(address).call();
    if (res) {
      const data = { authAddress: address, accountType: ACCOUNT_TYPE.ADMIN };
      dispatch({
        type: GET_AUTH,
        payload: data,
      });
    } else {
      const data = { authAddress: address, accountType: ACCOUNT_TYPE.NORMAL };
      dispatch({
        type: GET_AUTH,
        payload: data,
      });
    }
  }
};
