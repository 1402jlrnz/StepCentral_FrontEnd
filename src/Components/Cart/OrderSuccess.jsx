import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, Button, Zoom, Paper } from '@mui/material'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import MetaData from '../Layout/MetaData'
import { useDispatch } from 'react-redux'
import { clearCart } from '../../actions/cartActions';
import './Checkout.css'

const OrderSuccess = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        localStorage.clear();
        sessionStorage.removeItem('orderInfo')
        dispatch(clearCart());
    }, [dispatch]);

    return (
        <>
            <MetaData title={'Order Success'} />
            <div className="checkout-page">
                <div className="checkout-container">
                    <Paper
                        elevation={0}
                        sx={{
                            maxWidth: 560,
                            mx: 'auto',
                            mt: 6,
                            p: 6,
                            textAlign: 'center',
                            borderRadius: 4,
                            animation: 'fadeInUp 0.6s ease-out'
                        }}
                    >
                        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                            <CheckCircleOutlinedIcon
                                sx={{
                                    fontSize: 96,
                                    color: '#ff3b3b',
                                    mb: 3,
                                    filter: 'drop-shadow(0 0 24px rgba(255,59,59,0.35))'
                                }}
                            />
                        </Zoom>

                        <Typography variant="h4" fontWeight={800} gutterBottom>
                            Order Placed!
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 4 }}>
                            Your order has been placed successfully.
                            A confirmation email with your PDF receipt is on its way.
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                                component={Link}
                                to="/orders/me"
                                variant="contained"
                                size="large"
                            >
                                Go to Orders
                            </Button>
                            <Button
                                component={Link}
                                to="/"
                                variant="outlined"
                                size="large"
                            >
                                Continue Shopping
                            </Button>
                        </Box>
                    </Paper>
                </div>
            </div>
        </>
    )
}

export default OrderSuccess
