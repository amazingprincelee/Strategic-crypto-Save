import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../../services/api";

/* ======================
  FETCH VAULT BY ID
====================== */
export const fetchVaultById = createAsyncThunk(
  "vault/fetchById",
  async (vaultId, thunkAPI) => {
    try {
      const response = await authAPI.get(`/vaults/${vaultId}`);
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch vault details";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

/* ======================
  FETCH USER VAULT STATS
====================== */
export const fetchUserVaultStats = createAsyncThunk(
  "vault/fetchUserStats",
  async (userAddress, thunkAPI) => {
    try {
      const response = await authAPI.get(`/vaults/user/${userAddress}/stats`);
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch vault stats";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

/* ======================
  CREATE VAULT
====================== */
export const createVault = createAsyncThunk(
  "vault/create",
  async (vaultData, thunkAPI) => {
    try {
      const response = await authAPI.post('/vaults', vaultData);
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create vault";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

/* ======================
  DEPOSIT TO VAULT
====================== */
export const depositToVault = createAsyncThunk(
  "vault/deposit",
  async ({ vaultId, amount }, thunkAPI) => {
    try {
      const response = await authAPI.post(`/vaults/${vaultId}/deposit`, { amount });
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to deposit";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

/* ======================
  WITHDRAW FROM VAULT
====================== */
export const withdrawFromVault = createAsyncThunk(
  "vault/withdraw",
  async ({ vaultId, amount }, thunkAPI) => {
    try {
      const response = await authAPI.post(`/vaults/${vaultId}/withdraw`, { amount });
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to withdraw";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

/* ======================
  UNLOCK VAULT
====================== */
export const unlockVault = createAsyncThunk(
  "vault/unlock",
  async (vaultId, thunkAPI) => {
    try {
      const response = await authAPI.post(`/vaults/${vaultId}/unlock`);
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to unlock vault";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

/* ======================
  INITIAL STATE
====================== */
const initialState = {
  // Current vault details
  currentVault: null,
  
  // User stats
  userStats: {
    recentActivity: [],
    totalVaults: 0,
    totalBalance: 0,
  },
  
  // Loading states
  loading: {
    vault: false,
    stats: false,
    action: false,
  },
  
  // Error and success
  error: null,
  successMessage: null,
};

/* ======================
  VAULT SLICE
====================== */
const vaultSlice = createSlice({
  name: "vault",
  initialState,
  reducers: {
    // Clear messages
    clearVaultMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    
    // Reset vault state
    resetVaultState: (state) => {
      state.currentVault = null;
      state.error = null;
      state.successMessage = null;
    },
    
    // Clear current vault
    clearCurrentVault: (state) => {
      state.currentVault = null;
    },
  },
  
  extraReducers: (builder) => {
    /* ===== FETCH VAULT BY ID ===== */
    builder
      .addCase(fetchVaultById.pending, (state) => {
        state.loading.vault = true;
        state.error = null;
      })
      .addCase(fetchVaultById.fulfilled, (state, action) => {
        state.loading.vault = false;
        state.currentVault = action.payload.vault;
      })
      .addCase(fetchVaultById.rejected, (state, action) => {
        state.loading.vault = false;
        state.error = action.payload?.message || "Failed to fetch vault";
      });

    /* ===== FETCH USER STATS ===== */
    builder
      .addCase(fetchUserVaultStats.pending, (state) => {
        state.loading.stats = true;
        state.error = null;
      })
      .addCase(fetchUserVaultStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.userStats = action.payload;
      })
      .addCase(fetchUserVaultStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.payload?.message || "Failed to fetch stats";
      });

    /* ===== CREATE VAULT ===== */
    builder
      .addCase(createVault.pending, (state) => {
        state.loading.action = true;
        state.error = null;
      })
      .addCase(createVault.fulfilled, (state, action) => {
        state.loading.action = false;
        state.successMessage = "Vault created successfully";
      })
      .addCase(createVault.rejected, (state, action) => {
        state.loading.action = false;
        state.error = action.payload?.message || "Failed to create vault";
      });

    /* ===== DEPOSIT ===== */
    builder
      .addCase(depositToVault.pending, (state) => {
        state.loading.action = true;
        state.error = null;
      })
      .addCase(depositToVault.fulfilled, (state, action) => {
        state.loading.action = false;
        state.successMessage = "Deposit successful";
        // Update current vault if it matches
        if (state.currentVault && state.currentVault.vaultId === action.payload.vault?.vaultId) {
          state.currentVault = action.payload.vault;
        }
      })
      .addCase(depositToVault.rejected, (state, action) => {
        state.loading.action = false;
        state.error = action.payload?.message || "Failed to deposit";
      });

    /* ===== WITHDRAW ===== */
    builder
      .addCase(withdrawFromVault.pending, (state) => {
        state.loading.action = true;
        state.error = null;
      })
      .addCase(withdrawFromVault.fulfilled, (state, action) => {
        state.loading.action = false;
        state.successMessage = "Withdrawal successful";
        // Update current vault if it matches
        if (state.currentVault && state.currentVault.vaultId === action.payload.vault?.vaultId) {
          state.currentVault = action.payload.vault;
        }
      })
      .addCase(withdrawFromVault.rejected, (state, action) => {
        state.loading.action = false;
        state.error = action.payload?.message || "Failed to withdraw";
      });

    /* ===== UNLOCK VAULT ===== */
    builder
      .addCase(unlockVault.pending, (state) => {
        state.loading.action = true;
        state.error = null;
      })
      .addCase(unlockVault.fulfilled, (state, action) => {
        state.loading.action = false;
        state.successMessage = "Vault unlocked successfully";
        // Update current vault
        if (state.currentVault) {
          state.currentVault.isUnlocked = true;
          state.currentVault.status = 'unlocked';
        }
      })
      .addCase(unlockVault.rejected, (state, action) => {
        state.loading.action = false;
        state.error = action.payload?.message || "Failed to unlock vault";
      });
  },
});

export const {
  clearVaultMessages,
  resetVaultState,
  clearCurrentVault,
} = vaultSlice.actions;

export default vaultSlice.reducer;