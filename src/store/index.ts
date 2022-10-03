import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './cartSlice';
import booksSlice from './booksSlice';

const reducer = {
  cart: cartSlice,
  books: booksSlice,
};

export const store = configureStore({
  reducer,
});

export function getStoreWithState(preloadedState?: RootState) {
  return configureStore({ reducer, preloadedState });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
