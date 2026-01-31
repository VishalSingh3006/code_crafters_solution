import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clientsService } from "../services/clientsService";
import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
} from "../types";

interface ClientsState {
  items: Client[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchClients = createAsyncThunk("clients/fetchAll", async () => {
  return await clientsService.getAll();
});

export const createClient = createAsyncThunk(
  "clients/create",
  async (payload: CreateClientRequest) => {
    return await clientsService.create(payload);
  },
);

export const updateClient = createAsyncThunk(
  "clients/update",
  async ({ id, payload }: { id: number; payload: UpdateClientRequest }) => {
    return await clientsService.update(id, payload);
  },
);

export const deleteClient = createAsyncThunk(
  "clients/delete",
  async (id: number) => {
    await clientsService.delete(id);
    return id;
  },
);

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    setClients: (state, action: PayloadAction<Client[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch clients";
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export const { setClients } = clientsSlice.actions;
export default clientsSlice.reducer;
