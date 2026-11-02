import React, { useEffect, useState } from 'react'
import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import Sidebar from './SideBar'
import { Box, Typography, Rating, IconButton } from '@mui/material'
import { DeleteForever } from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import Swal from 'sweetalert2'
import axios from 'axios'
import { getToken } from '../Utils/helpers'

const AdminReviews = () => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const config = {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    }

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API}/admin/reviews`, config)
                setReviews(data.reviews || [])
                setError(null)
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load reviews')
            } finally {
                setLoading(false)
            }
        }
        fetchReviews()
    }, [])

    const configParams = {
        headers: { 'Authorization': `Bearer ${getToken()}` },
        params: {}
    }

    const handleDelete = (reviewId, productId) => {
        Swal.fire({
            title: 'Delete Review?',
            text: 'This will permanently remove the review.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff3b3b',
            cancelButtonColor: '#3f3f46',
            confirmButtonText: 'Yes, delete it',
            background: '#141414',
            color: '#fafafa'
        }).then(async (result) => {
            if (!result.isConfirmed) return
            try {
                configParams.params = { productId, id: reviewId }
                await axios.delete(`${import.meta.env.VITE_API}/reviews`, configParams)
                setReviews(prev => prev.filter(r => String(r._id) !== String(reviewId)))
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Review removed.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#141414',
                    color: '#fafafa'
                })
            } catch (err) {
                Swal.fire({
                    title: 'Delete failed',
                    text: err.response ? err.response.data.message : err.message,
                    icon: 'error',
                    background: '#141414',
                    color: '#fafafa'
                })
            }
        })
    }

    const columns = [
        {
            field: 'product',
            headerName: 'Product',
            width: 240,
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    title={params.row.product}
                    sx={{ fontWeight: 700, color: '#fafafa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}
                >
                    {params.row.product}
                </Typography>
            )
        },
        {
            field: 'rating',
            headerName: 'Rating',
            width: 110,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => <Rating value={params.row.rating} precision={0.5} readOnly size="small" sx={{ color: '#ff3b3b' }} />
        },
        {
            field: 'comment',
            headerName: 'Review',
            width: 440,
            renderCell: (params) => (
                <Box sx={{ width: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.25 }}>
                    <Typography
                        variant="body2"
                        title={params.row.comment}
                        sx={{ color: '#e5e7eb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                        {params.row.comment}
                    </Typography>
                    <Typography
                        variant="caption"
                        title={params.row.name}
                        sx={{ color: '#a1a1aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                        {params.row.name}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 85,
            align: 'center',
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton size="small" onClick={() => handleDelete(params.row._id, params.row.productId)} sx={{ color: '#ef4444' }}>
                    <DeleteForever fontSize="small" />
                </IconButton>
            )
        }
    ]

    return (
        <>
            <MetaData title={'Reviews'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    {/* plain div — NOT .wrapper (that's the flexbox class from the
                        Login/Register forms) */}
                    <div className="my-5">
                        <h1 className="mb-4 text-center">Reviews</h1>
                        {loading ? (
                            <Loader />
                        ) : error ? (
                            <Box sx={{ textAlign: 'center', py: 4, color: '#ef4444' }}>
                                <Typography variant="h6" fontWeight={700}>
                                    Failed to load reviews
                                </Typography>
                                <Typography variant="body2">{error}</Typography>
                            </Box>
                        ) : reviews.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4, color: '#a1a1aa' }}>
                                <Typography variant="h6" fontWeight={700}>
                                    No reviews yet
                                </Typography>
                                <Typography variant="body2">
                                    Be the first to review a product!
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ width: 875, maxWidth: '100%', mx: 'auto', overflowX: 'auto' }}>
                                <DataGrid
                                    rows={reviews}
                                    columns={columns}
                                    getRowId={(row) => row._id}
                                    initialState={{
                                        pagination: { paginationModel: { pageSize: 5, page: 0 } }
                                    }}
                                    rowHeight={68}
                                    pageSizeOptions={[5, 10, 25]}
                                    disableRowSelectionOnClick
                                    autoHeight
                                    className="admin-datagrid"
                                    sx={{
                                        width: 875,
                                        color: '#fafafa',
                                        border: '1px solid #262626',
                                        '& .MuiDataGrid-columnHeaders': { backgroundColor: '#141414', color: '#a1a1aa' },
                                        '& .MuiDataGrid-columnSeparator': { color: '#262626' },
                                        '& .MuiDataGrid-cell': { borderColor: '#262626' },
                                        '& .MuiDataGrid-row:hover': { backgroundColor: '#1c1c1c' },
                                        '& .MuiTablePagination-root, & .MuiTablePagination-selectIcon': { color: '#a1a1aa' },
                                        '& .MuiDataGrid-footerContainer': { borderColor: '#262626' }
                                    }}
                                />
                            </Box>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminReviews
