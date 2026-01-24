import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import dashboardReducer from './slices/dashboardSlice';
import vaultReducer from './slices/vaultSlice';
import arbitrageReducer from './slices/arbitrageslice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    dashboard: dashboardReducer,
    vault: vaultReducer,
    arbitrage: arbitrageReducer,
    settings: settingsReducer
  },
});

export default store