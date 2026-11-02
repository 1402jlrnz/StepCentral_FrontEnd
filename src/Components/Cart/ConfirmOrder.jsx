import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Divider
} from '@mui/material'
import MetaData from '../Layout/MetaData'
import CheckoutSteps from './CheckoutSteps'
import { useSelector } from 'react-redux'
import { formatPrice } from '../Utils/helpers'
import './Checkout.css'

const ConfirmOrder = () => {
    let navigate = useNavigate();
    const { cartItems, shippingInfo } = useSelector(state => state.cart)
    const { user } = useSelector(state => state.auth)

    // Calculate Order Prices
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const shippingPrice = itemsPrice > 200 ? 0 : 25
    const taxPrice = Number((0.05 * itemsPrice).toFixed(2))
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2)

    const processToPayment = () => {
        const data = {
            itemsPrice: itemsPrice.toFixed(2),
            shippingPrice,
            taxPrice,
            totalPrice
        }

        sessionStorage.setItem('orderInfo', JSON.stringify(data))
        navigate('/payment')
    }

    return (
        <>
            <MetaData title={'Confirm Order'} />
            <div className="checkout-page">
                <div className="checkout-container">
                    <CheckoutSteps shipping confirmOrder />

                    <Typography variant="h3" className="checkout-title">Confirm Order</Typography>
                    <p className="checkout-subtitle">Review your delivery details and items before payment.</p>

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Card>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h5" sx={{ mb: 2 }}>Shipping Info</Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                        {user && (
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Name</Typography>
                                                <Typography>{user.name}</Typography>
                                            </Box>
                                        )}
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Phone</Typography>
                                            <Typography>{shippingInfo.phoneNo}</Typography>
                                        </Box>
                                        <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Address</Typography>
                                            <Typography>{`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}</Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h5" sx={{ mb: 1 }}>Your Cart Items</Typography>

                                    {cartItems.map(item => (
                                        <Box
                                            key={item.product}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                py: 1.25,
                                                borderBottom: '1px solid #262626',
                                                '&:last-child': { borderBottom: 'none' }
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={item.image}
                                                alt={item.name}
                                                sx={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 1, border: '1px solid #262626' }}
                                            />
                                            <Typography
                                                component={Link}
                                                to={`/product/${item.product}`}
                                                sx={{ flex: 1, color: '#fafafa', fontWeight: 600, textDecoration: 'none', '&:hover': { color: '#ff3b3b' } }}
                                            >
                                                {item.name}
                                            </Typography>
                                            <Typography color="text.secondary" variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                                                {item.quantity} × ₱{formatPrice(item.price)}
                                            </Typography>
                                            <Typography fontWeight={700} sx={{ whiteSpace: 'nowrap', minWidth: 90, textAlign: 'right' }}>
                                                ₱{formatPrice(item.quantity * item.price)}
                                            </Typography>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Box>

                        <Box sx={{ width: { xs: '100%', lg: 340 } }}>
                            <Card sx={{ p: 3, position: { lg: 'sticky' }, top: { lg: 100 } }}>
                                <Typography variant="h5" sx={{ mb: 2 }}>Order Summary</Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
                                    <Typography color="text.secondary">Subtotal</Typography>
                                    <Typography fontWeight={700}>₱{formatPrice(itemsPrice)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
                                    <Typography color="text.secondary">Shipping</Typography>
                                    <Typography fontWeight={700} sx={{ color: shippingPrice === 0 ? '#22c55e' : 'inherit' }}>
                                        {shippingPrice === 0 ? 'FREE' : `₱${formatPrice(shippingPrice)}`}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
                                    <Typography color="text.secondary">Tax</Typography>
                                    <Typography fontWeight={700}>₱{formatPrice(taxPrice)}</Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <Typography variant="h6">Total</Typography>
                                    <Typography variant="h5" sx={{ color: '#ff3b3b', fontWeight: 800 }}>₱{formatPrice(totalPrice)}</Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Button
                                    id="checkout_btn"
                                    variant="contained"
                                    fullWidth
                                    onClick={processToPayment}
                                >
                                    Proceed to Payment
                                </Button>
                            </Card>
                        </Box>
                    </Box>
                </div>
            </div>
        </>
    )
}

export default ConfirmOrder
