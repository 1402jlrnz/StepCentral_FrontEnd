import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
    Box,
    Typography,
    Rating,
    Button,
    Card,
    CardContent,
    TextField,
    Chip,
    Divider,
    Tabs,
    Tab,
    IconButton
} from '@mui/material'
import { ArrowBack, ChevronLeft, ChevronRight } from '@mui/icons-material'

import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import { getProductDetails, createReview, getProductReviews, resetNewReview, clearErrors } from '../../actions/productActions'
import { addItemToCart } from '../../actions/cartActions'
import { myOrders } from '../../actions/orderActions'
import { formatPrice, productImageUrl } from '../Utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { product: productDetails, loading: productDetailsLoading } = useSelector(state => state.productDetails)
    const { user } = useSelector(state => state.auth)
    const { reviews, loading: reviewsLoading } = useSelector(state => state.productReviews)
    const { orders } = useSelector(state => state.myOrders)
    const { success: reviewSuccess, loading: reviewLoading } = useSelector(state => state.newReview)

    const { id } = useParams()

    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState(0)
    const [selectedImage, setSelectedImage] = useState(0)

    // One review per user per product: if they already reviewed, the form
    // prefills in edit mode (submitting updates their existing review).
    const myReview = (reviews || []).find(
        (r) => user && r.user && String(r.user) === String(user._id || user.id || '')
    )
    const myReviewKey = myReview ? `${myReview._id || ''}|${myReview.rating || 0}|${myReview.comment || ''}` : ''

    useEffect(() => {
        if (myReview) {
            setRating(myReview.rating || 0)
            setComment(myReview.comment || '')
        }
    }, [myReviewKey, user])

    useEffect(() => {
        dispatch(getProductDetails(id))
        dispatch(getProductReviews(id))
        setSelectedImage(0)
    }, [dispatch, id])

    // Load the current user's orders so we can tell who actually purchased the product
    useEffect(() => {
        if (user) {
            dispatch(myOrders())
        }
    }, [dispatch, user])

    const hasOrderedProduct = (orders || []).some(order =>
        (order.orderItems || []).some(item => String(item.product?._id || item.product) === String(id))
    )

    const images = (productDetails && productDetails.images) || []
    const imageCount = images.length
    const activeImage = imageCount > 0 ? Math.min(selectedImage, imageCount - 1) : 0
    const reviewCount = Array.isArray(productDetails.reviews)
        ? productDetails.reviews.length
        : productDetails.numOfReviews || 0

    // Cycle photos with the arrows (or a thumbnail click) — never on hover
    const stepImage = (direction) => {
        if (imageCount < 2) return
        setSelectedImage(prev => (Math.min(prev, imageCount - 1) + direction + imageCount) % imageCount)
    }

    const submitReview = (e) => {
        e.preventDefault()
        if (!rating || rating < 1) {
            alert('Please select a rating')
            return
        }
        if (!comment.trim()) {
            alert('Please write a review')
            return
        }
        dispatch(createReview({ rating, comment, productId: id }))
    }

    // Adding to cart requires login first
    const addToCart = () => {
        if (!user) {
            toast.info('Please login to add items to your cart', {
                position: 'bottom-right'
            })
            navigate('/login?redirect=product/' + id)
            return
        }
        if (!productDetails) return
        // Out of stock products cannot be added to the cart
        if (productDetails.stock === 0) {
            toast.info('Sorry, this product is out of stock', {
                position: 'bottom-right'
            })
            return
        }
        dispatch(addItemToCart(id, quantity))
        toast.success(`${productDetails.name} added to cart!`, {
            position: 'bottom-right'
        })
    }

    useEffect(() => {
        if (reviewSuccess) {
            dispatch(clearErrors())
            dispatch(getProductReviews(id))
            dispatch(resetNewReview())
            setRating(0)
            setComment('')
        }
    }, [dispatch, reviewSuccess, id])

    return (
        <>
            {(productDetailsLoading || reviewsLoading) ? <Loader /> : (
                <>
                    <MetaData title={productDetails.name} />

                    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>
                        {/* Back button */}
                        <IconButton
                            id="back_btn"
                            onClick={() => navigate(-1)}
                            sx={{ color: '#a1a1aa', mb: 2, border: '1px solid #262626', '&:hover': { color: '#ff3b3b', borderColor: '#ff3b3b' } }}
                        >
                            <ArrowBack />
                            <Typography sx={{ ml: 1, fontWeight: 600, fontSize: '0.9rem' }}>Back</Typography>
                        </IconButton>

                        <Card
                            sx={{
                                p: { xs: 2, md: 4 },
                                background: '#ffffff',
                                backdropFilter: 'none',
                                WebkitBackdropFilter: 'none',
                                border: '1px solid #e5e7eb',
                                borderRadius: 12,
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 7fr) minmax(0, 5fr)' },
                                    gap: { xs: 3, md: 4 },
                                    alignItems: 'center'
                                }}
                            >
                                {/* Product images gallery */}
                                <Box sx={{ minWidth: 0 }}>
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            // Hover only REVEALS the arrows; switching happens on click
                                            '&:hover .img-nav, & .img-nav:focus-visible': { opacity: 1 }
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            id="product_image"
                                            src={
                                                imageCount > 0
                                                    ? productImageUrl(images[activeImage].url)
                                                    : ''
                                            }
                                            alt={productDetails.name}
                                            sx={{
                                                width: '100%',
                                                height: { xs: 300, sm: 420, md: 500 },
                                                objectFit: 'cover',
                                                objectPosition: 'center',
                                                borderRadius: 3,
                                                backgroundColor: '#ffffff',
                                                border: '1px solid #e5e7eb',
                                                mixBlendMode: 'multiply',
                                                p: 2
                                            }}
                                        />

                                        {imageCount > 1 && (
                                            <>
                                                <IconButton
                                                    className="img-nav"
                                                    aria-label="Previous photo"
                                                    onClick={() => stepImage(-1)}
                                                    sx={{
                                                        position: 'absolute',
                                                        left: 8,
                                                        top: 0,
                                                        bottom: 0,
                                                        margin: 'auto 0',
                                                        opacity: 0,
                                                        transition: 'opacity 0.15s ease',
                                                        zIndex: 2,
                                                        width: 36,
                                                        height: 36,
                                                        backgroundColor: 'rgba(255, 255, 255, 0.92)',
                                                        border: '1px solid #e5e7eb',
                                                        '&:hover': { backgroundColor: '#ffffff', color: '#ff3b3b', borderColor: '#ff3b3b' }
                                                    }}
                                                >
                                                    <ChevronLeft />
                                                </IconButton>
                                                <IconButton
                                                    className="img-nav"
                                                    aria-label="Next photo"
                                                    onClick={() => stepImage(1)}
                                                    sx={{
                                                        position: 'absolute',
                                                        right: 8,
                                                        top: 0,
                                                        bottom: 0,
                                                        margin: 'auto 0',
                                                        opacity: 0,
                                                        transition: 'opacity 0.15s ease',
                                                        zIndex: 2,
                                                        width: 36,
                                                        height: 36,
                                                        backgroundColor: 'rgba(255, 255, 255, 0.92)',
                                                        border: '1px solid #e5e7eb',
                                                        '&:hover': { backgroundColor: '#ffffff', color: '#ff3b3b', borderColor: '#ff3b3b' }
                                                    }}
                                                >
                                                    <ChevronRight />
                                                </IconButton>
                                            </>
                                        )}
                                    </Box>

                                    {/* Multi-photo thumbnail strip */}
                                    {productDetails.images && productDetails.images.length > 1 && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 1.5,
                                                mt: 2,
                                                overflowX: 'auto',
                                                pb: 1,
                                                justifyContent: { xs: 'flex-start', sm: 'center' }
                                            }}
                                        >
                                            {productDetails.images.map((img, idx) => (
                                                <Box
                                                    key={img.public_id || idx}
                                                    component="img"
                                                    src={productImageUrl(img.url)}
                                                    alt={`${productDetails.name} angle ${idx + 1}`}
                                                    onClick={() => setSelectedImage(idx)}
                                                    sx={{
                                                        width: { xs: 68, sm: 84 },
                                                        height: { xs: 68, sm: 84 },
                                                        objectFit: 'contain',
                                                        p: 0.75,
                                                        borderRadius: 2,
                                                        backgroundColor: '#ffffff',
                                                        border: activeImage === idx ? '2px solid #ff3b3b' : '1px solid #e5e7eb',
                                                        cursor: 'pointer',
                                                        mixBlendMode: 'multiply',
                                                        flexShrink: 0,
                                                        transition: 'all 0.2s ease',
                                                        boxShadow: activeImage === idx ? '0 0 8px rgba(255, 59, 59, 0.4)' : 'none',
                                                        '&:hover': {
                                                            borderColor: '#ff3b3b',
                                                            transform: 'translateY(-2px)'
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                </Box>

                                {/* Product info */}
                                <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                    <Typography variant="h4" fontWeight={800} gutterBottom sx={{ color: '#111827' }}>
                                        {productDetails.name}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, my: 2 }}>
                                        <Rating value={productDetails.ratings} precision={0.5} readOnly />
                                        <Typography id="no_of_reviews" variant="body2" sx={{ color: '#6b7280' }}>
                                            ({reviewCount} reviews)
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ mb: 2 }} />

                                    <Typography id="product_price" variant="h4" sx={{ color: '#ff3b3b', fontWeight: 800, my: 2 }}>
                                        ₱{formatPrice(productDetails.price)}
                                    </Typography>

                                    <Divider sx={{ mb: 2 }} />

                                    {/* Quantity selector */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
                                        <Box className="stockCounter qty-pill">
                                            <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                                            <input type="number" className="qty-input" value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.min(productDetails.stock, parseInt(e.target.value) || 1)))} />
                                            <button className="qty-btn" onClick={() => setQuantity(q => Math.min(productDetails.stock, q + 1))} aria-label="Increase quantity">+</button>
                                        </Box>

                                        <Button
                                            id="cart_btn"
                                            variant="contained"
                                            size="large"
                                            onClick={addToCart}
                                            disabled={productDetails.stock === 0}
                                        >
                                            {productDetails.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                        </Button>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                                            <Typography variant="body2" sx={{ color: '#374151' }}>Status:</Typography>
                                            <Chip
                                                id="stock_status"
                                                size="small"
                                                label={productDetails.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                                sx={{
                                                    fontWeight: 700,
                                                    color: productDetails.stock > 0 ? '#22c55e' : '#ef4444',
                                                    border: `1px solid ${productDetails.stock > 0 ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
                                                    backgroundColor: 'transparent'
                                                }}
                                            />
                                        </Box>

                                        <Typography variant="body2" sx={{ color: '#374151' }}>
                                            Seller: <span id="product_seller" style={{ fontWeight: 700 }}>{productDetails.seller}</span>
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Card>

                        {/* Tabs: Description & Reviews */}
                        <Box sx={{ mt: 4 }}>
                            <Tabs
                                value={activeTab}
                                onChange={(e, v) => setActiveTab(v)}
                                sx={{ borderBottom: '1px solid #262626' }}
                            >
                                <Tab label="Description" sx={{ color: '#a1a1aa', fontWeight: 700 }} />
                                <Tab label={`Reviews (${reviewCount})`} sx={{ color: '#a1a1aa', fontWeight: 700 }} />
                            </Tabs>

                            {/* Description tab */}
                            {activeTab === 0 && (
                                <Card sx={{ p: 3, mt: 2 }}>
                                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                                        {productDetails.description}
                                    </Typography>
                                </Card>
                            )}

                            {/* Reviews tab */}
                            {activeTab === 1 && (
                                <Box sx={{ mt: 2 }}>
                                    {/* Write a Review — only users who ordered this product can review it */}
                                    {user && hasOrderedProduct ? (
                                        <Card sx={{ p: 3, mb: 3 }}>
                                            <Typography variant="h6" sx={{ mb: 2 }}>Write a Review</Typography>
                                            <form onSubmit={submitReview}>
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                        Your Rating
                                                    </Typography>
                                                    <Rating
                                                        name="review_rating"
                                                        value={rating}
                                                        onChange={(e, v) => setRating(v || 0)}
                                                        size="large"
                                                    />
                                                </Box>

                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    label="Your Review"
                                                    placeholder="Share your experience with this product..."
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    sx={{ mb: 2 }}
                                                />

                                                <Button variant="contained" type="submit" disabled={reviewLoading}>
                                                    {reviewLoading ? 'Submitting...' : myReview ? 'Update Review' : 'Submit Review'}
                                                </Button>
                                            </form>
                                        </Card>
                                    ) : user ? (
                                        <Card sx={{ p: 2, mb: 3, textAlign: 'center' }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                You can only review products you have ordered.{' '}
                                                <Link to="/orders/me" sx={{ color: '#ff3b3b', fontWeight: 700 }}>View your orders</Link> to leave a review.
                                            </Typography>
                                        </Card>
                                    ) : (
                                        <Card sx={{ p: 2, mb: 3, textAlign: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                <Link to="/login" sx={{ color: '#ff3b3b', fontWeight: 700 }}>Login</Link> to write a review
                                            </Typography>
                                        </Card>
                                    )}

                                    {/* Reviews list */}
                                    {reviews.length === 0 ? (
                                        <Card sx={{ p: 3, textAlign: 'center' }}>
                                            <Typography color="text.secondary">No reviews yet. Be the first to review!</Typography>
                                        </Card>
                                    ) : (
                                        reviews.map((review) => (
                                            <Card
                                                key={review._id}
                                                sx={{ p: 3, mb: 2 }}
                                                className="review-card-mui"
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Box>
                                                        <Typography fontWeight={700}>{review.name}</Typography>
                                                        <Rating value={review.rating} readOnly size="small" />
                                                    </Box>
                                                </Box>
                                                <Typography variant="body2">{review.comment}</Typography>
                                            </Card>
                                        ))
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Box>
                </>
            )}
        </>
    )
}

export default ProductDetails
