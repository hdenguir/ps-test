import React from 'react';
import { fireEvent, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as api from '../../app/api';
import { getStateWithItems, renderWithContext } from '../../utils/utils-test';
import Cart from './Cart';
import { act } from 'react-dom/test-utils';
import { addPromos } from '../../store/cartSlice';

type Book = api.Book;
type Offer = api.Offer;

const checkoutSpy = jest.spyOn(api, 'checkout');
const getPromosSpy = jest.spyOn(api, 'getPromos');

const mockOffers = [
  { type: 'percentage', value: '5' },
  { type: 'minus', value: '15' },
  { type: 'slice', sliceValue: '100', value: '12' },
];
getPromosSpy.mockResolvedValue(mockOffers as Offer[]);

//afterEach(cleanup);

describe('Cart Component', () => {
  it('Should not have any items', async () => {
    renderWithContext(<Cart />);
    const rows = screen.getAllByRole('row');
    await waitFor(() => {
      expect(rows).toHaveLength(5);
      screen.getByText('$0.00', { selector: '.total' });
    });
  });

  it('Should display correct total', async () => {
    const state = getStateWithItems(
      { 'c8fabf68-8374-48fe-a7ea-a00ccd07afff': 1 },
      {
        'c8fabf68-8374-48fe-a7ea-a00ccd07afff': {
          title: 'testBook',
          price: 35,
        } as Book,
        'a460afed-e5e7-4e39-a39d-c885c05db861': {
          title: 'testBook',
          price: 30,
        } as Book,
      },
      {
        minus: '15',
        percentage: '5',
        slice: '12',
        sliceValue: '100',
        total: '50',
      },
    );

    const { store } = renderWithContext(<Cart />, state);

    const rows = screen.getAllByTestId('row');
    await waitFor(() => {
      expect(rows).toHaveLength(1);
    });

    await act(async () => {
      await store.dispatch(addPromos({ offers: mockOffers, totalPrice: '65.00' }));
    });

    await waitFor(() => {
      screen.getByText('$50', { selector: '.total' });
    });
  });

  it('Should update total when book quantity updated', async () => {
    const state = getStateWithItems(
      { 'c8fabf68-8374-48fe-a7ea-a00ccd07afff': 1 },
      {
        'c8fabf68-8374-48fe-a7ea-a00ccd07afff': {
          title: 'testBook',
          price: 35,
        } as Book,
      },
      {
        minus: '15',
        percentage: '5',
        slice: '12',
        sliceValue: '100',
        total: '50',
      },
    );
    renderWithContext(<Cart />, state);

    const rows = screen.getAllByTestId('row');

    await waitFor(() => {
      expect(rows).toHaveLength(1);
    });

    await waitFor(() => {
      screen.getByText('$20', { selector: '.total' });
    });

    const input = screen.getByLabelText(/testBook quantity/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: '0' } });
    });

    await waitFor(() => {
      screen.getByText('$0', { selector: '.total' });
    });

    await act(async () => {
      await fireEvent.change(input, { target: { value: '4' } });
    });

    await waitFor(() => {
      screen.getByText('$125', { selector: '.total' });
    });
  });

  it('Removing items should update total', async () => {
    const state = getStateWithItems(
      { 'c8fabf68-8374-48fe-a7ea-a00ccd07afff': 2, 'a460afed-e5e7-4e39-a39d-c885c05db861': 3 },
      {
        'c8fabf68-8374-48fe-a7ea-a00ccd07afff': {
          title: 'sorciers',
          price: 35,
        } as Book,
        'a460afed-e5e7-4e39-a39d-c885c05db861': {
          title: 'chambre',
          price: 30,
        } as Book,
      },
      {
        minus: '15',
        percentage: '5',
        slice: '12',
        sliceValue: '100',
        total: '50',
      },
    );
    renderWithContext(<Cart />, state);

    await waitFor(() => {
      screen.getByText('$145', { selector: '.total' });
    });

    const removeSorciers = screen.getByTitle(/supprimer sorciers/i);
    await userEvent.click(removeSorciers);
    await waitFor(() => {
      screen.getByText('$75', { selector: '.total' });
    });

    const removeChambre = screen.getByTitle(/supprimer chambre/i);
    await userEvent.click(removeChambre);
    await waitFor(() => {
      screen.getByText('$0', { selector: '.total' });
    });
  });

  it('Cannot checkout with an empty cart', async () => {
    checkoutSpy.mockRejectedValueOnce(new Error('Cart must not be empty'));
    renderWithContext(<Cart />);
    const checkout = screen.getByRole('button', { name: 'Checkout' });
    const table = screen.getByRole('table');
    expect(table).not.toHaveClass('checkoutLoading');
    await userEvent.click(checkout);
    await screen.findByText('Cart must not be empty', {
      selector: '.errorBox',
    });
    expect(table).toHaveClass('checkoutError');
  });

  it('Should clear items after checkout', async () => {
    checkoutSpy.mockResolvedValueOnce({ success: true });

    const state = getStateWithItems(
      { 'c8fabf68-8374-48fe-a7ea-a00ccd07afff': 2, 'a460afed-e5e7-4e39-a39d-c885c05db861': 3 },
      {
        'c8fabf68-8374-48fe-a7ea-a00ccd07afff': {
          title: 'sorciers',
          price: 35,
        } as Book,
        'a460afed-e5e7-4e39-a39d-c885c05db861': {
          title: 'chambre',
          price: 30,
        } as Book,
      },
      {
        minus: '15',
        percentage: '5',
        slice: '12',
        sliceValue: '100',
        total: '50',
      },
    );
    renderWithContext(<Cart />, state);

    await waitFor(() => {
      screen.getByText('$145', { selector: '.total' });
    });

    expect(screen.getAllByTestId('row')).toHaveLength(2);

    const checkout = screen.getByRole('button', {
      name: /Checkout/i,
    });
    await userEvent.click(checkout);

    await waitFor(() => {
      screen.getByText('$0', { selector: '.total' });
    });

    await waitFor(() => {
      expect(screen.queryAllByTestId('row')).toHaveLength(0);
    });
  });

  // it('Should get Promos', async () => {
  //   const state = getStateWithItems(
  //     { sorciers: 2, chambre: 3 },
  //     {
  //       sorciers: {
  //         title: 'sorciers',
  //         price: 11.11,
  //       } as Book,
  //       chambre: {
  //         title: 'chambre',
  //         price: 22.22,
  //       } as Book,
  //     },
  //   );
  //   renderWithContext(<Cart />, state);
  //   //getPromosSpy.mockResolvedValueOnce({ percentage: 0, minus: 0, slice: 0, sliceValue: 0 });
  //   await waitFor(() => expect(getPromosSpy).toHaveBeenCalledTimes(1));
  // });
});
