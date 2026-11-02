import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import Sidebar from './SideBar'
import { useDispatch, useSelector } from 'react-redux'
import { allOrders, clearErrors, updateOrder, deleteOrder } from '../../actions/orderActions'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid'
import Swal from 'sweetalert2'

const AdminOrders = () => {
    const dispatch = useDispatch()
    const { loading, error, orders } = useSelector(state => state.allOrders)
    const { isUpdated, error: updateError } = useSelector(state => state.updateOrder)
    const { isDeleted } = useSelector(state => state.deleteOrder)

    const [statusEdits, setStatusEdits] = useState({})
    const [updatingId, setUpdatingId] = useState(null)

    const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']

    useEffect(() => {
        dispatch(allOrders())

        if (error) {
            toast.error(error, { position: 'bottom-right' })
            dispatch(clearErrors())
        }
        if (updateError) {
            toast.error(updateError, { position: 'bottom-right' })
            setUpdatingId(null)
            dispatch(clearErrors())
        }
    }, [dispatch, error, updateError])

    const updateOrderHandler = (id) => {
        const status = statusEdits[id]
        if (!status) {
            toast.info('Select a new status first', { position: 'bottom-right' })
            return
        }
        setUpdatingId(id)
        dispatch(updateOrder(id, { status }))
    }

    const deleteOrderHandler = (id) => {
        Swal.fire({
            title: 'Delete Order?',
            text: 'This will permanently remove the order.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff3b3b',
            cancelButtonColor: '#3f3f46',
            confirmButtonText: 'Yes, delete it',
            background: '#141414',
            color: '#fafafa'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteOrder(id))
            }
        })
    }

    // Refresh after successful update/delete
    useEffect(() => {
        if (isUpdated) {
            toast.success('Order status updated', { position: 'bottom-right' })
            setUpdatingId(null)
            dispatch(clearErrors())
            dispatch(allOrders())
        }
    }, [isUpdated, dispatch])

    useEffect(() => {
        if (isDeleted) {
            toast.success('Order deleted', { position: 'bottom-right' })
            dispatch(clearErrors())
            dispatch(allOrders())
        }
    }, [isDeleted, dispatch])

    const statusColor = (status) => {
        switch (status) {
            case 'Delivered': return '#22c55e'
            case 'Shipped': return '#f59e0b'
            case 'Out for Delivery': return '#38bdf8'
            case 'Cancelled': return '#ef4444'
            case 'Pending': return '#a1a1aa'
            default: return '#a1a1aa'
        }
    }

    const columns = [
        {
            field: 'orderNumber',
            headerName: 'Order #',
            width: 115,
            renderCell: (params) => <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: 0.5, color: '#ff3b3b' }}>#{params.value}</span>
        },
        {
            field: 'numOfItems',
            headerName: 'Items',
            width: 90,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'totalPrice',
            headerName: 'Total',
            width: 125,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => <span style={{ color: '#ff3b3b', fontWeight: 700 }}>₱{Number(params.value).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        },
        {
            field: 'orderStatus',
            headerName: 'Status',
            width: 265,
            sortable: false,
            renderCell: (params) => (
                <div className="d-flex align-items-center" style={{ gap: '0.375rem' }}>
                    <span style={{
                        color: statusColor(params.value),
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        width: '105px',
                        flexShrink: 0
                    }}>
                        {params.value}
                    </span>
                    <select
                        className="form-control form-control-sm"
                        style={{ width: '125px', height: '28px', fontSize: '0.8rem', flexShrink: 0 }}
                        value={statusEdits[params.id] || params.value}
                        onChange={(e) => setStatusEdits({ ...statusEdits, [params.id]: e.target.value })}
                    >
                        {orderStatuses.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 140,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div className="d-flex">
                    <button
                        className="btn btn-primary py-1 px-2"
                        onClick={() => updateOrderHandler(params.id)}
                        disabled={updatingId === params.id || !statusEdits[params.id] || statusEdits[params.id] === params.row.orderStatus}
                    >
                        {updatingId === params.id ? '...' : 'Update'}
                    </button>
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteOrderHandler(params.id)}>
                        <i className="fa fa-trash"></i>
                    </button>
                </div>
            )
        }
    ];

    const rows = orders ? orders.map(o => ({
        id: o._id,
        orderNumber: o.orderNumber,
        numOfItems: o.orderItems ? o.orderItems.length : 0,
        totalPrice: o.totalPrice,
        orderStatus: o.orderStatus
    })) : []

    return (
        <>
            <MetaData title={'All Orders'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    {/* plain div — NOT .wrapper (that's the flexbox class from the
                        Login/Register forms, which made this heading sit BESIDE the
                        grid instead of stacked on top) */}
                    <div className="my-5">
                        <h1 className="mb-4 text-center">All Orders</h1>
                        {loading ? <Loader /> : (
                            <div style={{ width: 760, maxWidth: '100%', overflowX: 'auto', margin: '0 auto' }}>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    pageSize={10}
                                    rowsPerPageOptions={[10]}
                                    disableSelectionOnClick
                                    autoHeight
                                    className="admin-datagrid"
                                    sx={{
                                        width: 760,
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminOrders
