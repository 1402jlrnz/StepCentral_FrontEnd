import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, cancelOrder, clearErrors } from '../../actions/orderActions'
import { CANCEL_ORDER_RESET } from '../../constants/orderConstants'
import { formatPrice, orderNumber } from '../Utils/helpers'
import Swal from 'sweetalert2'

const OrderDetails = () => {
    const dispatch = useDispatch();
    const { loading, error, order = {} } = useSelector(state => state.orderDetails);
    const { isCancelled, error: cancelError } = useSelector(state => state.cancelOrder);
    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order
    let { id } = useParams();

    useEffect(() => {
        dispatch(getOrderDetails(id))

        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }, [error, id])

    // React to cancel results
    useEffect(() => {
        if (cancelError) {
            toast.error(cancelError, { position: 'bottom-right' })
            dispatch(clearErrors())
        }
        if (isCancelled) {
            toast.success('Order cancelled — stock has been restored', { position: 'bottom-right' })
            dispatch({ type: CANCEL_ORDER_RESET })
            dispatch(getOrderDetails(id))
        }
    }, [cancelError, isCancelled, dispatch, id])

    const cancelHandler = () => {
        Swal.fire({
            title: 'Cancel Order?',
            text: 'This will cancel your pending order and return the items to stock.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff3b3b',
            cancelButtonColor: '#3f3f46',
            confirmButtonText: 'Yes, cancel it',
            background: '#141414',
            color: '#fafafa'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(cancelOrder(id))
            }
        })
    }

    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`

    const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false

    return (
        <>
            <MetaData title={'Order Details'} />

            {loading ? <Loader /> : (
                <>
                    <div className="row d-flex justify-content-between">
                        <div className="col-12 col-lg-8 mt-5 order-details">

                            <h1 className="my-5">Order #{order.orderNumber}</h1>

                            <h4 className="mb-4">Shipping Info</h4>
                            <p><b>Name:</b> {user && user.name}</p>
                            <p><b>Phone:</b> {shippingInfo && shippingInfo.phoneNo}</p>
                            <p className="mb-4"><b>Address:</b>{shippingDetails}</p>
                            <p><b>Amount:</b> ₱{formatPrice(totalPrice)}</p>

                            <hr />

                            <h4 className="my-4">Payment</h4>
                            <p className={isPaid ? "greenColor" : "redColor"}>
                                <b>{isPaid ? "PAID" : "NOT PAID"}</b>
                                {paymentInfo && paymentInfo.method ? ` (${paymentInfo.method})` : ''}
                            </p>


                            <h4 className="my-4">Order Status:</h4>
                            <p className={
                                orderStatus === 'Delivered' ? "greenColor"
                                    : orderStatus === 'Cancelled' ? "redColor"
                                        : "orangeColor"
                            }><b>{orderStatus}</b></p>

                            {orderStatus === 'Pending' && (
                                <button
                                    className="btn btn-danger btn-sm mb-3"
                                    onClick={cancelHandler}
                                    disabled={loading}
                                >
                                    Cancel This Order
                                </button>
                            )}


                            <h4 className="my-4">Order Items:</h4>

                            <hr />
                            <div className="cart-item my-1">
                                {orderItems && orderItems.map(item => (
                                    <div key={item.product} className="row my-5">
                                        <div className="col-4 col-lg-2">
                                            <img src={item.image} alt={item.name} height="45" width="65" />
                                        </div>

                                        <div className="col-5 col-lg-5">
                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                        </div>


                                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                            <p>₱{formatPrice(item.price)}</p>
                                        </div>

                                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                            <p>{item.quantity} Piece(s)</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <hr />
                        </div>
                    </div>
                </>
            )}

        </>
    )
}

export default OrderDetails