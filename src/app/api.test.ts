import { waitFor } from '@testing-library/react';
import * as api from './api';

type Book = api.Book;
type Offer = api.Offer;
type CheckoutResponse = api.CheckoutResponse;

import mockListBooks from '../../public/books.json';

const mockOffers = {
  offers: [
    { type: 'percentage', value: '5' },
    { type: 'minus', value: '15' },
    { type: 'slice', sliceValue: '100', value: '12' },
  ],
};

describe('API', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockListBooks),
      }),
    );
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('Should return a list of books', async () => {
    const books: Book[] = await api.getBooks();
    expect(books.length).toBe(mockListBooks.length);
  });

  it('Should return an empty array (getPromos)', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      }),
    );

    const promos: Offer[] = await api.getPromos([]);
    expect(promos.length).toBe(0);
  });

  it('Should return a list of promos (getPromos)', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockOffers),
      }),
    );

    const promos: Offer[] = await api.getPromos([
      'c8fabf68-8374-48fe-a7ea-a00ccd07afff',
      'a460afed-e5e7-4e39-a39d-c885c05db861',
    ]);
    expect(promos.length).toBe(3);
  });

  it('Should return success true (Checkout)', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      }),
    );

    const checkout: CheckoutResponse = await api.checkout({
      'c8fabf68-8374-48fe-a7ea-a00ccd07afff': 1,
      'a460afed-e5e7-4e39-a39d-c885c05db861': 1,
    });
    expect(checkout).toEqual({ success: true });
  });

  it('Should return success false (Checkout)', async () => {
    const msg = { success: false, error: 'Le panier ne doit pas être vide' };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(msg),
      }),
    );
    try {
      await api.checkout({});
    } catch (error) {
      await waitFor(() => {
        expect(error.message).toEqual('Le panier ne doit pas être vide');
      });
    }
  });
});
