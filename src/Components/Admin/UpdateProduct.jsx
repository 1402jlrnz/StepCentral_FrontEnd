import React, { useState, useEffect } from 'react'
import MetaData from '../Layout/MetaData'
import Sidebar from './SideBar'
import { TextField, MenuItem, Button } from '@mui/material'

import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios';
import { getToken } from '../Utils/helpers';


const UpdateProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState('');
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])
    const [error, setError] = useState('')
    const [product, setProduct] = useState({})
    const [loading, setLoading] = useState(true)
    const [updateError, setUpdateError] = useState('')
    const [isUpdated, setIsUpdated] = useState(false)

    const categories = [
        'Running',
        'Basketball',
        'Lifestyle'
    ]
    let { id } = useParams();
    let navigate = useNavigate();

    const errMsg = (message = '') => toast.error(message, {
        position: 'bottom-right'
    });
    const successMsg = (message = '') => toast.success(message, {
        position: 'bottom-right'
    });

    const getProductDetails = async (id) => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/product/${id}`)
            if (data.success) {
                setProduct(data.product)
            } else {
                setError(data.message || 'Failed to load product')
            }
            setLoading(false)

        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to load product')

        }
    }

    const updateProduct = async (id, productData) => {
        try {
            // productData is FormData — axios sets the multipart boundary itself,
            // so Content-Type must NOT be set manually.
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.put(`${import.meta.env.VITE_API}/admin/product/${id}`, productData, config)
            setIsUpdated(data.success)

        } catch (error) {
            setUpdateError(error?.response?.data?.message || 'Update failed')

        }
    }
    useEffect(() => {
        if (product && product._id === id) {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setCategory(product.category);
            setSeller(product.seller);
            setStock(product.stock)
            setOldImages(product.images || [])
        } else if (!error) {
            // Only fetch when we don't already have the product (and no error yet)
            getProductDetails(id)
        }
        if (error) {
            errMsg(error)

        }
        if (updateError) {
            errMsg(updateError);

        }
        if (isUpdated) {
            navigate('/admin/products');
            successMsg('Product updated successfully');

        }
    }, [error, isUpdated, updateError, product, id])

    const submitHandler = (e) => {
        e.preventDefault();
        if (!product || !product._id) return;
        // multipart/form-data — if no new images were chosen, no `images` files
        // are appended and the backend keeps the old ones.
        const payload = new FormData();
        payload.append('name', name);
        payload.append('price', price);
        payload.append('description', description);
        payload.append('category', category);
        payload.append('stock', stock);
        payload.append('seller', seller);
        images.forEach(img => payload.append('images', img));
        updateProduct(product._id, payload)
    }
    const onChange = e => {
        const files = Array.from(e.target.files)
        setImages(files)             // File objects for the multipart upload
        setImagesPreview([])         // base64 copies only for the UI preview
        setOldImages([])
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                }
            }
            reader.readAsDataURL(file)
        })
    }
    return (
        <>
            <MetaData title={'Update Product'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-4">Update Product</h1>
                                <div className="form-group">
                                    <label htmlFor="name_field">Name</label>
                                    <TextField
                                        type="text"
                                        id="name_field"
                                        size="small"
                                        fullWidth
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="price_field">Price</label>
                                    <TextField
                                        type="text"
                                        id="price_field"
                                        size="small"
                                        fullWidth
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description_field">Description</label>
                                    <TextField
                                        multiline
                                        rows={8}
                                        id="description_field"
                                        size="small"
                                        fullWidth
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="category_field">Category</label>
                                    <TextField
                                        select
                                        id="category_field"
                                        size="small"
                                        fullWidth
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        {categories.map(category => (
                                            <MenuItem key={category} value={category} >{category}</MenuItem>
                                        ))}
                                    </TextField>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="stock_field">Stock</label>
                                    <TextField
                                        type="number"
                                        id="stock_field"
                                        size="small"
                                        fullWidth
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="seller_field">Seller Name</label>
                                    <TextField
                                        type="text"
                                        id="seller_field"
                                        size="small"
                                        fullWidth
                                        value={seller}
                                        onChange={(e) => setSeller(e.target.value)}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label>Images</label>
                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='images'
                                            className='custom-file-input'
                                            id='customFile'
                                            onChange={onChange}
                                            multiple
                                        />
                                        <label className='custom-file-label' htmlFor='customFile'>
                                            Choose Images
                                        </label>
                                    </div>
                                    {oldImages && oldImages.map(img => (
                                        <img key={img._id} src={img.url} alt={img.url} className="mt-3 mr-2" width="55" height="52" />
                                    ))}
                                    {imagesPreview.map(img => (
                                        <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />
                                    ))}
                                </div>
                                <Button
                                    id="login_button"
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={loading}
                                >
                                    UPDATE
                                </Button>
                            </form>
                        </div>
                    </>
                </div>
            </div>
        </>
    )
}

export default UpdateProduct
