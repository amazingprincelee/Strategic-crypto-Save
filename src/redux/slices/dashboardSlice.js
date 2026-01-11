import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../../services/api";

/* ======================
  FETCH DASHBOARD DATA
====================== */
export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (_, thunkAPI) => {
    try {
      const response = await authAPI.get('/dashboard');
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch dashboard data";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

/* ======================
  FETCH DASHBOARD STATS
====================== */
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, thunkAPI) => {
    try {
      const response = await authAPI.get('/user/stats');
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch stats";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

/* ======================
  FETCH VAULTS
====================== */
export const fetchVaults = createAsyncThunk(
  "dashboard/fetchVaults",
  async (params = {}, thunkAPI) => {
    try {
      const response = await authAPI.get('/vaults', { params });
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch vaults";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

/* ======================
  INITIAL STATE
====================== */
const initialState = {
  // Dashboard data
  stats: {
    totalInvested: 0,
    activeVaults: 0,
    portfolioValue: 0,
    totalInvestments: 0,
    totalReturns: 0,
  },
  recentActivity: [],
  vaults: [],
  vaultsMeta: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  },
  
  // Loading states
  loading: {
    dashboard: false,
    stats: false,
    vaults: false,
  },
  
  // Error and success
  error: null,
  successMessage: null,
};

/* ======================
  DASHBOARD SLICE
====================== */
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // Clear messages
    clearDashboardMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    
    // Reset dashboard state
    resetDashboardState: (state) => {
      return initialState;
    },
    
    // Update single stat
    updateStat: (state, action) => {
      const { key, value } = action.payload;
      if (state.stats.hasOwnProperty(key)) {
        state.stats[key] = value;
      }
    },
  },
  
  extraReducers: (builder) => {
    /* ===== FETCH DASHBOARD ===== */
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading.dashboard = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading.dashboard = false;
        state.stats = action.payload.stats || state.stats;
        state.recentActivity = action.payload.recentActivity || [];
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading.dashboard = false;
        state.error = action.payload?.message || "Failed to fetch dashboard";
      });

    /* ===== FETCH STATS ===== */
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading.stats = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = { ...state.stats, ...action.payload };
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.payload?.message || "Failed to fetch stats";
      });

    /* ===== FETCH VAULTS ===== */
    builder
      .addCase(fetchVaults.pending, (state) => {
        state.loading.vaults = true;
        state.error = null;
      })
      .addCase(fetchVaults.fulfilled, (state, action) => {
        state.loading.vaults = false;
        state.vaults = action.payload.vaults || [];
        state.vaultsMeta = {
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
          total: action.payload.total || 0,
          limit: action.payload.limit || 10,
        };
      })
      .addCase(fetchVaults.rejected, (state, action) => {
        state.loading.vaults = false;
        state.error = action.payload?.message || "Failed to fetch vaults";
      });
  },
});

export const {
  clearDashboardMessages,
  resetDashboardState,
  updateStat,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;