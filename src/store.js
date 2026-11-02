import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';

import {
    productsReducer,
    productDetailsReducer,
    newProductReducer,
    newReviewReducer,
    productReviewsReducer,
    reviewReducer,

} from './reducers/productReducers'
import {
    authReducer,
    userReducer,
    forgotPasswordReducer,
    allUsersReducer,
    userDetailsReducer,
} from './reducers/userReducers'

import { cartReducer } from './reducers/cartReducers';
import {
    newOrderReducer,
    myOrdersReducer,
    orderDetailsReducer,
    allOrdersReducer,
    updateOrderReducer,
    deleteOrderReducer,
    cancelOrderReducer,
} from './reducers/orderReducers'

let initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingInfo: localStorage.getItem('shippingInfo')
            ? JSON.parse(localStorage.getItem('shippingInfo'))
            : {}
    },
    user: {},
    auth: {
        user: typeof window !== 'undefined' && sessionStorage.getItem('user')
            ? JSON.parse(sessionStorage.getItem('user'))
            : null,
        isAuthenticated: typeof window !== 'undefined' && !!sessionStorage.getItem('token'),
        loading: false
    },
}

const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    auth: authReducer,
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
    newProduct: newProductReducer,
    cart: cartReducer,
    newReview: newReviewReducer,
    productReviews: productReviewsReducer,
    review: reviewReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    allOrders: allOrdersReducer,
    updateOrder: updateOrderReducer,
    deleteOrder: deleteOrderReducer,
    cancelOrder: cancelOrderReducer,
})

const middlware = [thunk]
const store = createStore(reducer, initialState, applyMiddleware(...middlware))
export default store;
