import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, TextField, MenuItem, Button } from '@mui/material'
import MetaData from '../Layout/MetaData'
import CheckoutSteps from './CheckoutSteps'
import { useDispatch, useSelector } from 'react-redux'
import { saveShippingInfo } from '../../actions/cartActions'
import './Checkout.css'

const Shipping = () => {
    const dispatch = useDispatch();
    const { shippingInfo } = useSelector(state => state.cart)

    const [address, setAddress] = useState(shippingInfo.address || '')
    const [city, setCity] = useState(shippingInfo.city || '')
    const [postalCode, setPostalCode] = useState(shippingInfo.postalCode || '')
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || '')
    const [country, setCountry] = useState(shippingInfo.country || '')
    let navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault()

        dispatch(saveShippingInfo({ address, city, phoneNo, postalCode, country }))
        navigate('/confirm')
    }

    return (
        <>
            <MetaData title={'Shipping Info'} />
            <div className="checkout-page">
                <div className="checkout-container">
                    <CheckoutSteps shipping />

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box sx={{ width: '100%', maxWidth: 560 }}>
                            <Card>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h4" className="checkout-title" style={{ fontSize: '1.6rem' }}>
                                        Shipping Info
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                                        Where should we deliver your kicks?
                                    </Typography>

                                    <form onSubmit={submitHandler}>
                                        <TextField
                                            label="Address"
                                            id="address_field"
                                            fullWidth
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Street, barangay, unit"
                                            required
                                            sx={{ mb: 2 }}
                                        />

                                        <TextField
                                            label="City / Municipality"
                                            id="city_field"
                                            fullWidth
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="e.g. Quezon City"
                                            required
                                            sx={{ mb: 2 }}
                                        />

                                        <TextField
                                            label="Phone No"
                                            id="phone_field"
                                            type="tel"
                                            fullWidth
                                            value={phoneNo}
                                            onChange={(e) => setPhoneNo(e.target.value)}
                                            placeholder="09XX XXX XXXX"
                                            required
                                            sx={{ mb: 2 }}
                                        />

                                        <TextField
                                            label="Postal Code"
                                            id="postal_code_field"
                                            fullWidth
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            placeholder="e.g. 1100"
                                            required
                                            sx={{ mb: 2 }}
                                        />

                                        <TextField
                                            select
                                            label="Country"
                                            id="country_field"
                                            fullWidth
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            required
                                            sx={{ mb: 3 }}
                                        >
                                            <MenuItem value="">Select Country</MenuItem>
                                            <MenuItem value="Philippines">Philippines</MenuItem>
                                            <MenuItem value="United States">United States</MenuItem>
                                            <MenuItem value="Canada">Canada</MenuItem>
                                            <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                                            <MenuItem value="Australia">Australia</MenuItem>
                                            <MenuItem value="Germany">Germany</MenuItem>
                                            <MenuItem value="France">France</MenuItem>
                                            <MenuItem value="Japan">Japan</MenuItem>
                                            <MenuItem value="Singapore">Singapore</MenuItem>
                                        </TextField>

                                        <Button
                                            id="shipping_btn"
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                        >
                                            CONTINUE
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

export default Shipping
