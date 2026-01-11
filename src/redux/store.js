import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import dashboardReducer from './slices/dashboardSlice';
import vaultReducer from './slices/vaultSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    dashboard: dashboardReducer,
    vault: vaultReducer,
  },
 
});

export default store