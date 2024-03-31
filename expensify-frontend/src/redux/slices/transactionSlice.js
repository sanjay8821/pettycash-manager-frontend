import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchTransaction = createAsyncThunk(
  "transaction/fetch",
  async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_API_URL}/transaction`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    });
    return await res.json();
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    transactions: [],
    loading: false,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTransaction.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data ? action.payload.data : [];
      })
      .addCase(fetchTransaction.rejected, (state, action) => {
        console.log("promise rejected");
      });
  },
});

export default transactionSlice.reducer;
export const { remove, add } = transactionSlice.actions;
