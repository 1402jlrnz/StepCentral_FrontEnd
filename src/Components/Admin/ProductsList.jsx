import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import Sidebar from './SideBar'
import { getToken, formatPrice } from '../Utils/helpers'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid, } from '@mui/x-data-grid'
import Swal from 'sweetalert2'

const ProductsList = () => {
    const [products, setProducts] = useState([])
    const [error, setError] = useState('')
    const [deleteError, setDeleteError] = useState('')

    const [loading, setLoading] = useState(true)
    const [isDeleted, setIsDeleted] = useState(false)
    const [selectedIds, setSelectedIds] = useState([])

    const config = {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    }

    const getAdminProducts = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/products`, config)
            setProducts(data.products)
            setLoading(false)
        } catch (error) {
            setError(error.response.data.message)
        }
    }
    useEffect(() => {
        getAdminProducts()

    }, [])

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: 'bottom-right'
            });
            setError('')
        }

        if (deleteError) {
            toast.error(deleteError, {
                position: 'bottom-right'
            });
            setDeleteError('')
        }

        if (isDeleted) {
            toast.success('Product deleted successfully', {
                position: 'bottom-right'
            })
            setIsDeleted(false)
            setSelectedIds([])
            getAdminProducts()
        }

    }, [error, deleteError, isDeleted,])

    // Single delete (trash icon on each row)
    const deleteProduct = async (id) => {
        try {
            const { data } = await axios.delete(`${import.meta.env.VITE_API}/admin/product/${id}`, config)

            setIsDeleted(data.success)
            setLoading(false)
        } catch (error) {
            setDeleteError(error.response.data.message)

        }
    }
    const deleteProductHandler = (id) => {
        deleteProduct(id)
    }

    // Bulk delete (checkbox selection)
    const bulkDeleteHandler = async () => {
        if (selectedIds.length === 0) {
            toast.info('No products selected', {
                position: 'bottom-right'
            })
            return
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${selectedIds.length} product(s). This cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete them!'
        })

        if (result.isConfirmed) {
            try {
                const { data } = await axios.delete(`${import.meta.env.VITE_API}/admin/products`, {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    },
                    data: {
                        productIds: selectedIds
                    }
                })
                toast.success(data.message, {
                    position: 'bottom-right'
                })
                setSelectedIds([])
                getAdminProducts()
            } catch (error) {
                setDeleteError(error.response.data.message)
            }
        }
    }

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            width: 190
        },
        {
            field: 'price',
            headerName: 'Price',
            width: 130,
            align: 'right',
            headerAlign: 'right'
        },
        {
            field: 'stock',
            headerName: 'Stock',
            width: 100,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 140,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 130,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Link to={`/admin/product/${params.id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-pencil"></i>
                    </Link>
                    <button className="btn btn-danger py-1 px-2" onClick={() => deleteProductHandler(params.id)}>
                        <i className="fa fa-trash"></i>
                    </button>
                </div>
            )
        }
    ];

    const rows = products.map(product => ({
        id: product._id,
        name: product.name,
        price: `₱${formatPrice(product.price)}`,
        stock: product.stock,
        category: product.category,
    }));

    return (
        <>
            <MetaData title={'All Products'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <>
                        <h1 className="my-5">All Products</h1>

                        {loading ? <Loader /> : (
                            <>
                                <div style={{ width: 760, maxWidth: '100%', margin: '0 auto', overflowX: 'auto' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                                        <button
                                            className="btn btn-danger"
                                            onClick={bulkDeleteHandler}
                                            disabled={selectedIds.length === 0}
                                        >
                                            <i className="fa fa-trash"></i> Delete Selected ({selectedIds.length})
                                        </button>
                                    </div>
                                    <DataGrid
                                        rows={rows}
                                        columns={columns}
                                        sx={{ width: 760 }}
                                        checkboxSelection
                                        disableRowSelectionOnClick
                                        pageSizeOptions={[5, 10, 25]}
                                        initialState={{
                                            pagination: {
                                                paginationModel: { pageSize: 25, page: 0 }
                                            }
                                        }}
                                        rowSelectionModel={{ type: 'include', ids: new Set(selectedIds) }}
                                        onRowSelectionModelChange={(newSelection) => {
                                            setSelectedIds(newSelection.ids ? [...newSelection.ids] : [...newSelection])
                                        }}
                                    />
                                </div>
                            </>
                        )}

                    </>
                </div>
            </div>

        </>
    )
}

export default ProductsList
