import booksReducer, { allBooks } from './booksSlice';
import books from '../../public/books.json';

import * as api from '../app/api';

type Book = api.Book;

describe('Books Slice', () => {
  it('Should return the initial state when passed an empty action', () => {
    const initialState = undefined;
    const action = { type: '' };
    const result = booksReducer(initialState, action);
    expect(result).toEqual({ books: {} });
  });
  it('Should convert the books recieved to an object', () => {
    const initialState = undefined;
    const action = allBooks(books as Book[]);
    const result = booksReducer(initialState, action);
    expect(Object.keys(result.books).length).toEqual(books.length);
    books.forEach((book) => {
      expect(result.books[book.isbn]).toEqual(book);
    });
  });
  it('Should not allow the same book to be added more than once', () => {
    const initialState = undefined;
    const action = allBooks(books as Book[]);
    let result = booksReducer(initialState, action);
    expect(Object.keys(result.books).length).toEqual(books.length);
    books.forEach((book) => {
      expect(result.books[book.isbn]).toEqual(book);
    });

    result = booksReducer(result, action);
    expect(Object.keys(result.books).length).toEqual(books.length);
  });

  it('Should allow multiple books to be recieved at different times', () => {
    const initialState = undefined;
    const action = allBooks(books.slice(0, 2) as Book[]);
    let result = booksReducer(initialState, action);

    expect(Object.keys(result.books).length).toEqual(2);

    const secondAction = allBooks(books.slice(2, 4) as Book[]);
    result = booksReducer(result, secondAction);
    expect(Object.keys(result.books).length).toEqual(2);
  });
});
