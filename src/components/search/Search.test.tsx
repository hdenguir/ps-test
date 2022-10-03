import React from 'react';
import { renderWithContext } from '../../utils/utils-test';
import Search from './Search';
import mockListBooks from '../../../public/books.json';
import * as api from '../../app/api';

import { waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { allBooks } from '../../store/booksSlice';
import { RootState } from '../../store';

type Book = api.Book;
const getBooksSpy = jest.spyOn(api, 'getBooks');

getBooksSpy.mockResolvedValue(mockListBooks as Book[]);

test('should render correctly', async () => {
  renderWithContext(<Search />);

  await waitFor(() => expect(getBooksSpy).toHaveBeenCalledTimes(1));
  expect(screen.getByTestId('searchTermBox')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
});

test('should render input with text coupe', async () => {
  renderWithContext(<Search />);

  const input = screen.getByPlaceholderText('Search...');
  await act(async () => {
    await fireEvent.change(input, { target: { value: 'coupe' } });
  });
  expect(input).toHaveValue('coupe');
});

test('Should update books displayed when search Term changed', async () => {
  const { store } = renderWithContext(<Search />);
  const input = screen.getByPlaceholderText('Search...');

  const books = Object.values(store.getState().books.books);
  await waitFor(() => {
    expect(Object.values(store.getState().books.books)).toHaveLength(7);
  });
  jest.useFakeTimers();

  userEvent.type(input, 'sorciers');

  await waitFor(
    () => {
      expect(input).toHaveValue('sorciers');
    },
    { timeout: 1500 },
  );

  const filteredBooks = books.filter((book: RootState) => book.title.toLowerCase().includes('sorciers'));
  store.dispatch(allBooks(filteredBooks as Book[]));

  jest.runAllTimers();

  await waitFor(() => {
    expect(Object.values(store.getState().books.books)).toHaveLength(1);
  });
});
