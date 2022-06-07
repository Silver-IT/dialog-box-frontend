import axios from "axios";
import { SAVE_NEW_NFT, GET_NFTS } from "../../types";
import { API_URL } from "../../../utils/constants.js";
import Collection from "../../../screens/Collection";

export const uploadImage = async (formData) => {
  return axios.post(`${API_URL}/api/file_upload`, formData);
};

export const removeImage = (url) => {
  return axios.post(`${API_URL}/api/file_remove`, { url: url });
};

export const saveNFT = (data) => {
  return axios.post(`${API_URL}/api/nft`, data);
};

export const getNFTs = (collectionAddress) => {
  let requestUrl = `${API_URL}/api/nfts`;
  if (collectionAddress) {
    requestUrl += `?collectionAddress=${collectionAddress}`;
  }
  return axios.get(requestUrl);
};
