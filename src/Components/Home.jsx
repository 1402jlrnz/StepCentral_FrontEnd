import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import Product from './Product/Product'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import MetaData from './Layout/MetaData'
import Loader from './Layout/Loader';
import HeroSection from './Hero/HeroSection';
import '../HeroSection.css';

import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../actions/productActions'

const Home = () => {
    const [price, setPrice] = useState([1, 15000]);
    const [category, setCategory] = useState('')
    const [ratings, setRatings] = useState(0)
    const [reviewFilter, setReviewFilter] = useState('')
    const [reviewSliderValue, setReviewSliderValue] = useState(0)
    let { keyword } = useParams();
    const dispatch = useDispatch();
    const { loading, error, products: reduxProducts, productsCount, resPerPage, filteredProductsCount } = useSelector(state => state.products);

    const categories = [
        'Running',
        'Basketball',
        'Lifestyle'
    ]

    const count = filteredProductsCount ?? productsCount;

    const handlePriceChange = (event, newValue) => {
        setPrice(newValue);
    };

    function valuetext(price) {
        return `₱${price.toString()}`;
    }

    // Infinite scroll: load all products progressively
    const [allProducts, setAllProducts] = useState([]);
    const filterKey = JSON.stringify([keyword, price, category, ratings, reviewFilter]);
    const loadedFilterKey = useRef(null);
    const observer = useRef(null);
    const loadMoreRef = useRef(null);

    const loadMore = useCallback(() => {
        if (
            loading ||
            loadedFilterKey.current !== filterKey ||
            allProducts.length >= count ||
            !resPerPage
        ) return;
        const nextPage = Math.ceil(allProducts.length / resPerPage) + 1;
        dispatch(getProducts(nextPage, keyword, price, category, ratings, reviewFilter));
    }, [dispatch, loading, allProducts.length, count, filterKey, keyword, price, category, ratings, reviewFilter, resPerPage]);

    // Load the first page when filters change; keep the current results visible meanwhile.
    useEffect(() => {
        loadedFilterKey.current = null;
        dispatch(getProducts(1, keyword, price, category, ratings, reviewFilter));
    }, [dispatch, keyword, price, category, ratings, reviewFilter]);

    // IntersectionObserver for infinite scroll
    useEffect(() => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    !loading &&
                    loadedFilterKey.current === filterKey &&
                    allProducts.length < count
                ) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );
        if (loadMoreRef.current) {
            observer.current.observe(loadMoreRef.current);
        }
        return () => { if (observer.current) observer.current.disconnect(); };
    }, [loading, allProducts.length, count, filterKey, loadMore]);

    // Replace results for a new filter set, or append the next page for the same set.
    useEffect(() => {
        if (loading || error) return;

        if (loadedFilterKey.current !== filterKey) {
            loadedFilterKey.current = filterKey;
            setAllProducts(reduxProducts || []);
            return;
        }

        const existingIds = new Set(allProducts.map(p => p._id));
        const newProducts = (reduxProducts || []).filter(p => !existingIds.has(p._id));
        if (newProducts.length > 0) {
            setAllProducts(prev => [...prev, ...newProducts]);
        }
    }, [reduxProducts, loading, error, filterKey]);

    const displayProducts = allProducts.length > 0 ? allProducts : (reduxProducts || []);

    return (
        <>
            <MetaData title={'Step Central | Buy Footwear'} />

            {/* Design-only hero brand statement */}
            <HeroSection />

            {loading && allProducts.length === 0 ? <Loader /> : (
                <div className="container container-fluid">
                    <h1 id="products_heading">Latest Footwear</h1>
                    <section id="products" className="container mt-5">
                        <div className="row">
                            <div className="col-12 col-md-3 mt-5 mb-5">
                                <h4 className="mb-1">Price</h4>
                                <Box sx={{ width: '100%', maxWidth: 200, pt: 2 }}>
                                    <Slider
                                        getAriaLabel={() => 'Price Filter'}
                                        value={price}
                                        onChange={handlePriceChange}
                                        valueLabelDisplay="on"
                                        getAriaValueText={valuetext}
                                        min={1}
                                        max={15000}
                                    />
                                </Box>
                                <div className="mt-5">
                                    <h4 className="mb-3">Categories</h4>
                                    <ul className="pl-0">
                                        {categories.map(categoryName => (
                                            <li
                                                key={categoryName}
                                                style={{ cursor: 'pointer', listStyle: 'none' }}
                                                onClick={() => { setCategory(categoryName); }}
                                                className={category === categoryName ? 'font-weight-bold' : ''}
                                            >
                                                {categoryName}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-4">
                                    <h4 className="mb-1" style={{ fontSize: '1.15rem', whiteSpace: 'nowrap' }}>Number of Reviews</h4>
                                    <Box sx={{ width: '100%', maxWidth: 200, pt: 2, pb: 1 }}>
                                        <Slider
                                            aria-label="Minimum number of reviews"
                                            value={reviewSliderValue}
                                            onChange={(_, value) => {
                                                setReviewSliderValue(value)
                                            }}
                                            onChangeCommitted={(_, value) => {
                                                setReviewFilter(value === 0 ? '' : `min${value}`)
                                            }}
                                            valueLabelDisplay="on"
                                            valueLabelFormat={value => value === 0 ? 'Any' : `${value}+`}
                                            getAriaValueText={value => value === 0 ? 'Any number of reviews' : `${value} or more reviews`}
                                            marks={[
                                                { value: 0, label: 'Any' },
                                                { value: 1, label: '1+' },
                                                { value: 5, label: '5+' },
                                                { value: 10, label: '10+' }
                                            ]}
                                            min={0}
                                            max={10}
                                            step={1}
                                        />
                                    </Box>
                                    <ul className="pl-0">
                                        <li
                                            style={{ cursor: 'pointer', listStyle: 'none' }}
                                            onClick={() => {
                                                setReviewSliderValue(0)
                                                setReviewFilter(reviewFilter === 'none' ? '' : 'none')
                                            }}
                                            className={reviewFilter === 'none' ? 'font-weight-bold' : ''}
                                        >
                                            No Reviews
                                        </li>
                                        {reviewFilter && (
                                            <li
                                                style={{ cursor: 'pointer', listStyle: 'none', fontSize: '0.85rem', color: '#ff3b3b' }}
                                                onClick={() => {
                                                    setReviewSliderValue(0)
                                                    setReviewFilter('')
                                                }}
                                            >
                                                Clear review filter
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div className="mt-4">
                                    <h4 className="mb-3">Ratings</h4>
                                    <ul className="pl-0">
                                        {[4, 3, 2, 1].map(rating => (
                                            <li
                                                key={rating}
                                                style={{ cursor: 'pointer', listStyle: 'none' }}
                                                onClick={() => { setRatings(rating) }}
                                                className={ratings === rating ? 'font-weight-bold' : ''}
                                            >
                                                {rating}★ &amp; up
                                            </li>
                                        ))}
                                        {ratings > 0 && (
                                            <li
                                                style={{ cursor: 'pointer', listStyle: 'none', fontSize: '0.85rem', color: '#ff3b3b' }}
                                                onClick={() => { setRatings(0) }}
                                            >
                                                Clear rating
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <button
                                    className="btn btn-block btn-secondary mt-3"
                                    onClick={() => {
                                        setCategory('')
                                        setPrice([1, 15000])
                                        setRatings(0)
                                        setReviewSliderValue(0)
                                        setReviewFilter('')
                                    }}
                                >
                                    Clear Filters
                                </button>
                            </div>

                            <div className="col-12 col-md-9">
                                <div className="row">
                                    {displayProducts.length === 0 ? (
                                        <div className="col-12"><h3>No products found</h3></div>
                                    ) : displayProducts.map(product => (
                                        <Product key={product._id} product={product} />
                                    ))}
                                </div>

                                <div ref={loadMoreRef} style={{ height: 20 }} />
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </>
    )
}

export default Home