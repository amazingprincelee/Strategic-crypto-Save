import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

// Async thunks - Using authAPI like the rest of the project
export const fetchUserSettings = createAsyncThunk(
  'settings/fetchUserSettings',
  async (userId, { rejectWithValue }) => {
    try {
      const endpoint = userId ? `/settings/${userId}` : '/settings';
      const response = await authAPI.get(endpoint);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch settings');
    }
  }
);

export const updateArbitrageSettings = createAsyncThunk(
  'settings/updateArbitrageSettings',
  async ({ userId, settings }, { rejectWithValue }) => {
    try {
      const endpoint = userId ? `/settings/${userId}/arbitrage` : '/settings/arbitrage';
      const response = await authAPI.put(endpoint, settings);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update settings');
    }
  }
);

export const updateVaultSettings = createAsyncThunk(
  'settings/updateVaultSettings',
  async ({ userId, settings }, { rejectWithValue }) => {
    try {
      const endpoint = userId ? `/settings/${userId}/vault` : '/settings/vault';
      const response = await authAPI.put(endpoint, settings);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update settings');
    }
  }
);

export const updateSelectedExchanges = createAsyncThunk(
  'settings/updateSelectedExchanges',
  async ({ userId, exchanges }, { rejectWithValue }) => {
    try {
      const endpoint = userId ? `/settings/${userId}/exchanges` : '/settings/exchanges';
      const response = await authAPI.put(endpoint, { exchanges });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update exchanges');
    }
  }
);

// Fetch all available CCXT exchanges from arbitrage endpoint
export const fetchAllExchanges = createAsyncThunk(
  'settings/fetchAllExchanges',
  async (_, { rejectWithValue }) => {
    try {
      // Use the arbitrage fetch-exchanges endpoint which returns all CCXT exchanges
      const response = await authAPI.get('/arbitrage/fetch-exchanges');

      // Transform the array of exchange IDs into objects for the UI
      const exchangeIds = response.data.exchanges || [];
      const exchangeObjects = exchangeIds.map(id => ({
        exchangeId: id,
        name: id.charAt(0).toUpperCase() + id.slice(1), // Capitalize first letter
        active: true
      }));

      return exchangeObjects;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch exchanges');
    }
  }
);

// Get currently enabled exchanges for scanning
export const fetchEnabledExchanges = createAsyncThunk(
  'settings/fetchEnabledExchanges',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.get('/arbitrage/exchanges');
      return response.data.enabledExchanges || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch enabled exchanges');
    }
  }
);

// Update enabled exchanges for arbitrage scanning
export const updateEnabledExchanges = createAsyncThunk(
  'settings/updateEnabledExchanges',
  async (exchanges, { rejectWithValue }) => {
    try {
      const response = await authAPI.put('/arbitrage/exchanges', { exchanges });
      return response.data.enabledExchanges || exchanges;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update enabled exchanges');
    }
  }
);

export const syncExchanges = createAsyncThunk(
  'settings/syncExchanges',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.post('/exchanges/sync');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to sync exchanges');
    }
  }
);

export const resetSettings = createAsyncThunk(
  'settings/resetSettings',
  async ({ userId, section }, { rejectWithValue }) => {
    try {
      const endpoint = userId ? `/settings/${userId}/reset/${section}` : `/settings/reset/${section}`;
      const response = await authAPI.post(endpoint);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to reset settings');
    }
  }
);

// Default settings (used before API fetch)
const defaultArbitrageSettings = {
  filters: {
    minProfitPercent: 0.001,
    minVolume: 0.0001,
    includeZeroVolume: false,
    requireTransferable: false,
    maxRisk: 'High',
    showOnlyProfitable: false
  },
  display: {
    sortBy: 'profitPercent',
    sortOrder: 'desc',
    pageSize: 25,
    showOrderBookDepth: true,
    compactView: false
  },
  selectedExchanges: [],
  favoriteCoins: [],
  notifications: {
    enableAlerts: false,
    minProfitForAlert: 1.0,
    alertFrequency: 'hourly'
  },
  customFees: []
};

const defaultVaultSettings = {
  defaultLockDuration: 30,
  autoCompound: false,
  notifications: {
    maturityReminder: true,
    reminderDaysBefore: 3
  }
};

const initialState = {
  // User settings from API
  arbitrage: { ...defaultArbitrageSettings },
  vault: { ...defaultVaultSettings },
  ui: {
    theme: 'system',
    currency: 'USD',
    language: 'en',
    timezone: 'UTC'
  },

  // Available exchanges
  exchanges: [],
  exchangesLoading: false,

  // Loading states
  loading: {
    fetch: false,
    updateArbitrage: false,
    updateVault: false,
    updateExchanges: false,
    sync: false,
    reset: false
  },

  // Messages
  error: null,
  successMessage: null,

  // Track if settings have been loaded
  hasLoaded: false
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Local updates (before saving to server)
    setArbitrageFilter: (state, action) => {
      const { key, value } = action.payload;
      state.arbitrage.filters[key] = value;
    },
    setArbitrageDisplay: (state, action) => {
      const { key, value } = action.payload;
      state.arbitrage.display[key] = value;
    },
    toggleExchange: (state, action) => {
      const exchangeId = action.payload.toLowerCase();
      const index = state.arbitrage.selectedExchanges.indexOf(exchangeId);
      if (index === -1) {
        state.arbitrage.selectedExchanges.push(exchangeId);
      } else {
        state.arbitrage.selectedExchanges.splice(index, 1);
      }
    },
    setSelectedExchanges: (state, action) => {
      state.arbitrage.selectedExchanges = action.payload.map(e => e.toLowerCase());
    },
    toggleFavoriteCoin: (state, action) => {
      const coin = action.payload.toUpperCase();
      const index = state.arbitrage.favoriteCoins.indexOf(coin);
      if (index === -1) {
        state.arbitrage.favoriteCoins.push(coin);
      } else {
        state.arbitrage.favoriteCoins.splice(index, 1);
      }
    },
    setCustomFee: (state, action) => {
      const { exchange, maker, taker } = action.payload;
      const existing = state.arbitrage.customFees.find(f => f.exchange === exchange);
      if (existing) {
        existing.maker = maker;
        existing.taker = taker;
      } else {
        state.arbitrage.customFees.push({ exchange, maker, taker });
      }
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    resetLocalSettings: (state) => {
      state.arbitrage = { ...defaultArbitrageSettings };
      state.vault = { ...defaultVaultSettings };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user settings
      .addCase(fetchUserSettings.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchUserSettings.fulfilled, (state, action) => {
        state.loading.fetch = false;
        if (action.payload) {
          state.arbitrage = { ...defaultArbitrageSettings, ...action.payload.arbitrage };
          state.vault = { ...defaultVaultSettings, ...action.payload.vault };
          state.ui = { ...state.ui, ...action.payload.ui };
        }
        state.hasLoaded = true;
      })
      .addCase(fetchUserSettings.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
        state.hasLoaded = true; // Still mark as loaded to use defaults
      })

      // Update arbitrage settings
      .addCase(updateArbitrageSettings.pending, (state) => {
        state.loading.updateArbitrage = true;
        state.error = null;
      })
      .addCase(updateArbitrageSettings.fulfilled, (state, action) => {
        state.loading.updateArbitrage = false;
        state.arbitrage = { ...state.arbitrage, ...action.payload };
        state.successMessage = 'Arbitrage settings saved successfully';
      })
      .addCase(updateArbitrageSettings.rejected, (state, action) => {
        state.loading.updateArbitrage = false;
        state.error = action.payload;
      })

      // Update vault settings
      .addCase(updateVaultSettings.pending, (state) => {
        state.loading.updateVault = true;
        state.error = null;
      })
      .addCase(updateVaultSettings.fulfilled, (state, action) => {
        state.loading.updateVault = false;
        state.vault = { ...state.vault, ...action.payload };
        state.successMessage = 'Vault settings saved successfully';
      })
      .addCase(updateVaultSettings.rejected, (state, action) => {
        state.loading.updateVault = false;
        state.error = action.payload;
      })

      // Update selected exchanges
      .addCase(updateSelectedExchanges.pending, (state) => {
        state.loading.updateExchanges = true;
        state.error = null;
      })
      .addCase(updateSelectedExchanges.fulfilled, (state, action) => {
        state.loading.updateExchanges = false;
        state.arbitrage.selectedExchanges = action.payload;
        state.successMessage = 'Exchange selection saved';
      })
      .addCase(updateSelectedExchanges.rejected, (state, action) => {
        state.loading.updateExchanges = false;
        state.error = action.payload;
      })

      // Fetch all exchanges
      .addCase(fetchAllExchanges.pending, (state) => {
        state.exchangesLoading = true;
        state.error = null;
      })
      .addCase(fetchAllExchanges.fulfilled, (state, action) => {
        state.exchangesLoading = false;
        state.exchanges = action.payload || [];
      })
      .addCase(fetchAllExchanges.rejected, (state, action) => {
        state.exchangesLoading = false;
        state.error = action.payload;
      })

      // Sync exchanges
      .addCase(syncExchanges.pending, (state) => {
        state.loading.sync = true;
        state.error = null;
      })
      .addCase(syncExchanges.fulfilled, (state, action) => {
        state.loading.sync = false;
        state.successMessage = `Exchanges synced: ${action.payload.stats?.added || 0} added, ${action.payload.stats?.updated || 0} updated`;
      })
      .addCase(syncExchanges.rejected, (state, action) => {
        state.loading.sync = false;
        state.error = action.payload;
      })

      // Reset settings
      .addCase(resetSettings.pending, (state) => {
        state.loading.reset = true;
        state.error = null;
      })
      .addCase(resetSettings.fulfilled, (state, action) => {
        state.loading.reset = false;
        if (action.payload) {
          state.arbitrage = { ...defaultArbitrageSettings, ...action.payload.arbitrage };
          state.vault = { ...defaultVaultSettings, ...action.payload.vault };
          state.ui = { ...state.ui, ...action.payload.ui };
        }
        state.successMessage = 'Settings reset to defaults';
      })
      .addCase(resetSettings.rejected, (state, action) => {
        state.loading.reset = false;
        state.error = action.payload;
      })

      // Fetch enabled exchanges for arbitrage
      .addCase(fetchEnabledExchanges.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchEnabledExchanges.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.arbitrage.selectedExchanges = action.payload || [];
      })
      .addCase(fetchEnabledExchanges.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      // Update enabled exchanges for arbitrage
      .addCase(updateEnabledExchanges.pending, (state) => {
        state.loading.updateExchanges = true;
        state.error = null;
      })
      .addCase(updateEnabledExchanges.fulfilled, (state, action) => {
        state.loading.updateExchanges = false;
        state.arbitrage.selectedExchanges = action.payload || [];
        state.successMessage = 'Exchanges updated successfully. Refresh started.';
      })
      .addCase(updateEnabledExchanges.rejected, (state, action) => {
        state.loading.updateExchanges = false;
        state.error = action.payload;
      });
  }
});

export const {
  setArbitrageFilter,
  setArbitrageDisplay,
  toggleExchange,
  setSelectedExchanges,
  toggleFavoriteCoin,
  setCustomFee,
  clearMessages,
  resetLocalSettings
} = settingsSlice.actions;



export default settingsSlice.reducer;
