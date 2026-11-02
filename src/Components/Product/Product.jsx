import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Box,
    Rating,
    Button,
    Chip,
    IconButton
} from '@mui/material'
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import { formatPrice, productImageUrl } from '../Utils/helpers'

const Product = ({ product }) => {
    const [imgIndex, setImgIndex] = useState(0)

    const images = product.images || []
    const imageCount = images.length
    const activeIndex = imageCount > 0 && imgIndex < imageCount ? imgIndex : 0
    const mainImage = imageCount > 0 ? images[activeIndex].url : '/images/default_avatar.jpg'
    const reviewCount = Array.isArray(product.reviews) ? product.reviews.length : product.numOfReviews

    // Arrows only — image changes on CLICK, never on hover
    // (hover-swapping between photos of different sizes caused flicker)
    const stepImage = (e, direction) => {
        e.preventDefault()
        e.stopPropagation()
        if (imageCount < 2) return
        setImgIndex(prev => (prev + direction + imageCount) % imageCount)
    }

    return (
        <Box sx={{ p: { xs: 0.5, md: 1.5 } }} className="col-sm-12 col-md-6 col-lg-4 my-3">
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#ffffff',
                    backdropFilter: 'none',
                    WebkitBackdropFilter: 'none',
                    border: '1px solid #e5e7eb',
                    borderRadius: 2,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                    position: 'relative',
                    '&:hover': {
                        borderColor: '#ff3b3b',
                        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.14)'
                    }
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        // Hover only REVEALS the arrows — the picture itself
                        // changes on click only, so nothing flickers
                        '&:hover .img-nav, & .img-nav:focus-visible': { opacity: 1 }
                    }}
                >
                    <CardMedia
                        component="img"
                        image={productImageUrl(mainImage)}
                        alt={product.name}
                        sx={{
                            height: { xs: 220, sm: 250 },
                            objectFit: 'contain',
                            p: 1.5,
                            backgroundColor: '#ffffff',
                            mixBlendMode: 'multiply'
                        }}
                    />
                    {imageCount > 1 && (
                        <>
                            <IconButton
                                className="img-nav"
                                aria-label="Previous photo"
                                size="small"
                                onClick={(e) => stepImage(e, -1)}
                                sx={{
                                    position: 'absolute',
                                    left: 6,
                                    top: 0,
                                    bottom: 0,
                                    margin: 'auto 0',
                                    opacity: 0,
                                    transition: 'opacity 0.15s ease',
                                    zIndex: 2,
                                    width: 28,
                                    height: 28,
                                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                                    border: '1px solid #e5e7eb',
                                    '&:hover': { backgroundColor: '#ffffff', color: '#ff3b3b', borderColor: '#ff3b3b' }
                                }}
                            >
                                <ChevronLeftRoundedIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                className="img-nav"
                                aria-label="Next photo"
                                size="small"
                                onClick={(e) => stepImage(e, 1)}
                                sx={{
                                    position: 'absolute',
                                    right: 44,
                                    top: 0,
                                    bottom: 0,
                                    margin: 'auto 0',
                                    opacity: 0,
                                    transition: 'opacity 0.15s ease',
                                    zIndex: 2,
                                    width: 28,
                                    height: 28,
                                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                                    border: '1px solid #e5e7eb',
                                    '&:hover': { backgroundColor: '#ffffff', color: '#ff3b3b', borderColor: '#ff3b3b' }
                                }}
                            >
                                <ChevronRightRoundedIcon fontSize="small" />
                            </IconButton>
                        </>
                    )}
                    {imageCount > 1 && (
                        <Chip
                            icon={<CollectionsOutlinedIcon sx={{ fontSize: '0.85rem !important', color: '#6b7280' }} />}
                            label={`${activeIndex + 1}/${imageCount}`}
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                right: 8,
                                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                                backdropFilter: 'blur(4px)',
                                border: '1px solid #e5e7eb',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: '#4b5563',
                                height: 22,
                                zIndex: 3,
                                '& .MuiChip-label': { px: 0.75 }
                            }}
                        />
                    )}
                </Box>

                <CardContent sx={{ flexGrow: 1, pt: 1 }}>
                    <Typography
                        variant="h6"
                        component={Link}
                        to={`/product/${product._id}`}
                        sx={{
                            color: '#111827',
                            textDecoration: 'none',
                            fontWeight: 700,
                            fontSize: '1rem',
                            display: 'block',
                            mb: 0.5,
                            '&:hover': { color: '#ff3b3b' }
                        }}
                    >
                        {product.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
                        <Rating
                            value={product.ratings}
                            precision={0.5}
                            readOnly
                            size="small"
                        />
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            ({reviewCount} reviews)
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography
                            variant="h6"
                            sx={{ color: '#ff3b3b', fontWeight: 800 }}
                        >
                            ₱{formatPrice(product.price)}
                        </Typography>
                        <Chip
                            label={product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            size="small"
                            sx={{
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                color: product.stock > 0 ? '#16a34a' : '#dc2626',
                                border: `1px solid ${product.stock > 0 ? 'rgba(22, 163, 74, 0.4)' : 'rgba(220, 38, 38, 0.4)'}`,
                                backgroundColor: 'transparent'
                            }}
                        />
                    </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                        component={Link}
                        to={`/product/${product._id}`}
                        id="view_btn"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        View Details
                    </Button>
                </CardActions>
            </Card>
        </Box>
    )
}

export default Product
