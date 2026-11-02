import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../Layout/Loader'
import { getUser } from '../Utils/helpers'

const ProtectedRoute = ({ children, isAdmin = false }) => {
    const { isAuthenticated, loading, user } = useSelector(state => state.auth)
    const sessionUser = getUser()
    const currentUser = user || sessionUser

    if (loading) {
        return <Loader />
    }

    if (!isAuthenticated && !sessionUser) {
        return <Navigate to='/login' />
    }

    if (isAdmin === true && currentUser && currentUser.role !== 'admin') {
        return <Navigate to='/' />
    }

    return children;
};

export default ProtectedRoute;

