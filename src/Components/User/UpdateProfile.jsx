import React, { useState, useEffect } from 'react'
import { TextField, Button, Card, Avatar, Box, Typography } from '@mui/material'
import MetaData from '../Layout/MetaData'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateProfile, loadUser, clearErrors } from '../../actions/userActions'

import { UPDATE_PROFILE_RESET } from '../../constants/userConstants'
import { useDispatch, useSelector } from 'react-redux'
import '../Auth/Auth.css'


const UpdateProfile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { error, isUpdated, loading } = useSelector(state => state.user)


    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')
    let navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar ? user.avatar.url : '/images/default_avatar.jpg')
        }
        if (error) {
            toast.error(error, {
                position: 'bottom-right'
            });
            dispatch(clearErrors());
        }
        if (isUpdated) {
            toast.success('User updated successfully', {
                position: 'bottom-right'
            })
            dispatch(loadUser());
            navigate('/me', { replace: true })
            dispatch({
                type: UPDATE_PROFILE_RESET
            })
        }
    }, [dispatch, error, isUpdated, navigate, user])

    const submitHandler = (e) => {
        e.preventDefault();
        const userData = { name, email, avatar }
        dispatch(updateProfile(userData))
    }

    const onChange = e => {
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
            <MetaData title={'Update Profile'} />

            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card">
                        <div className="auth-header">
                            <Typography variant="h4" fontWeight={800}>Update Profile</Typography>
                            <Typography color="text.secondary">Keep your account details fresh</Typography>
                        </div>

                        <form className="auth-form" onSubmit={submitHandler}>
                            <TextField
                                fullWidth
                                id="name_field"
                                name="name"
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                id="email_field"
                                name="email"
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ mb: 3 }}
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
                                    >
                                        Choose Avatar
                                        <input
                                            hidden
                                            type="file"
                                            name="avatar"
                                            accept="image/*"
                                            onChange={onChange}
                                        />
                                    </Button>
                                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                                        PNG or JPG
                                    </Typography>
                                </Box>
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdateProfile
