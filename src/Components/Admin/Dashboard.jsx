import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    Grid
} from '@mui/material'

import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import Sidebar from './SideBar'
import { getToken } from '../Utils/helpers';
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductSalesChart from './ProductSalesChart';
import UserSalesChart from './UserSalesChart';
import MonthlySalesChart from './MonthlySalesChart';
import SalesChart from './SalesChart';

const Dashboard = () => {
    const [products, setProducts] = useState([])
    const [ordersCount, setOrdersCount] = useState(0)
    const [usersCount, setUsersCount] = useState(0)
    const [totalSales, setTotalSales] = useState(0)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    let outOfStock = 0;
    products.forEach(product => {
        if (product.stock === 0) {
            outOfStock += 1;
        }
    })
    const getAdminProducts = async () => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/products`, config)
            setProducts(data.products)
            setLoading(false)
        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to load dashboard data')
        }
    }

    const loadDashboardStats = async () => {
        try {
            const config = { headers: { 'Authorization': `Bearer ${getToken()}` } }
            const [orders, users, sales] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API}/admin/orders`, { ...config, withCredentials: true }),
                axios.get(`${import.meta.env.VITE_API}/admin/users`, { ...config, withCredentials: true }),
                axios.get(`${import.meta.env.VITE_API}/admin/total-sales`, { ...config, withCredentials: true })
            ])
            setOrdersCount(orders.data.orders ? orders.data.orders.length : 0)
            setUsersCount(users.data.users ? users.data.users.length : 0)
            setTotalSales(sales.data.totalSales && sales.data.totalSales[0] ? sales.data.totalSales[0].totalSales : 0)
        } catch (err) {
            // Stats are supplementary — don't block the dashboard
            console.log('Dashboard stats unavailable:', err?.message)
        }
    }

    useEffect(() => {
        getAdminProducts()
        loadDashboardStats()
    }, [])

    const stats = [
        {
            title: 'Products',
            value: products ? products.length : 0,
            to: '/admin/products',
            accent: '#4285f4'
        },
        {
            title: 'Orders',
            value: ordersCount,
            to: '/admin/orders',
            accent: '#ff3b3b'
        },
        {
            title: 'Users',
            value: usersCount,
            to: '/admin/users',
            accent: '#a855f7'
        },
        {
            title: 'Total Sales',
            value: `₱${Number(totalSales).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            to: '/admin/orders',
            accent: '#22c55e'
        },
        {
            title: 'Out of Stock',
            value: outOfStock,
            to: '/admin/products',
            accent: '#f59e0b'
        }
    ]

    return (
        <>
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <Typography variant="h4" fontWeight={800} sx={{ my: 3, px: 2 }}>
                        Dashboard
                    </Typography>
                    {loading ? <Loader /> : (
                        <>
                            <MetaData title={'Admin Dashboard'} />
                            <Box sx={{ px: 2 }}>
                                <Grid container spacing={2.5}>
                                    {stats.map(stat => (
                                        <Grid item xs={12} sm={6} lg={4} xl={2.4} key={stat.title}>
                                            <Card sx={{
                                                height: '100%',
                                                border: '1px solid #262626',
                                                transition: 'border-color 0.2s ease, transform 0.2s ease',
                                                '&:hover': { borderColor: stat.accent, transform: 'translateY(-2px)' }
                                            }}>
                                                <CardActionArea component={Link} to={stat.to} sx={{ p: 3 }}>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.06em">
                                                        {stat.title}
                                                    </Typography>
                                                    <Typography variant="h4" fontWeight={800} sx={{ color: stat.accent, mt: 0.5 }}>
                                                        {stat.value}
                                                    </Typography>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </>
                    )}
                </div>
            </div>

            <Box sx={{ mt: 4 }}>
                <SalesChart />
            </Box>
            <Box sx={{ mt: 4 }}>
                <ProductSalesChart />
            </Box>
            <Box sx={{ mt: 4 }}>
                <UserSalesChart />
            </Box>
            <Box sx={{ mt: 4 }}>
                <MonthlySalesChart />
            </Box>
        </>
    )
}
export default Dashboard