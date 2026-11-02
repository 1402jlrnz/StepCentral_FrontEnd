import axios from 'axios'
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    CLEAR_ERRORS
} from '../constants/userConstants'

import { authenticate, getToken } from '../Components/Utils/helpers'
import { CLEAR_CART } from '../constants/cartConstants'

const API = import.meta.env.VITE_API || 'http://localhost:4001/api/v1';

export const register = (userData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
        }
        const { data } = await axios.post(`${API}/register`, userData, config)

        authenticate(data, () => { })

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user
        })
    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }

        const { data } = await axios.post(`${API}/login`, { email, password }, config)

        authenticate(data, () => { })

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.user
        })
    } catch (error) {
        console.error('Login error details:', error);
        const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Login failed';
        dispatch({
            type: LOGIN_FAIL,
            payload: message
        })
    }
}

// Login/register through Firebase Authentication (email + password)
// The backend verifies the Firebase ID token and issues the store JWT.
export const firebaseLogin = (idToken, name) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }

        const { data } = await axios.post(`${API}/firebase-auth`, { idToken, name }, config)

        authenticate(data, () => { })

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.user
        })
    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : 'Firebase login failed'
        })
    }
}

export const logout = () => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        }
        await axios.get(`${API}/logout`, config)
    } catch (error) {
        // Ignore logout API errors — still clear local session below
    }

    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        // Clear cart so the next login doesn't inherit the previous user's cart
        localStorage.removeItem('cartItems');
        localStorage.removeItem('shippingInfo');
    }

    dispatch({
        type: CLEAR_CART,
    })
    dispatch({
        type: LOGOUT_SUCCESS,
    })
}

export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post(`${API}/password/forgot`, email, config)
        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }

}

export const updatePassword = (passwords) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PASSWORD_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
        }
        const { data } = await axios.put(`${API}/password/update`, passwords, config)
        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}

export const loadUser = () => async (dispatch) => {
    try {
        const token = getToken();
        if (!token) {
            dispatch({ type: LOAD_USER_FAIL, payload: null })
            return;
        }

        dispatch({ type: LOAD_USER_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true,
        }
        const { data } = await axios.get(`${API}/me`, config)

        if (typeof window !== 'undefined' && data.user) {
            sessionStorage.setItem('user', JSON.stringify(data.user));
        }

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user
        })
    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response?.data?.message || null
        })
    }
}

export const updateProfile = (userData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_PROFILE_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
        }
        const { data } = await axios.put(`${API}/me/update`, userData, config)
        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response.data.message
        })
    }

}

export const allUsers = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_USERS_REQUEST })
        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            withCredentials: true,
        }
        const { data } = await axios.get(`${API}/admin/users`, config)
        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.users
        })
    } catch (error) {
        dispatch({
            type: ALL_USERS_FAIL,
            payload: error?.response?.data?.message || 'Failed to load users'
        })
    }
}

export const updateUser = (id, userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_USER_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            withCredentials: true,
        }
        const { data } = await axios.put(`${API}/admin/user/${id}`, userData, config)
        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error?.response?.data?.message || 'Update failed'
        })
    }
}

export const deleteUser = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_USER_REQUEST })
        const config = {
            withCredentials: true,
        }
        const { data } = await axios.delete(`${API}/admin/user/${id}`, config)
        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error?.response?.data?.message || 'Delete failed'
        })
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}
