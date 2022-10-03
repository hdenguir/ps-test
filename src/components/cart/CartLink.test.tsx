import React from 'react';
import { screen } from '@testing-library/react';
import { CartLink } from './CartLink';
import { addToCart, removeFromCart, updateQuantity } from '../../store/cartSlice';
import { getStateWithItems, renderWithContext } from '../../utils/utils-test';
import { act } from 'react-dom/test-utils';

describe('CartLink Component', () => {
  it('Should contain a link', () => {
    renderWithContext(<CartLink />);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('Should show text with no items', () => {
    renderWithContext(<CartLink />);
    const link = screen.getByRole('link');
    expect(link).toHaveTextContent('Panier');
    expect(link).not.toHaveTextContent('0');
    expect(link).not.toHaveTextContent('1');
  });

  it('Should show to correct numbers of items', () => {
    const state = getStateWithItems({ testItem: 1 });
    const { store } = renderWithContext(<CartLink />, state);
    const link = screen.getByTestId('link');
    expect(link).toHaveTextContent('1');
    act(() => {
      store.dispatch(updateQuantity({ isbn: 'testItem', quantity: 23 }));
    });

    expect(link).toHaveTextContent('23');
    act(() => {
      store.dispatch(addToCart('secondItem'));
      store.dispatch(updateQuantity({ isbn: 'secondItem', quantity: 6 }));
    });
    expect(link).toHaveTextContent('29');
    act(() => {
      store.dispatch(removeFromCart('secondItem'));
      store.dispatch(removeFromCart('testItem'));
    });
    expect(link).toHaveTextContent('Panier');
  });
});
