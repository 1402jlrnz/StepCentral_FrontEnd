import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Box,
    Typography,
    Button,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Avatar,
    Divider,
    ListItemIcon,
    ListItemText
} from '@mui/material'
import {
    Dashboard as DashboardIcon,
    Inventory as ProductsIcon,
    AddCircleOutlined as CreateIcon,
    ShoppingBagOutlined as OrdersIcon,
    Person as ProfileIcon,
    Logout as LogoutIcon
} from '@mui/icons-material'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../actions/userActions'
import { logout as clearSession, getUser } from '../Utils/helpers'

import Search from './Search'
export const Header = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.cart)
    const [anchorEl, setAnchorEl] = useState(null);
    const dropdownOpen = Boolean(anchorEl);
    let navigate = useNavigate()
    const avatarRef = useRef(null);

    const currentUser = (user && (user._id || user.name)) ? user : getUser();

    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const logoutHandler = () => {
        handleMenuClose();
        dispatch(logout());
        clearSession(() => { })
        toast.success('Logged out', {
            position: 'bottom-right'
        });
        navigate('/')
    }

    return (
        <>
            <nav className="navbar row">
                <div className="col-12 col-md-3">
                    <div className="navbar-brand">
                        <Link to="/">
                            <Typography
                                component="span"
                                sx={{
                                    fontSize: '1.6rem',
                                    fontWeight: 'bold',
                                    textDecoration: 'none',
                                    fontFamily: "'Amazon Ember', sans-serif"
                                }}
                            >
                                <span style={{ color: '#ff3b3b' }}>Step</span>
                                <span style={{ color: '#ffffff' }}>Central</span>
                            </Typography>
                        </Link>

                    </div>

                </div>
                <Search />
                <div className="col-12 col-md-3 mt-4 mt-md-0">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        {currentUser ? (
                            <>
                                <Button
                                    onClick={handleMenuOpen}
                                    startIcon={
                                        <Avatar
                                            src={currentUser.avatar && (currentUser.avatar.url || currentUser.avatar.secure_url)}
                                            alt={currentUser.name}
                                            sx={{ width: 28, height: 28, border: '1px solid #2a2a2a' }}
                                        />
                                    }
                                    sx={{ color: '#fafafa', textTransform: 'none' }}
                                >
                                    {currentUser.name}
                                </Button>

                                <Menu
                                    anchorEl={anchorEl}
                                    open={dropdownOpen}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    PaperProps={{ sx: { mt: 1, minWidth: 180, borderRadius: 3 } }}
                                >
                                    {currentUser.role === 'admin' && (
                                        <>
                                            <MenuItem component={Link} to="/dashboard" onClick={handleMenuClose}>
                                                <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                                                Dashboard
                                            </MenuItem>
                                            <MenuItem component={Link} to="/admin/products" onClick={handleMenuClose}>
                                                <ListItemIcon><ProductsIcon fontSize="small" /></ListItemIcon>
                                                All Products
                                            </MenuItem>
                                            <MenuItem component={Link} to="/admin/product" onClick={handleMenuClose}>
                                                <ListItemIcon><CreateIcon fontSize="small" /></ListItemIcon>
                                                Create Product
                                            </MenuItem>
                                            <Divider />
                                        </>
                                    )}
                                    <MenuItem component={Link} to="/orders/me" onClick={handleMenuClose}>
                                        <ListItemIcon><OrdersIcon fontSize="small" /></ListItemIcon>
                                        Orders
                                    </MenuItem>
                                    <MenuItem component={Link} to="/me" onClick={handleMenuClose}>
                                        <ListItemIcon><ProfileIcon fontSize="small" /></ListItemIcon>
                                        Profile
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={logoutHandler} sx={{ color: '#ff3b3b' }}>
                                        <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#ff3b3b' }} /></ListItemIcon>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Button component={Link} to="/login" id="login_btn" variant="contained" sx={{ ml: 2 }}>
                                Login
                            </Button>
                        )}

                        <IconButton component={Link} to="/cart" className="cart-link" sx={{ color: '#fafafa' }}>
                            <Badge
                                badgeContent={cartItems ? cartItems.length : 0}
                                showZero={false}
                                sx={{
                                    '& .MuiBadge-badge': {
                                        backgroundColor: '#ff3b3b',
                                        color: '#fff',
                                        fontWeight: 700
                                    }
                                }}
                            >
                                <i id="cart" className="fa fa-shopping-cart" style={{ fontSize: '1.3rem' }} aria-hidden="true"></i>
                            </Badge>
                        </IconButton>
                    </Box>
                </div>

            </nav>
        </>
    )
}
