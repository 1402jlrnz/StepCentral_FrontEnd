import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Divider
} from '@mui/material'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MetaData from '../Layout/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import { addItemToCart, removeItemFromCart } from '../../actions/cartActions'
import { formatPrice } from '../Utils/helpers'
import './Checkout.css'

const Cart = () => {
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.cart)
    const navigate = useNavigate()

    const increaseQty = (id, quantity, stock) => {
        const newQty = quantity + 1;
        // Out of stock items cannot be increased
        if (!stock || newQty > stock) return;
        dispatch(addItemToCart(id, newQty))
    }

    const decreaseQty = (id, quantity) => {
        const newQty = quantity - 1;
        if (newQty <= 0) return;
        dispatch(addItemToCart(id, newQty))
    }

    const removeCartItemHandler = (id) => {
        dispatch(removeItemFromCart(id))
        toast.success('Item removed from cart', {
            position: 'bottom-right'
        })
    }

    const checkoutHandler = () => {
        navigate('/login?redirect=shipping')
    }

    const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)
    const totalUnits = cartItems.reduce((acc, item) => (acc + Number(item.quantity)), 0)

    return (
        <>
            <MetaData title={'Your Cart'} />

            {cartItems.length === 0 ? (
                <div className="checkout-page">
                    <div className="checkout-container">
                        <div className="cart-empty">
                            <Box className="cart-empty-icon">
                                <i className="fa fa-shopping-bag" style={{ fontSize: '2rem' }} aria-hidden="true"></i>
                            </Box>
                            <h2>Your Cart is Empty</h2>
                            <p>Browse our collection and find your next pair of kicks.</p>
                            <Link to="/" className="checkout-btn">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="checkout-page">
                    <div className="checkout-container">
                        <Typography variant="h3" className="checkout-title">Your Cart</Typography>
                        <p className="checkout-subtitle">
                            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} ready for checkout
                        </p>

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
                            <Box sx={{ flex: 1 }}>
                                <Card>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Product</TableCell>
                                                    <TableCell align="right">Price</TableCell>
                                                    <TableCell align="center">Quantity</TableCell>
                                                    <TableCell align="right" width={64}></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {cartItems.map(item => (
                                                    <TableRow key={item.product} hover>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <Box
                                                                    component="img"
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    sx={{
                                                                        width: 72,
                                                                        height: 54,
                                                                        objectFit: 'cover',
                                                                        borderRadius: 1,
                                                                        border: '1px solid #262626'
                                                                    }}
                                                                />
                                                                <Box>
                                                                    <Typography
                                                                        component={Link}
                                                                        to={`/product/${item.product}`}
                                                                        sx={{ color: '#fafafa', fontWeight: 700, textDecoration: 'none', '&:hover': { color: '#ff3b3b' } }}
                                                                    >
                                                                        {item.name}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography sx={{ color: '#ff3b3b', fontWeight: 800, whiteSpace: 'nowrap' }}>
                                                                ₱{formatPrice(item.price)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Box className="qty-pill">
                                                                <button className="qty-btn" onClick={() => decreaseQty(item.product, item.quantity)} aria-label="Decrease quantity">−</button>
                                                                <input type="number" className="qty-input" value={item.quantity} readOnly />
                                                                <button className="qty-btn" onClick={() => increaseQty(item.product, item.quantity, item.stock)} aria-label="Increase quantity">+</button>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton
                                                                onClick={() => removeCartItemHandler(item.product)}
                                                                aria-label="Remove item"
                                                                title="Remove item"
                                                                sx={{ color: '#6b6b72', '&:hover': { color: '#ef4444' } }}
                                                            >
                                                                <i className="fa fa-trash" aria-hidden="true"></i>
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Card>
                            </Box>

                            <Box sx={{ width: { xs: '100%', lg: 340 } }}>
                                <Card sx={{ p: 3 }}>
                                    <Typography variant="h5" sx={{ mb: 2 }}>Order Summary</Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                                        <Typography color="text.secondary">Subtotal</Typography>
                                        <Typography fontWeight={700}>{totalUnits} (Units)</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                                        <Typography color="text.secondary">Est. total</Typography>
                                        <Typography sx={{ color: '#ff3b3b' }} fontWeight={700}>₱{formatPrice(totalPrice)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                                        <Typography color="text.secondary">Shipping</Typography>
                                        <Typography fontWeight={700}>Calculated at checkout</Typography>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Button
                                        id="checkout_btn"
                                        variant="contained"
                                        fullWidth
                                        onClick={checkoutHandler}
                                    >
                                        Proceed to Checkout
                                    </Button>
                                    <Button
                                        component={Link}
                                        to="/"
                                        variant="outlined"
                                        fullWidth
                                        sx={{ mt: 1.5 }}
                                    >
                                        Continue Shopping
                                    </Button>
                                </Card>
                            </Box>
                        </Box>
                    </div>
                </div>
            )}
        </>
    )
}

export default Cart
