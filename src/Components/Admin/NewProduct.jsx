import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import Sidebar from './SideBar'
import { getToken } from '../Utils/helpers'
import { TextField, MenuItem, Button } from '@mui/material'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewProduct = () => {

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState('');
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const categories = [
        'Running',
        'Basketball',
        'Lifestyle'
    ]

    let navigate = useNavigate()

    const submitHandler = (e) => {
        e.preventDefault();

        // multipart/form-data: scalars + the actual File objects.
        // (axios sets the multipart boundary automatically — never set it by hand.)
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('stock', stock);
        formData.append('seller', seller);
        images.forEach(img => formData.append('images', img));

        newProduct(formData)
    }

    const onChange = e => {
        const files = Array.from(e.target.files)
        setImages(files)             // File objects for the multipart upload
        setImagesPreview([])         // base64 copies only for the UI preview
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
    const newProduct = async (formData) => {

        try {
            // No Content-Type header: axios detects FormData and adds the boundary
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.post(`${import.meta.env.VITE_API}/admin/product/new`, formData, config)
            setSuccess(data.success)
        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to create product')

        }
    }
    useEffect(() => {

        if (error) {
            toast.error(error, {
                position: 'bottom-right'
            });
            setError('')
        }

        if (success) {
            navigate('/admin/products');
            toast.success('Product created successfully', {
                position: 'bottom-right'
            })

        }

    }, [error, success,])


    return (
        <>
            <MetaData title={'New Product'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-4">New Product</h1>

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
                                >
                                    CREATE
                                </Button>

                            </form>
                        </div>
                    </>
                </div>
            </div>

        </>
    )
}
export default NewProduct
