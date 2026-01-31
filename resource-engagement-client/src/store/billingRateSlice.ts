import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { billingRateService } from "../services/billingRateService";
import type {
  BillingRate,
  CreateBillingRateRequest,
  UpdateBillingRateRequest,
  RevenueSummary,
  UpdateExchangeRateRequest,
} from "../types/billingRates";

interface BillingRateState {
  rates: BillingRate[];
  currentRate: BillingRate | null;
  revenueSummary: RevenueSummary | null;
  exchangeRate: number;
  loading: boolean;
  error: string | null;
}

const initialState: BillingRateState = {
  rates: [],
  currentRate: null,
  revenueSummary: null,
  exchangeRate: 83,
  loading: false,
  error: null,
};

// Async thunks
export const fetchBillingRates = createAsyncThunk(
  "billingRates/fetchAll",
  async () => {
    return await billingRateService.getAll();
  },
);

export const fetchBillingRateById = createAsyncThunk(
  "billingRates/fetchById",
  async (id: number) => {
    return await billingRateService.getById(id);
  },
);

export const createBillingRate = createAsyncThunk(
  "billingRates/create",
  async (payload: CreateBillingRateRequest) => {
    return await billingRateService.create(payload);
  },
);

export const updateBillingRate = createAsyncThunk(
  "billingRates/update",
  async ({
    id,
    payload,
  }: {
    id: number;
    payload: UpdateBillingRateRequest;
  }) => {
    return await billingRateService.update(id, payload);
  },
);

export const deleteBillingRate = createAsyncThunk(
  "billingRates/delete",
  async (id: number) => {
    await billingRateService.delete(id);
    return id;
  },
);

export const fetchRevenueSummary = createAsyncThunk(
  "billingRates/fetchRevenueSummary",
  async (hours: number = 40) => {
    return await billingRateService.getRevenueSummary(hours);
  },
);

export const updateExchangeRate = createAsyncThunk(
  "billingRates/updateExchangeRate",
  async (payload: UpdateExchangeRateRequest) => {
    const response = await billingRateService.updateExchangeRate(payload);
    // Also fetch updated rates after exchange rate change
    const updatedRates = await billingRateService.getAll();
    return { response, updatedRates, newExchangeRate: payload.exchangeRate };
  },
);

export const fetchExchangeRate = createAsyncThunk(
  "billingRates/fetchExchangeRate",
  async () => {
    return await billingRateService.getExchangeRate();
  },
);

const billingRateSlice = createSlice({
  name: "billingRates",
  initialState,
  reducers: {
    setCurrentRate: (state, action: PayloadAction<BillingRate | null>) => {
      state.currentRate = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setExchangeRate: (state, action: PayloadAction<number>) => {
      state.exchangeRate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all billing rates
      .addCase(fetchBillingRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillingRates.fulfilled, (state, action) => {
        state.loading = false;
        state.rates = action.payload;
      })
      .addCase(fetchBillingRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch billing rates";
      })

      // Fetch billing rate by ID
      .addCase(fetchBillingRateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillingRateById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRate = action.payload;
      })
      .addCase(fetchBillingRateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch billing rate";
      })

      // Create billing rate
      .addCase(createBillingRate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBillingRate.fulfilled, (state, action) => {
        state.loading = false;
        state.rates.push(action.payload);
      })
      .addCase(createBillingRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create billing rate";
      })

      // Update billing rate
      .addCase(updateBillingRate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBillingRate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.rates.findIndex(
          (rate) => rate.id === action.payload.id,
        );
        if (index !== -1) {
          state.rates[index] = action.payload;
        }
        if (state.currentRate?.id === action.payload.id) {
          state.currentRate = action.payload;
        }
      })
      .addCase(updateBillingRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update billing rate";
      })

      // Delete billing rate
      .addCase(deleteBillingRate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBillingRate.fulfilled, (state, action) => {
        state.loading = false;
        state.rates = state.rates.filter((rate) => rate.id !== action.payload);
        if (state.currentRate?.id === action.payload) {
          state.currentRate = null;
        }
      })
      .addCase(deleteBillingRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete billing rate";
      })

      // Fetch revenue summary
      .addCase(fetchRevenueSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueSummary = action.payload;
      })
      .addCase(fetchRevenueSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch revenue summary";
      })

      // Update exchange rate
      .addCase(updateExchangeRate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExchangeRate.fulfilled, (state, action) => {
        state.loading = false;
        state.rates = action.payload.updatedRates;
        state.exchangeRate = action.payload.newExchangeRate;
      })
      .addCase(updateExchangeRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update exchange rate";
      })

      // Fetch exchange rate
      .addCase(fetchExchangeRate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExchangeRate.fulfilled, (state, action) => {
        state.loading = false;
        state.exchangeRate = action.payload.exchangeRate;
      })
      .addCase(fetchExchangeRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch exchange rate";
      });
  },
});

export const { setCurrentRate, clearError, setExchangeRate } =
  billingRateSlice.actions;
export default billingRateSlice.reducer;
