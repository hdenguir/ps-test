import { CHECKOUT_ERROR, CHECKOUT_READY, CHECKOUT_LOADING } from './constants';
import { Book, CartItems, checkout, Offer } from './../app/api';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '.';

type CheckoutState = 'LOADING' | 'READY' | 'ERROR';
export interface CartState {
  items: { [isbn: string]: number };
  checkoutState: CheckoutState;
  promos: {
    minus: number;
    percentage: number;
    slice: number;
    sliceValue: number;
    total: string;
  };
  errorMessage: string;
}

const initialState: CartState = {
  items: {},
  promos: {
    minus: 0,
    percentage: 0,
    slice: 0,
    sliceValue: 0,
    total: '0.00',
  },
  checkoutState: CHECKOUT_READY,
  errorMessage: '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state: RootState, action: PayloadAction<string>) {
      const isbn = action.payload;
      state.items[isbn] = state.items[isbn] ? ++state.items[isbn] : 1;
    },
    removeFromCart(state: RootState, action: PayloadAction<string>) {
      delete state.items[action.payload];
    },
    updateQuantity(state: RootState, action: PayloadAction<{ isbn: string; quantity: number }>) {
      const { isbn, quantity } = action.payload;
      state.items[isbn] = Number(quantity);
    },
    addPromos(state: RootState, action: PayloadAction<{ offers: Offer[]; totalPrice: string }>) {
      const { offers, totalPrice } = action.payload;

      let promos = {
        minus: 0,
        percentage: 0,
        slice: 0,
        sliceValue: 0,
        total: '0.00',
      };

      if (offers.length > 0) {
        promos = getFinalPrice({
          offers,
          totalPrice,
        });
      }

      state.promos = { ...promos };
    },
  },
  extraReducers: function (builder) {
    builder.addCase(checkoutCart.pending, (state: RootState) => {
      state.checkoutState = CHECKOUT_LOADING;
    });
    builder.addCase(checkoutCart.fulfilled, (state: RootState, action: PayloadAction<{ success: boolean }>) => {
      const { success } = action.payload;
      if (success) {
        state.checkoutState = CHECKOUT_READY;
        state.items = {};
      } else {
        state.checkoutState = CHECKOUT_ERROR;
      }
    });

    builder.addCase(checkoutCart.rejected, (state: RootState, action) => {
      state.checkoutState = CHECKOUT_ERROR;
      state.errorMessage = action.error.message || '';
    });
  },
});

export const checkoutCart = createAsyncThunk('cart/checkout', async (_, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const items = state.cart.items;
  const res = await checkout(items);
  return res;
});

export const { addToCart, removeFromCart, updateQuantity, addPromos } = cartSlice.actions;
export default cartSlice.reducer;

export const getTotalItems = createSelector(
  (state: RootState) => state.cart.items,
  (items: CartItems[]) => {
    return Object.values(items).reduce((x, y) => x + Number(y), 0);
  },
);

export const getTotalPrice = createSelector(
  (state: RootState) => state.books.books,
  (state: RootState) => state.cart.items,
  (books: Book[], items: CartItems[]) => {
    return Object.entries(items)
      .reduce((x, [isbn, quantity]) => {
        return x + books[isbn].price * Number(quantity);
      }, 0)
      .toFixed(2);
  },
);

export const getFinalPrice = ({ offers, totalPrice }: { offers: Offer[]; totalPrice: string }) => {
  const percentage = offers.find((offer: Offer) => offer.type === 'percentage');
  const minus = offers.find((offer: Offer) => offer.type === 'minus');
  const slice = offers.find((offer: Offer) => offer.type === 'slice');

  const prices = {
    percentage: 0,
    minus: 0,
    slice: 0,
    sliceValue: 0,
  };
  let total = 0;
  if (percentage) {
    if (totalPrice !== '0.00')
      total = parseFloat(totalPrice) - parseFloat(totalPrice) * (Number(percentage.value) / 100);
    prices.percentage = Number(percentage.value);
  }

  if (minus) {
    if (totalPrice !== '0.00') total = parseFloat(totalPrice) - Number(minus.value);
    prices.minus = Number(minus.value);
  }

  if (slice && Number(slice.sliceValue) <= total) {
    prices.sliceValue = Number(slice.value);
    prices.slice = Number(slice.value);
  }

  return { ...prices, total };
};
