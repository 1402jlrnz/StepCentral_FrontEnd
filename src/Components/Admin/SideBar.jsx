import React from 'react'
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Divider
} from '@mui/material'
import {
    Dashboard as DashboardIcon,
    Inventory2 as ProductsIcon,
    AddCircleOutlined as CreateIcon,
    ShoppingBag as OrdersIcon,
    People as UsersIcon,
    Star as ReviewsIcon,
    ExpandLess,
    ExpandMore
} from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
    const [productsOpen, setProductsOpen] = React.useState(true)
    const location = useLocation()

    const isActive = (path) => location.pathname.startsWith(path)

    return (
        <Box
            sx={{
                borderRight: '1px solid #262626',
                minHeight: '100vh',
                p: 2,
                backgroundColor: '#0f0f0f'
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    px: 2,
                    py: 2,
                    fontWeight: 800,
                    color: '#fafafa',
                    letterSpacing: '-0.02em'
                }}
            >
                <span style={{ color: '#ff3b3b' }}>Step</span>Central
                <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Admin Panel
                </Typography>
            </Typography>

            <Divider sx={{ borderColor: '#262626', mb: 2 }} />

            <List component="nav" disablePadding>
                <ListItem disablePadding>
                    <ListItemButton
                        component={Link}
                        to="/dashboard"
                        selected={isActive('/dashboard')}
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(255,59,59,0.1)',
                                '& .MuiListItemIcon-root, & .MuiListItemText-primary': { color: '#ff3b3b' }
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: '#a1a1aa', minWidth: 36 }}>
                            <DashboardIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Dashboard"
                            primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem', color: '#a1a1aa' }}
                        />
                    </ListItemButton>
                </ListItem>

                {/* Products submenu */}
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => setProductsOpen(!productsOpen)}
                        selected={isActive('/admin/product')}
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(255,59,59,0.1)',
                                '& .MuiListItemIcon-root, & .MuiListItemText-primary': { color: '#ff3b3b' }
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: '#a1a1aa', minWidth: 36 }}>
                            <ProductsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Products"
                            primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem', color: '#a1a1aa' }}
                        />
                        {productsOpen ? <ExpandLess sx={{ color: '#a1a1aa' }} /> : <ExpandMore sx={{ color: '#a1a1aa' }} />}
                    </ListItemButton>
                </ListItem>

                <Collapse in={productsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton
                            component={Link}
                            to="/admin/products"
                            selected={location.pathname === '/admin/products'}
                            sx={{
                                pl: 4,
                                borderRadius: 2,
                                mb: 0.5,
                                '&.Mui-selected': {
                                    backgroundColor: 'rgba(255,59,59,0.1)',
                                    '& .MuiListItemText-primary': { color: '#ff3b3b' }
                                }
                            }}
                        >
                            <ListItemText
                                primary="All"
                                primaryTypographyProps={{ fontWeight: 600, fontSize: '0.85rem', color: '#a1a1aa' }}
                            />
                        </ListItemButton>
                        <ListItemButton
                            component={Link}
                            to="/admin/product"
                            selected={location.pathname === '/admin/product'}
                            sx={{
                                pl: 4,
                                borderRadius: 2,
                                mb: 0.5,
                                '&.Mui-selected': {
                                    backgroundColor: 'rgba(255,59,59,0.1)',
                                    '& .MuiListItemText-primary': { color: '#ff3b3b' }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: '#a1a1aa', minWidth: 28 }}>
                                <CreateIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Create"
                                primaryTypographyProps={{ fontWeight: 600, fontSize: '0.85rem', color: '#a1a1aa' }}
                            />
                        </ListItemButton>
                    </List>
                </Collapse>

                <ListItem disablePadding>
                    <ListItemButton
                        component={Link}
                        to="/admin/orders"
                        selected={isActive('/admin/orders')}
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(255,59,59,0.1)',
                                '& .MuiListItemIcon-root, & .MuiListItemText-primary': { color: '#ff3b3b' }
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: '#a1a1aa', minWidth: 36 }}>
                            <OrdersIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Orders"
                            primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem', color: '#a1a1aa' }}
                        />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        component={Link}
                        to="/admin/users"
                        selected={isActive('/admin/users')}
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(255,59,59,0.1)',
                                '& .MuiListItemIcon-root, & .MuiListItemText-primary': { color: '#ff3b3b' }
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: '#a1a1aa', minWidth: 36 }}>
                            <UsersIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Users"
                            primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem', color: '#a1a1aa' }}
                        />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        component={Link}
                        to="/admin/reviews"
                        sx={{ borderRadius: 2, mb: 0.5 }}
                    >
                        <ListItemIcon sx={{ color: '#a1a1aa', minWidth: 36 }}>
                            <ReviewsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Reviews"
                            primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem', color: '#a1a1aa' }}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    )
}

export default Sidebar
