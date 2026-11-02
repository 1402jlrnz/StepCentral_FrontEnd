import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import {
    Box,
    Typography,
    TextField,
    Button,
    Divider,
    Avatar,
    CircularProgress
} from '@mui/material'

import MetaData from '../Layout/MetaData'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { register, firebaseLogin, clearErrors } from '../../actions/userActions'
import { firebaseAuth, isFirebaseConfigured, googleProvider, signInWithSocial, friendlyAuthError } from '../../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import '../Auth/Auth.css'

// YUP validation schema
const registerSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
})

const Register = () => {
    const dispatch = useDispatch()
    const { isAuthenticated, user, error } = useSelector(state => state.auth);
    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')

    let navigate = useNavigate()

    // Redirect after successful registration (mirrors Login.jsx behavior)
    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'admin') {
                navigate('/dashboard')
            } else {
                navigate('/')
            }
        }
    }, [isAuthenticated, user, navigate])

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'bottom-right' });
            dispatch(clearErrors());
        }
    }, [error, dispatch])

    // Formik submit handler for standard register
    const onSubmit = (values, { setSubmitting }) => {
        const userData = { name: values.name, email: values.email, password: values.password, avatar }
        dispatch(register(userData))
        setSubmitting(false)
        toast.success('Account created successfully! Redirecting...', { position: 'bottom-right' })
    }

    // Register with Firebase Authentication (email + password)
    const firebaseRegisterHandler = async (e, formikHelpers) => {
        e.preventDefault();

        if (!isFirebaseConfigured) {
            toast.error('Firebase is not configured yet. Add VITE_FIREBASE_* keys to frontend/.env', {
                position: 'bottom-right'
            });
            formikHelpers.setSubmitting(false)
            return
        }

        const { name, email, password } = formikHelpers.values;
        try {
            const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password)
            const idToken = await userCredential.user.getIdToken()
            dispatch(firebaseLogin(idToken, name))
            toast.success('Registered with Firebase!', { position: 'bottom-right' })
        } catch (err) {
            toast.error(friendlyAuthError(err), { position: 'bottom-right' })
        } finally {
            formikHelpers.setSubmitting(false)
        }
    }

    // Social register handlers
    const socialRegisterHandler = async (provider, formikHelpers) => {
        if (!isFirebaseConfigured) {
            toast.error('Firebase is not configured yet', { position: 'bottom-right' });
            formikHelpers.setSubmitting(false)
            return
        }
        try {
            const userCredential = await signInWithSocial(provider)
            const idToken = await userCredential.user.getIdToken()
            dispatch(firebaseLogin(idToken, userCredential.user.displayName))
            toast.success('Registered with Google!', { position: 'bottom-right' })
        } catch (err) {
            toast.error(friendlyAuthError(err), { position: 'bottom-right' })
        } finally {
            formikHelpers.setSubmitting(false)
        }
    }

    const googleRegisterHandler = (e, formikHelpers) => { e.preventDefault(); socialRegisterHandler(googleProvider, formikHelpers) }

    const handleAvatarChange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }
        reader.readAsDataURL(e.target.files[0])
    }

    return (
        <>
            <MetaData title={'Register User'} />
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card register-card">
                        <div className="auth-header">
                            <Typography variant="h4" fontWeight={800}>Create Account</Typography>
                            <Typography color="text.secondary">Join Step Central</Typography>
                        </div>

                        <Formik
                            initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                            validationSchema={registerSchema}
                            onSubmit={onSubmit}
                            validateOnChange={false}
                            validateOnBlur={false}
                        >
                            {({ errors, touched, isSubmitting, setSubmitting, values, handleChange, handleBlur }) => (
                                <Form className="auth-form">
                                    <TextField
                                        fullWidth
                                        id="name_field"
                                        name="name"
                                        label="Name"
                                        sx={{ mb: 2 }}
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(errors.name && touched.name)}
                                        helperText={errors.name && touched.name ? errors.name : ''}
                                    />

                                    <TextField
                                        fullWidth
                                        id="email_field"
                                        name="email"
                                        label="Email"
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
                                        type="password"
                                        sx={{ mb: 2 }}
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(errors.password && touched.password)}
                                        helperText={errors.password && touched.password ? errors.password : ''}
                                    />

                                    <TextField
                                        fullWidth
                                        id="confirm_password_field"
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        type="password"
                                        sx={{ mb: 2 }}
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(errors.confirmPassword && touched.confirmPassword)}
                                        helperText={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : ''}
                                    />

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <Avatar
                                            src={avatarPreview}
                                            alt="Avatar Preview"
                                            sx={{ width: 56, height: 56, border: '1px solid #2a2a2a' }}
                                        />
                                        <Box>
                                            <Button
                                                variant="outlined"
                                                component="label"
                                                size="small"
                                                htmlFor="register_avatar_input"
                                            >
                                                Choose Avatar
                                            </Button>
                                            <input
                                                hidden
                                                id="register_avatar_input"
                                                accept="image/*"
                                                type="file"
                                                name="avatar"
                                                className="custom-file-input"
                                                onChange={handleAvatarChange}
                                            />
                                            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                                                PNG or JPG
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Button
                                        id="register_button"
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <CircularProgress size={20} sx={{ color: '#fff', mr: 1 }} />
                                                Creating account...
                                            </>
                                        ) : 'Create Account'}
                                    </Button>

                                    <Divider sx={{ my: 3, color: '#52525b', fontSize: '0.8rem' }}>
                                        or sign up with
                                    </Divider>

                                    {isFirebaseConfigured && (
                                        <>
                                            <Button
                                                id="google_register_button"
                                                type="button"
                                                variant="outlined"
                                                fullWidth
                                                size="large"
                                                onClick={(e) => googleRegisterHandler(e, { setSubmitting, values })}
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
                                        <a href="/login" className="auth-footer-link" style={{ display: 'inline' }}>
                                            Already have an account? <strong>Sign in</strong>
                                        </a>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register
