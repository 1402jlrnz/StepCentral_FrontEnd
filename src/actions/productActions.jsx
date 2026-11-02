import axios from 'axios';
import {
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_RESET,
    NEW_REVIEW_FAIL,
    GET_REVIEWS_REQUEST,
    GET_REVIEWS_SUCCESS,
    GET_REVIEWS_FAIL,

    CLEAR_ERRORS
} from '../constants/productConstants';

let latestProductsRequestId = 0;

export const getProducts = (currentPage = 1, keyword = '', price, category = '', ratings = 0, reviewFilter = '') => async (dispatch) => {
    const requestId = ++latestProductsRequestId;
    try {
        dispatch({
            type: ALL_PRODUCTS_REQUEST,
            requestId
        })

        let link = `${import.meta.env.VITE_API}/products?page=${currentPage}&keyword=${keyword}&price[lte]=${price[1]}&price[gte]=${price[0]}`

        if (category) {
            link += `&category=${category}`
        }

        if (ratings > 0) {
            link += `&ratings=${ratings}`
        }

        if (reviewFilter) {
            link += `&reviewFilter=${reviewFilter}`
        }

        const { data } = await axios.get(link)
        dispatch({
            type: ALL_PRODUCTS_SUCCESS,
            payload: data,
            requestId
        })

    } catch (error) {
        dispatch({
            type: ALL_PRODUCTS_FAIL,
            payload: error.response?.data?.message || error.message || 'Failed to load products',
            requestId
        })
    }
}

export const getProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST })
        const { data } = await axios.get(`${import.meta.env.VITE_API}/product/${id}`)
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS

    })
}

// Create a review
export const createReview = (reviewData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_REVIEW_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        const { data } = await axios.put(`${import.meta.env.VITE_API}/review`, reviewData, config)
        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: error.response.data.message
        })
    }
}

// Reset review success flag
export const resetNewReview = () => async (dispatch) => {
    dispatch({ type: NEW_REVIEW_RESET })
}

// Get product reviews
export const getProductReviews = (id) => async (dispatch) => {
    try {
        dispatch({ type: GET_REVIEWS_REQUEST })
        const { data } = await axios.get(`${import.meta.env.VITE_API}/reviews?id=${id}`)
        dispatch({
            type: GET_REVIEWS_SUCCESS,
            payload: data.reviews
        })
    } catch (error) {
        dispatch({
            type: GET_REVIEWS_FAIL,
            payload: error.response.data.message
        })
    }
}
