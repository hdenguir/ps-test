import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import { renderWithContext } from '../../utils/utils-test';
import Books from './Books';
import * as api from '../../app/api';
import mockListBooks from '../../../public/books.json';

const getBooksSpy = jest.spyOn(api, 'getBooks');

type Book = api.Book;

getBooksSpy.mockResolvedValue(mockListBooks as Book[]);

test('Should be list of books', async () => {
  renderWithContext(<Books />);

  await waitFor(() => expect(getBooksSpy).toHaveBeenCalledTimes(1));
  const articles = screen.getAllByRole('article');
  expect(articles.length).toEqual(mockListBooks.length);
});

test('Should contain a heading for an individual book', async () => {
  renderWithContext(<Books />);
  await waitFor(async () => {
    for (const book of mockListBooks) {
      await screen.getAllByRole('heading', { name: book.title });
    }
  });
});

test("Should be able to add a 'Henri Potier à l'école des sorciers' to cart", async () => {
  const { store } = renderWithContext(<Books />);
  const button = await screen.findByLabelText(/Add Henri Potier et les Reliques de la Mort to cart/i);

  await act(async () => {
    await userEvent.click(button);
  });

  expect(store.getState().cart.items['bbcee412-be64-4a0c-bf1e-315977acd924']).toEqual(1);

  await act(async () => {
    await userEvent.click(button);
    await userEvent.click(button);
  });
  expect(store.getState().cart.items['bbcee412-be64-4a0c-bf1e-315977acd924']).toEqual(3);
});
