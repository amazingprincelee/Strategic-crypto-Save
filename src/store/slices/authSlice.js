import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { authAPI, userAPI } from '../../services/api';

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.data.success) {
        const { user, tokens } = response.data.data;
        localStorage.setItem('token', tokens.accessToken);
        return { token: tokens.accessToken, user };
      } else {
        return rejectWithValue('Invalid email or password');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.data.success) {
        return response.data;
      } else {
        return rejectWithValue('Registration failed');
      }
    } catch (error) {
      const errorData = error.response?.data;
      
      // Handle validation errors with detailed field information
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        const validationErrors = errorData.errors.map(err => `${err.field}: ${err.message}`).join(', ');
        return rejectWithValue({
          type: 'validation',
          message: errorData.message || 'Validation failed',
          details: errorData.errors,
          formattedMessage: validationErrors
        });
      }
      
      // Handle general errors
      const message = errorData?.message || 'Registration failed. Please try again.';
      return rejectWithValue({
        type: 'general',
        message,
        formattedMessage: message
      });
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await userAPI.getProfile();
      
      if (response.data.success) {
        return { user: response.data.data.user, token };
      } else {
        localStorage.removeItem('token');
        return rejectWithValue('Token invalid');
      }
    } catch (error) {
      localStorage.removeItem('token');
      return rejectWithValue('Authentication check failed');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateProfile(userData);
      
      if (response.data.success) {
        return response.data.data.user;
      } else {
        return rejectWithValue('Profile update failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: !!localStorage.getItem('token'), // Set loading to true if token exists
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      toast.info('Logged out successfully');
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        toast.success('Login successful!');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        toast.error(action.payload);
      })
      
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        toast.success('Registration successful! Please login to continue.');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        const errorPayload = action.payload;
        
        if (typeof errorPayload === 'object' && errorPayload.formattedMessage) {
          state.error = errorPayload;
          toast.error(errorPayload.formattedMessage);
        } else {
          state.error = { type: 'general', message: errorPayload, formattedMessage: errorPayload };
          toast.error(errorPayload);
        }
      })
      
      // Check auth cases
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Update profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
        toast.success('Profile updated successfully!');
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;