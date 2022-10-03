import React from 'react';
import { screen, waitFor, render } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import * as api from './app/api';
import { Provider } from 'react-redux';
import { store } from './store';

import mockListBooks from '../public/books.json';
const getBooksSpy = jest.spyOn(api, 'getBooks');
type Book = api.Book;

getBooksSpy.mockResolvedValue(mockListBooks as Book[]);

describe('App Component', () => {
  it('Should render app without crashing', async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('title')).toBeInTheDocument();
      expect(screen.getByTestId('subtitle')).toBeInTheDocument();
    });
  });
});
