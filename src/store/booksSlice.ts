import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Book } from '../app/api';

export interface BooksState {
  books: { [isbn: string]: Book };
}

const initialState: BooksState = {
  books: {},
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    allBooks(state: RootState, action: PayloadAction<Book[]>) {
      const books = action.payload;
      state.books = {};
      books.forEach((book: Book) => {
        state.books[book.isbn] = book;
      });
    },
  },
});

export const { allBooks } = booksSlice.actions;
export default booksSlice.reducer;
