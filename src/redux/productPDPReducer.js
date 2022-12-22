import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "..";
import { getProduct } from "../data";

export const productPDP = createSlice({
  name: "productPDP",
  initialState: { details: null, status: "idle", error: null },
  reducers: {
    updateSelectedAttribute: (state, action) => {
      const { details } = state;
      const { attribute, item } = action.payload;
      const attr = details.attributes.find(
        (attr) => attr.name === attribute.name
      );
      attr.selected = item;
      state.details = details;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.details = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const fetchProduct = createAsyncThunk("cars/fetchCars", async (id) => {
  const response = await client.query({
    query: getProduct,
    variables: { id },
  });
  const product = response.data.product;
  const attributes = product.attributes.map((attribute) => {
    return { ...attribute, selected: attribute.items[0] };
  });
  return { ...product, attributes };
});

export const { updateSelectedAttribute } = productPDP.actions;

export default productPDP.reducer;
