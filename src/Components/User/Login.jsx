import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Divider,
    CircularProgress
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

import Loader from '../Layout/Loader'
import MetaData from '../Layout/MetaData'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import { login, firebaseLogin, clearErrors } from '../../actions/userActions'
import { firebaseAuth, isFirebaseConfigured, googleProvider, signInWithSocial, friendlyAuthError } from '../../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import '../Auth/Auth.css'

const Login = () => {
    const { isAuthenticated, error, loading, user } = useSelector(state => state.auth)
    const [showPassword, setShowPassword] = useState(false)
    let navigate = useNavigate()
    let location = useLocation()
    const dispatch = useDispatch()

    const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : ''

    // YUP validation schema
    const loginSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters')
    })

    // Formik submit handler
    const onSubmit = (values, { setSubmitting }) => {
        dispatch(login(values.email.trim(), values.password))
        setSubmitting(false)
    }

    // Login with Firebase Authentication (email + password)
    const firebaseLoginHandler = async (e, formikHelpers) => {
        e.preventDefault()

        if (!isFirebaseConfigured) {
            toast.error('Firebase is not configured yet. Add VITE_FIREBASE_* keys to frontend/.env', {
                position: 'bottom-right'
            })
            formikHelpers.setSubmitting(false)
            return
        }

        const { email, password } = formikHelpers.values;
        try {
            const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password)
            const idToken = await userCredential.user.getIdToken()
            dispatch(firebaseLogin(idToken))
        } catch (err) {
            toast.error(friendlyAuthError(err), { position: 'bottom-right' })
        } finally {
            formikHelpers.setSubmitting(false)
        }
    }

    // Social login handlers
    const socialLoginHandler = async (provider, { setSubmitting }) => {
        if (!isFirebaseConfigured) {
            toast.error('Firebase is not configured yet', { position: 'bottom-right' })
            setSubmitting(false)
            return
        }
        try {
            const userCredential = await signInWithSocial(provider)
            const idToken = await userCredential.user.getIdToken()
            dispatch(firebaseLogin(idToken, userCredential.user.displayName))
        } catch (err) {
            toast.error(friendlyAuthError(err), { position: 'bottom-right' })
        } finally {
            setSubmitting(false)
        }
    }

    const googleLoginHandler = (e, formikHelpers) => { e.preventDefault(); socialLoginHandler(googleProvider, formikHelpers) }

    useEffect(() => {
        if (isAuthenticated) {
            if (redirect) {
                navigate(`/${redirect}`)
            } else if (user && user.role === 'admin') {
                navigate('/dashboard')
            } else {
                navigate('/')
            }
        }
        if (error) {
            toast.error(error, { position: 'bottom-right' })
            dispatch(clearErrors())
        }
    }, [error, isAuthenticated, user, dispatch, navigate, redirect])

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <MetaData title={'Login'} />

                    <div className="auth-page">
                        <div className="auth-container">
                            <div className="auth-card">
                                <div className="auth-header">
                                    <Typography variant="h4" fontWeight={800}>Welcome Back</Typography>
                                    <Typography color="text.secondary">Sign in to continue to Step Central</Typography>
                                </div>

                                <Formik
                                    initialValues={{ email: '', password: '' }}
                                    validationSchema={loginSchema}
                                    onSubmit={onSubmit}
                                    validateOnChange={false}
                                    validateOnBlur={false}
                                >
                                    {({ errors, touched, isSubmitting, setSubmitting, values, handleChange, handleBlur }) => (
                                        <Form className="auth-form">
                                            <TextField
                                                fullWidth
                                                id="email_field"
                                                name="email"
                                                label="Email"
                                                placeholder="you@example.com"
                                                type="email"
                                                sx={{ mb: 2 }}
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(errors.email && touched.email)}
                                                helperText={errors.email && touched.email ? errors.email : ''}
                                            />

                                            <TextField
                                                fullWidth
                                                id="password_field"
                                                name="password"
                                                label="Password"
                                                placeholder="••••••••"
                                                type={showPassword ? 'text' : 'password'}
                                                sx={{ mb: 1 }}
                                                value={values.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={Boolean(errors.password && touched.password)}
                                                helperText={errors.password && touched.password ? errors.password : ''}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                edge="end"
                                                                sx={{ color: '#6b6b72' }}
                                                                aria-label="toggle password visibility"
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />

                                            <Box sx={{ textAlign: 'right', mb: 2 }}>
                                                <Link to="/password/forgot" className="forgot-link">
                                                    Forgot Password?
                                                </Link>
                                            </Box>

                                            <Button
                                                id="login_button"
                                                type="submit"
                                                variant="contained"
                                                fullWidth
                                                size="large"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <CircularProgress size={20} sx={{ color: '#fff', mr: 1 }} />
                                                        Signing in...
                                                    </>
                                                ) : 'Sign In'}
                                            </Button>

                                            <Divider sx={{ my: 3, color: '#52525b', fontSize: '0.8rem' }}>
                                                or continue with
                                            </Divider>

                                            {isFirebaseConfigured && (
                                                <>
                                                    <Button
                                                        id="google_login_button"
                                                        type="button"
                                                        variant="outlined"
                                                        fullWidth
                                                        size="large"
                                                        onClick={(e) => googleLoginHandler(e, { setSubmitting, values })}
                                                        disabled={isSubmitting}
                                                        startIcon={
                                                            <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
                                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                                            </svg>
                                                        }
                                                    >
                                                        Continue with Google
                                                    </Button>
                                                </>
                                            )}

                                            <Box sx={{ textAlign: 'center', mt: 3 }}>
                                                <Link to="/register" className="auth-footer-link" style={{ display: 'inline' }}>
                                                    Don't have an account? <strong>Create one</strong>
                                                </Link>
                                            </Box>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
export default Login
