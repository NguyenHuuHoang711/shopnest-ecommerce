import { createSlice } from "@reduxjs/toolkit";

const getCartFromStorage = () => {
  try {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error parsing cart from localStorage:", error);
    return [];
  }
};

const initialState = {
  cartItems: getCartFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;

      const existing = state.cartItems.find(
        (item) => item._id === product._id && item.size === product.size,
      );

      const sizeData = product.sizes?.find((s) => s.size === product.size);

      const stock = sizeData?.stock || 0;

      if (existing) {
        const newQty = existing.qty + product.qty;

        if (newQty > stock) {
          existing.qty = stock;
          return;
        }

        existing.qty = newQty;
      } else {
        if (product.qty > stock) return;
        state.cartItems.push({
          ...product,
          qty: product.qty,
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      const product = action.payload;
      state.cartItems = state.cartItems.filter((item) => {
        const idMatch = product._id === item._id;
        const sizeMatch = product.size === item.size;
        return !(idMatch && sizeMatch);
      });
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    increaseQty: (state, action) => {
      const product = action.payload;

      const item = state.cartItems.find(
        (i) => i._id === product._id && i.size === product.size,
      );

      if (!item) return;

      const sizeData = product.sizes?.find((s) => s.size === product.size);

      const stock = sizeData?.stock || 0;

      if (item.qty >= stock) return;

      item.qty += 1;

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    decreaseQty: (state, action) => {
      const product = action.payload;

      const item = state.cartItems.find(
        (i) => i._id === product._id && i.size === product.size,
      );

      if (!item) return;

      item.qty -= 1;

      if (item.qty <= 0) {
        state.cartItems = state.cartItems.filter(
          (i) => !(i._id === product._id && i.size === product.size),
        );
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    clearCart: (state, action) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
  },
});
export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
