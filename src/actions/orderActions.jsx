import axios from 'axios'
import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAIL,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
    MY_ORDERS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_SUCCESS,
    ALL_ORDERS_FAIL,
    UPDATE_ORDER_REQUEST,
    UPDATE_ORDER_SUCCESS,
    UPDATE_ORDER_RESET,
    UPDATE_ORDER_FAIL,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_SUCCESS,
    DELETE_ORDER_RESET,
    DELETE_ORDER_FAIL,
    CANCEL_ORDER_REQUEST,
    CANCEL_ORDER_SUCCESS,
    CANCEL_ORDER_FAIL,
    CLEAR_ERRORS
} from '../constants/orderConstants'

export const createOrder = (order) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_ORDER_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }
        const { data } = await axios.post(`${import.meta.env.VITE_API}/order/new`, order, config)
        dispatch({
            type: CREATE_ORDER_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: CREATE_ORDER_FAIL,
            payload: error?.response?.data?.message || 'Failed to create order'
        })
    }
}

export const myOrders = () => async (dispatch) => {
    try {
        dispatch({ type: MY_ORDERS_REQUEST });
        const { data } = await axios.get(`${import.meta.env.VITE_API}/orders/me`, { withCredentials: true })
        dispatch({
            type: MY_ORDERS_SUCCESS,
            payload: data.orders
        })
    } catch (error) {
        dispatch({
            type: MY_ORDERS_FAIL,
            payload: error?.response?.data?.message || 'Failed to load orders'
        })
    }
}

export const getOrderDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST });
        const { data } = await axios.get(`${import.meta.env.VITE_API}/order/${id}`, { withCredentials: true })
        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data.order
        })
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error?.response?.data?.message || 'Failed to load orders'
        })
    }
}

export const allOrders = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_ORDERS_REQUEST });
        const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/orders`, { withCredentials: true })
        dispatch({
            type: ALL_ORDERS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: ALL_ORDERS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const updateOrder = (id, orderData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_ORDER_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }
        const { data } = await axios.put(`${import.meta.env.VITE_API}/admin/order/${id}`, orderData, config)
        dispatch({
            type: UPDATE_ORDER_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: UPDATE_ORDER_FAIL,
            payload: error?.response?.data?.message || 'Update failed'
        })
    }
}

export const deleteOrder = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_ORDER_REQUEST })
        const { data } = await axios.delete(`${import.meta.env.VITE_API}/admin/order/${id}`, { withCredentials: true })
        dispatch({
            type: DELETE_ORDER_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: DELETE_ORDER_FAIL,
            payload: error?.response?.data?.message || 'Delete failed'
        })
    }
}

export const cancelOrder = (id) => async (dispatch) => {
    try {
        dispatch({ type: CANCEL_ORDER_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }
        const { data } = await axios.put(`${import.meta.env.VITE_API}/order/${id}/cancel`, {}, config)
        dispatch({
            type: CANCEL_ORDER_SUCCESS,
            payload: data.order
        })
    } catch (error) {
        dispatch({
            type: CANCEL_ORDER_FAIL,
            payload: error?.response?.data?.message || 'Cancel failed'
        })
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}