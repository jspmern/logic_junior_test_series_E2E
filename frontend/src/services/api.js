const API_URL = 'http://localhost:5000/api';

// ─── Public routes that must NOT send an Authorization header ────────────────
// Everything else automatically gets the access token attached.
const PUBLIC_PATHS = [
    '/auth/login',
    '/auth/register',
    '/auth/forget-password',
    '/auth/send-otp',
    '/auth/verify-otp',
    '/auth/reset-password',
];

// ─── JWT helper ───────────────────────────────────────────────────────────────
const getJwtExpiry = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp ? payload.exp * 1000 : 0;
    } catch {
        return 0;
    }
};

// ─── Core interceptor ────────────────────────────────────────────────────────
// All API calls go through this function.
//   • Auto-attaches Authorization: Bearer <accessToken> for protected routes
//   • On 401 → clears localStorage + fires 'auth:expired' (App.jsx handles it)
const request = async (path, options = {}) => {
    const token = localStorage.getItem('accessToken');
    const isPublic = PUBLIC_PATHS.some(p => path.startsWith(p));

    // Merge headers — always include Content-Type for JSON bodies
    const headers = {
        ...(options.body && !(options.body instanceof FormData)
            ? { 'Content-Type': 'application/json' }
            : {}),
        ...(token && !isPublic ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    // Token rejected by server → force logout everywhere in the app
    if (response.status === 401 && !isPublic) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:expired'));
        throw new Error('Session expired. Please log in again.');
    }

    return response;
};

// ─── API methods ─────────────────────────────────────────────────────────────
const api = {
    // ── Auth (public) ──────────────────────────────────────────────────────────
    login: async (email, password) => {
        const response = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');

        if (data.data?.user) {
            const user = {
                ...data.data.user,
                avatar: data.data.user.photoUrl ||
                    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                id: data.data.user._id,
            };
            if (data.data.accessToken) {
                localStorage.setItem('accessToken', data.data.accessToken);
                localStorage.setItem('refreshToken', data.data.refreshToken);
                localStorage.setItem('user', JSON.stringify(user));
            }
            return user;
        }
        return data;
    },

    register: async (userData) => {
        const response = await request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) {
            if (data.errors && Array.isArray(data.errors)) {
                throw new Error(data.errors.map(e => e.msg).join(', ') || data.message || 'Registration failed');
            }
            throw new Error(data.message || 'Registration failed');
        }
        if (data.user) {
            return {
                ...data.user,
                avatar: data.user.photoUrl ||
                    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                id: data.user._id,
            };
        }
        return data;
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    // ── Session restore ────────────────────────────────────────────────────────
    getStoredAuth: () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            const userStr = localStorage.getItem('user');

            if (!refreshToken || !userStr) return null;

            const refreshExpiry = getJwtExpiry(refreshToken);
            if (refreshExpiry === 0 || Date.now() >= refreshExpiry) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                return null;
            }

            return { user: JSON.parse(userStr), accessToken, refreshToken };
        } catch {
            return null;
        }
    },

    // ── Protected ──────────────────────────────────────────────────────────────
    getCategories: async () => {
        const response = await request('/categories');
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch categories');
        return data.data;
    },

    getCourses: async () => {
        const response = await request('/courses');
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch courses');
        return data.data;
    },

    // getQuestions is protected — requires a valid access token
    getQuestions: async (courseId) => {
        const response = await request(`/questions?courseId=${courseId}`, {
            cache: 'no-store',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch questions');
        return data.data;
    },

    submitTestProgress: async ({ userId, courseId, questionIds, score, totalMarks }) => {
        const response = await request('/progress', {
            method: 'POST',
            body: JSON.stringify({ userId, courseId, questionIds, score, totalMarks }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to save test progress');
        return data;
    },

    getUserTestProgress: async (userId, courseId) => {
        const response = await request(`/progress?userId=${userId}&courseId=${courseId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch test progress');
        return data.data;
    },

    getUserAllProgress: async (userId) => {
        const response = await request(`/progress/all?userId=${userId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch all progress');
        return data.data;
    },

    forgotPassword: async (email) => {
        const response = await request('/auth/forget-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) {
            if (data.errors && Array.isArray(data.errors)) {
                throw new Error(data.errors.map(e => e.msg).join(', '));
            }
            throw new Error(data.message || 'Failed to send reset email');
        }
        return data;
    },

    sendOtp: async (email) => {
        const response = await request('/auth/send-otp', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
        return data;
    },

    verifyOtp: async (email, otp) => {
        const response = await request('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'OTP verification failed');
        return data;
    },

    resetPassword: async (token, email, newPassword, confirmPassword) => {
        const response = await request(`/auth/reset-password/${token}`, {
            method: 'POST',
            body: JSON.stringify({ email, newPassword, confirmPassword }),
        });
        const data = await response.json();
        if (!response.ok) {
            if (data.errors && Array.isArray(data.errors)) {
                throw new Error(data.errors.map(e => e.msg).join(', '));
            }
            throw new Error(data.message || 'Failed to reset password');
        }
        return data;
    },
};

export default api;
