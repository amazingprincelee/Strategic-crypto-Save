import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../../services/api";

/* ======================
  FETCH ARBITRAGE OPPORTUNITIES
====================== */
export const fetchArbitrageOpportunities = createAsyncThunk(
  "arbitrage/fetchOpportunities",
  async (params = {}, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.minProfit) queryParams.append('minProfit', params.minProfit);
      if (params.minVolume) queryParams.append('minVolume', params.minVolume);
      if (params.coin) queryParams.append('coin', params.coin);
      
      const response = await authAPI.get(`/arbitrage/opportunities?${queryParams.toString()}`);
      
      // Backend returns { success: true, data: [...opportunities], timestamp, message }
      // We need the data array
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch arbitrage opportunities";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

/* ======================
  REFRESH ARBITRAGE OPPORTUNITIES (Force refresh - clears cache)
====================== */
export const refreshArbitrageOpportunities = createAsyncThunk(
  "arbitrage/refreshOpportunities",
  async (params = {}, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.minProfit) queryParams.append('minProfit', params.minProfit);
      if (params.minVolume) queryParams.append('minVolume', params.minVolume);
      if (params.coin) queryParams.append('coin', params.coin);
      
      const response = await authAPI.post(`/arbitrage/refresh?${queryParams.toString()}`);
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to refresh arbitrage opportunities";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

/* ======================
  EXECUTE ARBITRAGE TRADE
====================== */
export const executeArbitrageTrade = createAsyncThunk(
  "arbitrage/executeTrade",
  async (tradeData, thunkAPI) => {
    try {
      const response = await authAPI.post('/arbitrage/execute', tradeData);
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to execute arbitrage trade";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

/* ======================
  FETCH EXCHANGE STATUS
====================== */
export const fetchExchangeStatus = createAsyncThunk(
  "arbitrage/fetchExchangeStatus",
  async (_, thunkAPI) => {
    try {
      const response = await authAPI.get('/arbitrage/exchanges/status');
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch exchange status";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

/* ======================
  FETCH ARBITRAGE HISTORY
====================== */
export const fetchArbitrageHistory = createAsyncThunk(
  "arbitrage/fetchHistory",
  async (params = {}, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.page) queryParams.append('page', params.page);
      
      const response = await authAPI.get(`/arbitrage/history?${queryParams.toString()}`);
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch arbitrage history";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

/* ======================
  INITIAL STATE
====================== */
const initialState = {
  // Arbitrage data
  opportunities: [],
  exchangeStatus: [],
  history: [],
  stats: {
    totalOpportunities: 0,
    avgProfitMargin: 0,
    activeTransfers: 0,
    totalVolume: 0,
    executedTrades: 0,
    totalProfit: 0
  },
  
  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 50
  },
  
  // Loading states
  loading: {
    opportunities: false,
    exchanges: false,
    history: false,
    executing: false
  },
  
  // Last update timestamp
  lastUpdate: null,
  
  // Error and success
  error: null,
  successMessage: null,
};

/* ======================
  ARBITRAGE SLICE
====================== */
const arbitrageSlice = createSlice({
  name: "arbitrage",
  initialState,
  reducers: {
    // Clear messages
    clearArbitrageMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    
    // Reset arbitrage state
    resetArbitrageState: (state) => {
      return initialState;
    },
    
    // Update stats
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    
    // Set last update
    setLastUpdate: (state) => {
      state.lastUpdate = new Date().toISOString();
    }
  },
  
  extraReducers: (builder) => {
    /* ===== FETCH OPPORTUNITIES ===== */
    builder
      .addCase(fetchArbitrageOpportunities.pending, (state) => {
        state.loading.opportunities = true;
        state.error = null;
      })
      .addCase(fetchArbitrageOpportunities.fulfilled, (state, action) => {
        state.loading.opportunities = false;
        // Backend returns opportunities array directly in action.payload
        state.opportunities = action.payload || [];
        
        // Calculate stats from opportunities
        const opps = action.payload || [];
        state.stats = {
          ...state.stats,
          totalOpportunities: opps.length,
          avgProfitMargin: opps.length > 0 
            ? opps.reduce((acc, opp) => acc + opp.profitMargin, 0) / opps.length 
            : 0,
          activeTransfers: opps.filter(opp => opp.transferEnabled).length,
          totalVolume: opps.reduce((acc, opp) => acc + opp.volume, 0)
        };
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(fetchArbitrageOpportunities.rejected, (state, action) => {
        state.loading.opportunities = false;
        state.error = action.payload?.message || "Failed to fetch opportunities";
      });

    /* ===== REFRESH OPPORTUNITIES ===== */
    builder
      .addCase(refreshArbitrageOpportunities.pending, (state) => {
        state.loading.opportunities = true;
        state.error = null;
      })
      .addCase(refreshArbitrageOpportunities.fulfilled, (state, action) => {
        state.loading.opportunities = false;
        state.opportunities = action.payload || [];
        
        // Calculate stats from opportunities
        const opps = action.payload || [];
        state.stats = {
          ...state.stats,
          totalOpportunities: opps.length,
          avgProfitMargin: opps.length > 0 
            ? opps.reduce((acc, opp) => acc + opp.profitMargin, 0) / opps.length 
            : 0,
          activeTransfers: opps.filter(opp => opp.transferEnabled).length,
          totalVolume: opps.reduce((acc, opp) => acc + opp.volume, 0)
        };
        state.lastUpdate = new Date().toISOString();
        state.successMessage = "Arbitrage data refreshed successfully";
      })
      .addCase(refreshArbitrageOpportunities.rejected, (state, action) => {
        state.loading.opportunities = false;
        state.error = action.payload?.message || "Failed to refresh opportunities";
      });

    /* ===== EXECUTE TRADE ===== */
    builder
      .addCase(executeArbitrageTrade.pending, (state) => {
        state.loading.executing = true;
        state.error = null;
      })
      .addCase(executeArbitrageTrade.fulfilled, (state, action) => {
        state.loading.executing = false;
        state.successMessage = "Trade executed successfully";
        state.stats.executedTrades += 1;
        state.stats.totalProfit += action.payload.profit || 0;
      })
      .addCase(executeArbitrageTrade.rejected, (state, action) => {
        state.loading.executing = false;
        state.error = action.payload?.message || "Failed to execute trade";
      });

    /* ===== FETCH EXCHANGE STATUS ===== */
    builder
      .addCase(fetchExchangeStatus.pending, (state) => {
        state.loading.exchanges = true;
        state.error = null;
      })
      .addCase(fetchExchangeStatus.fulfilled, (state, action) => {
        state.loading.exchanges = false;
        state.exchangeStatus = action.payload || [];
      })
      .addCase(fetchExchangeStatus.rejected, (state, action) => {
        state.loading.exchanges = false;
        state.error = action.payload?.message || "Failed to fetch exchange status";
      });

    /* ===== FETCH HISTORY ===== */
    builder
      .addCase(fetchArbitrageHistory.pending, (state) => {
        state.loading.history = true;
        state.error = null;
      })
      .addCase(fetchArbitrageHistory.fulfilled, (state, action) => {
        state.loading.history = false;
        state.history = action.payload.history || [];
        state.pagination = {
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
          total: action.payload.total || 0,
          limit: action.payload.limit || 50
        };
      })
      .addCase(fetchArbitrageHistory.rejected, (state, action) => {
        state.loading.history = false;
        state.error = action.payload?.message || "Failed to fetch history";
      });
  },
});

export const {
  clearArbitrageMessages,
  resetArbitrageState,
  updateStats,
  setLastUpdate
} = arbitrageSlice.actions;

export default arbitrageSlice.reducer;