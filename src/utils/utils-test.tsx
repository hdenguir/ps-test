import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { getStoreWithState, RootState } from '../store';
import { Book } from '../app/api';
import { CHECKOUT_READY } from '../store/constants';

export function renderWithContext(element: React.ReactElement, state?: RootState) {
  const store = getStoreWithState(state);
  const utils = render(
    <Provider store={store}>
      <Router>
        <>{element}</>
      </Router>
    </Provider>,
  );
  return { store, ...utils };
}

export function getStateWithItems(
  items: Record<string, number>,
  books: Record<string, Book> = {},
  promos?: Record<string, number | string>,
): RootState {
  const state: RootState = {
    cart: { items, promos, checkoutState: CHECKOUT_READY, errorMessage: '' },
    books: { books },
  };
  return state;
}
