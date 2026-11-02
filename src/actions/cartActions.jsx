import axios from 'axios'
import { ADD_TO_CART, REMOVE_ITEM_CART, SAVE_SHIPPING_INFO, CLEAR_CART } from '../constants/cartConstants'

export const addItemToCart = (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`${import.meta.env.VITE_API}/product/${id}`)
    const product = data.product
    if (!product) return

    // Out of stock products cannot be added to the cart
    if (product.stock === 0) {
        return
    }

    const stock = product.stock
    const qty = Math.max(1, Math.min(Number(quantity) || 1, stock))

    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: product._id,
            name: product.name,
            price: product.price,
            image: (product.images && product.images[0]) ? product.images[0].url : null,
            stock,
            quantity: qty
        }
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))

}

export const removeItemFromCart = (id) => async (dispatch, getState) => {
    dispatch({
        type: REMOVE_ITEM_CART,
        payload: id
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    })
    localStorage.setItem('shippingInfo', JSON.stringify(data))
}

export const clearCart = () => async (dispatch) => {
    dispatch({
        type: CLEAR_CART,
    })
}