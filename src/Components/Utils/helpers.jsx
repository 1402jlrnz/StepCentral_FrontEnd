import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const getUser = () => {
    if (typeof window !== 'undefined') {
        if (sessionStorage.getItem('user')) {
            try {
                return JSON.parse(sessionStorage.getItem('user'));
            } catch (e) {
                return false;
            }
        } else {
            return false;
        }
    }
};

export const authenticate = (data, next) => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('token', JSON.stringify(data.token));
        sessionStorage.setItem('user', JSON.stringify(data.user));
    }
    if (next) next();
};

export const logout = next => {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    }
    if (next) next();
};

export const getToken = () => {
    if (typeof window !== 'undefined') {
        if (sessionStorage.getItem('token')) {
            try {
                return JSON.parse(sessionStorage.getItem('token'));
            } catch (e) {
                return false;
            }
        } else {
            return false;
        }
    }
};

export const errMsg = (message = '') => toast.error(message, {
    position: 'bottom-center'
});
export const successMsg = (message = '') => toast.success(message, {
    position: 'bottom-center'
});
// Format a number as Philippine Peso (₱) with thousand separators
export const formatPrice = (value) => {
    const num = Number(value) || 0;
    return num.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Short display order number (last 6 chars of the Mongo id) — takes far less
// table space than the full 24-char id
export const orderNumber = (id) => String(id || '').slice(-6).toUpperCase();

// Force every product photo into one consistent aspect ratio via Cloudinary
// so all pictures are the same size and labels never shift position
export const productImageUrl = (url) => {
    if (!url) return url
    if (!url.includes('res.cloudinary.com')) return url
    return url.replace(/\/image\/upload\//, '/image/upload/c_fill,ar_4:3,q_auto/')
}
