import axios from "axios";
import { GET_ABOUTUS, GET_CHARITY, GET_FAQ, GET_TERMS } from "../../types";
import { API_URL }from "../../../utils/constants"

export const uploadTinyMCEImage = async (formData) => {
    try {
        let response = await axios.post(`${API_URL}/api/tiny_image_upload`, formData)
        return response.data;
    } catch (error) {
        console.log("Upload image Error:", error);
    }
};

export const getAboutus = () => (dispatch) => {
    axios
        .get(`${API_URL}/api/aboutus`)
        .then(response => {
            dispatch({
                type: GET_ABOUTUS,
                payload: {
                    data: response.data.data
                }
            })
        })
};

export const saveAboutus = async (data) => {
    try {
        let response = await axios.post(`${API_URL}/api/aboutus`, data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const getCharity = () => (dispatch) => {
    axios
        .get(`${API_URL}/api/charity`)
        .then(response => {
            dispatch({
                type: GET_CHARITY,
                payload: {
                    data: response.data.data
                }
            })
        })
};

export const saveCharity = async (data) => {
    try {
        let response = await axios.post(`${API_URL}/api/charity`, data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};


export const getFaq = () => (dispatch) => {
    axios
        .get(`${API_URL}/api/faq`)
        .then(response => {
            dispatch({
                type: GET_FAQ,
                payload: {
                    data: response.data.data
                }
            })
        })
};

export const saveFaq = async (data) => {
    try {
        let response = await axios.post(`${API_URL}/api/faq`, data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};


export const getTerms = () => (dispatch) => {
    axios
        .get(`${API_URL}/api/terms`)
        .then(response => {
            dispatch({
                type: GET_TERMS,
                payload: {
                    data: response.data.data
                }
            })
        })
};

export const saveTerms = async (data) => {
    try {
        let response = await axios.post(`${API_URL}/api/terms`, data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};