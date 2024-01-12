import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
    name: "product",
    initialState: {
        product: [],
    },
    reducers: {
        getProducts: (state, action) => {
            state.product.push({ ...action.payload });
        },
        incrementQty: (state, action) => {
            const itemPresent = state.product.find((item) => item._id === action.payload._id);
            itemPresent.quantity++;
        },
        decrementQty: (state, action) => {
            const itemPresent = state.product.find((item) => item._id === action.payload._id);
            if (itemPresent.quantity == 1) {
                itemPresent.quantity = 0;
                const removeItem = state.product.filter((item) => item._id !== action.payload._id);
                state.cart = removeItem;
            } else {
                itemPresent.quantity--;
            }
        },
        cleanProduct: (state) => {
            state.product = [];
        },
        quantityReset: (state) => {
            // state.product = []`
            state.product.forEach((product) => {
                product.quantity = 0;
            });
        },
    }
});

export const { getProducts, incrementQty, decrementQty, cleanProduct, quantityReset } = productSlice.actions;

export default productSlice.reducer;