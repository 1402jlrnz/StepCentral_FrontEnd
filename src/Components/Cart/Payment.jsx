import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    InputAdornment,
    Divider
} from '@mui/material'
import MetaData from '../Layout/MetaData'
import CheckoutSteps from './CheckoutSteps'
import { useDispatch, useSelector } from 'react-redux'
import { createOrder, clearErrors } from '../../actions/orderActions'
import { formatPrice } from '../Utils/helpers'
import './Checkout.css'

const Payment = () => {
    const dispatch = useDispatch();
    const { cartItems, shippingInfo } = useSelector(state => state.cart)
    const { error } = useSelector(state => state.newOrder)
    let navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('COD')
    const [gcashNumber, setGcashNumber] = useState('')
    const [gcashName, setGcashName] = useState('')

    useEffect(() => {
        if (error) {
            console.log(error)
            dispatch(clearErrors())
        }

    }, [dispatch, error])

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));

    const submitHandler = async (e) => {
        e.preventDefault();
        document.querySelector('#pay_btn').disabled = true;

        const isCOD = paymentMethod === 'COD'
        const paymentInfo = isCOD
            ? {
                id: `COD-${Date.now()}`,
                status: 'pending',
                method: 'COD'
            }
            : {
                id: `GCASH-${Date.now()}`,
                status: 'succeeded',
                method: 'GCash',
                reference: gcashNumber
            }

        const order = {
            orderItems: cartItems,
            shippingInfo,
            itemsPrice: orderInfo ? orderInfo.itemsPrice : 0,
            shippingPrice: orderInfo ? orderInfo.shippingPrice : 0,
            taxPrice: orderInfo ? orderInfo.taxPrice : 0,
            totalPrice: orderInfo ? orderInfo.totalPrice : 0,
            paymentInfo
        };
        dispatch(createOrder(order))
        navigate('/success')
    }

    return (
        <>
            <MetaData title={'Payment'} />
            <div className="checkout-page">
                <div className="checkout-container">
                    <CheckoutSteps shipping confirmOrder payment />

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box sx={{ width: '100%', maxWidth: 560 }}>
                            <Card>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h4" className="checkout-title" style={{ fontSize: '1.6rem' }}>
                                        Payment Method
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                                        Choose how you'd like to pay.
                                    </Typography>

                                    <form onSubmit={submitHandler}>
                                        <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                                            <RadioGroup
                                                name="payment_method"
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            >
                                                {/* Cash on Delivery */}
                                                <Box
                                                    sx={{
                                                        border: '1px solid',
                                                        borderColor: paymentMethod === 'COD' ? '#ff3b3b' : '#2a2a2a',
                                                        borderRadius: 3,
                                                        p: 2,
                                                        mb: 2,
                                                        bgcolor: paymentMethod === 'COD' ? 'rgba(255, 59, 59, 0.05)' : 'transparent',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        value="COD"
                                                        control={<Radio sx={{ color: '#6b6b72', '&.Mui-checked': { color: '#ff3b3b' } }} />}
                                                        label={
                                                            <Box>
                                                                <Typography fontWeight={700}>Cash on Delivery</Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Pay with cash when your order arrives
                                                                </Typography>
                                                            </Box>
                                                        }
                                                    />
                                                    {paymentMethod === 'COD' && (
                                                        <>
                                                            <Divider sx={{ my: 1 }} />
                                                            <Typography variant="body2" color="text.secondary">
                                                                Our courier will collect the exact amount in cash upon delivery. No advance payment needed.
                                                            </Typography>
                                                        </>
                                                    )}
                                                </Box>

                                                {/* GCash */}
                                                <Box
                                                    sx={{
                                                        border: '1px solid',
                                                        borderColor: paymentMethod === 'GCash' ? '#ff3b3b' : '#2a2a2a',
                                                        borderRadius: 3,
                                                        p: 2,
                                                        bgcolor: paymentMethod === 'GCash' ? 'rgba(255, 59, 59, 0.05)' : 'transparent',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        value="GCash"
                                                        control={<Radio sx={{ color: '#6b6b72', '&.Mui-checked': { color: '#ff3b3b' } }} />}
                                                        label={
                                                            <Box>
                                                                <Typography fontWeight={700}>GCash</Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Pay instantly with your GCash wallet
                                                                </Typography>
                                                            </Box>
                                                        }
                                                    />

                                                    {paymentMethod === 'GCash' && (
                                                        <Box sx={{ mt: 2 }}>
                                                            <Divider sx={{ mb: 2 }} />
                                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                                Send the exact amount to <b>Step Central</b> (0917 555 1234). Enter your GCash details below for verification.
                                                            </Typography>

                                                            <TextField
                                                                label="GCash Account Name"
                                                                id="gcash_name_field"
                                                                fullWidth
                                                                value={gcashName}
                                                                onChange={(e) => setGcashName(e.target.value)}
                                                                placeholder="Juan Dela Cruz"
                                                                required
                                                                sx={{ mb: 2 }}
                                                            />

                                                            <TextField
                                                                label="GCash Number"
                                                                id="gcash_number_field"
                                                                fullWidth
                                                                value={gcashNumber}
                                                                onChange={(e) => setGcashNumber(e.target.value)}
                                                                placeholder="09XX XXX XXXX"
                                                                required
                                                            />

                                                            <Box
                                                                sx={{
                                                                    mt: 2,
                                                                    p: 1.5,
                                                                    borderRadius: 2,
                                                                    border: '1px dashed #2a2a2a',
                                                                    background: '#141414',
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'baseline'
                                                                }}
                                                            >
                                                                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                                                    Amount to pay
                                                                </Typography>
                                                                <Typography variant="h6" sx={{ color: '#ff3b3b', fontWeight: 800 }}>
                                                                    ₱{formatPrice(orderInfo && orderInfo.totalPrice)}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </RadioGroup>
                                        </FormControl>

                                        <Button
                                            id="pay_btn"
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                        >
                                            {paymentMethod === 'COD'
                                                ? 'Place Order'
                                                : `Pay ₱${formatPrice(orderInfo && orderInfo.totalPrice)} with GCash`}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                </div>
            </div>
        </>
    )
}

export default Payment
