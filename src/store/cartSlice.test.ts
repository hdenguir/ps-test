import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { RootState, getStoreWithState } from '.';
import CartReducer, {
  addToCart,
  CartState,
  removeFromCart,
  updateQuantity,
  getTotalItems,
  getTotalPrice,
  checkoutCart,
} from './cartSlice';

import books from '../../public/books.json';

import * as api from '../app/api';
import { getStateWithItems } from '../utils/utils-test';
import { CHECKOUT_ERROR, CHECKOUT_LOADING, CHECKOUT_READY } from './constants';

const mockStore = configureStore([thunk]);

jest.mock('../app/api', () => {
  return {
    async getBooks() {
      return [];
    },
    async checkout(items: api.CartItems = {}) {
      const isEmpty = Object.keys(items).length === 0;
      if (isEmpty) throw new Error('Must include cart items');

      if (items.evilItem > 0) throw new Error();

      if (items.badItem > 0) return { success: false };

      return { success: true };
    },
  };
});

test('Checkout Should work', async () => {
  await api.checkout({ fakeItem: 4 });
});

describe('Cart Slice', () => {
  it('Should return the initial state when passed an empty action', () => {
    const initialState = undefined;
    const action = { type: '' };
    const state = CartReducer(initialState, action);
    expect(state).toEqual({
      items: {},
      checkoutState: CHECKOUT_READY,
      errorMessage: '',
      promos: {
        minus: 0,
        percentage: 0,
        slice: 0,
        sliceValue: 0,
        total: '0.00',
      },
    });
  });

  it('Should addToCart return an object with the `c8fabf68-8374-48fe-a7ea-a00ccd07afff` key and  quantity 1', () => {
    const initialState = undefined;
    const action = addToCart('c8fabf68-8374-48fe-a7ea-a00ccd07afff');
    const state = CartReducer(initialState, action);
    expect(state).toEqual({
      items: { 'c8fabf68-8374-48fe-a7ea-a00ccd07afff': 1 },
      checkoutState: CHECKOUT_READY,
      errorMessage: '',
      promos: {
        minus: 0,
        percentage: 0,
        slice: 0,
        sliceValue: 0,
        total: '0.00',
      },
    });
  });
  it('Should addToCart return an object with the c8fabf68-8374-48fe-a7ea-a00ccd07afff key and  quantity 3', () => {
    const initialState = undefined;
    const action = addToCart('c8fabf68-8374-48fe-a7ea-a00ccd07afff');
    let state = CartReducer(initialState, action);

    expect(state).toEqual({
      items: { 'c8fabf68-8374-48fe-a7ea-a00ccd07afff': 1 },
      checkoutState: CHECKOUT_READY,
      errorMessage: '',
      promos: {
        minus: 0,
        percentage: 0,
        slice: 0,
        sliceValue: 0,
        total: '0.00',
      },
    });

    state = CartReducer(state, action);
    state = CartReducer(state, action);
    expect(state).toEqual({
      items: { 'c8fabf68-8374-48fe-a7ea-a00ccd07afff': 3 },
      checkoutState: CHECKOUT_READY,
      errorMessage: '',
      promos: {
        minus: 0,
        percentage: 0,
        slice: 0,
        sliceValue: 0,
        total: '0.00',
      },
    });
  });

  it('Should removeFromCart item (c8fabf68-8374-48fe-a7ea-a00ccd07afff) from the cart', () => {
    const initialState: CartState = {
      items: { 'c8fabf68-8374-48fe-a7ea-a00ccd07afff': 1, 'a460afed-e5e7-4e39-a39d-c885c05db861': 1 },
      checkoutState: CHECKOUT_READY,
      errorMessage: '',
      promos: {
        minus: 0,
        percentage: 0,
        slice: 0,
        sliceValue: 0,
        total: '0.00',
      },
    };
    const action = removeFromCart('c8fabf68-8374-48fe-a7ea-a00ccd07afff');
    const state = CartReducer(initialState, action);
    expect(state).toEqual({
      items: { 'a460afed-e5e7-4e39-a39d-c885c05db861': 1 },
      checkoutState: CHECKOUT_READY,
      errorMessage: '',
      promos: {
        minus: 0,
        percentage: 0,
        slice: 0,
        sliceValue: 0,
        total: '0.00',
      },
    });
  });

  it('Should updateQuantity of an item (c8fabf68-8374-48fe-a7ea-a00ccd07afff) from the cart', () => {
    const initialState: CartState = {
      items: { 'c8fabf68-8374-48fe-a7ea-a00ccd07afff': 1 },
      checkoutState: CHECKOUT_READY,
      errorMessage: '',

      promos: {
        minus: 0,
        percentage: 0,
        slice: 0,
        sliceValue: 0,
        total: '0.00',
      },
    };
    const action = updateQuantity({ isbn: 'c8fabf68-8374-48fe-a7ea-a00ccd07afff', quantity: 4 });
    const state = CartReducer(initialState, action);
    expect(state).toEqual({
      items: { 'c8fabf68-8374-48fe-a7ea-a00ccd07afff': 4 },
      checkoutState: CHECKOUT_READY,
      errorMessage: '',
      promos: {
        minus: 0,
        percentage: 0,
        slice: 0,
        sliceValue: 0,
        total: '0.00',
      },
    });
  });
});

describe('Cart Slice Selectors', () => {
  describe('Total Items function ', () => {
    it('Should return 0 with ne items', () => {
      const cart: CartState = {
        checkoutState: CHECKOUT_READY,
        errorMessage: '',
        items: {},

        promos: {
          minus: 0,
          percentage: 0,
          slice: 0,
          sliceValue: 0,
          total: '0.00',
        },
      };
      const result = getTotalItems({ cart } as RootState);
      expect(result).toEqual(0);
    });

    it('Should add up the total', () => {
      const cart: CartState = {
        checkoutState: CHECKOUT_READY,
        errorMessage: '',
        items: { 'c8fabf68-8374-48fe-a7ea-a00ccd07afff': 2, 'a460afed-e5e7-4e39-a39d-c885c05db861': 3 },
        promos: {
          minus: 0,
          percentage: 0,
          slice: 0,
          sliceValue: 0,
          total: '0.00',
        },
      };
      const result = getTotalItems({ cart } as RootState);
      expect(result).toEqual(5);
    });

    it('Should not compute again with the same state', () => {
      const cart: CartState = {
        checkoutState: CHECKOUT_READY,
        errorMessage: '',
        items: { 'c8fabf68-8374-48fe-a7ea-a00ccd07afff': 2, 'a460afed-e5e7-4e39-a39d-c885c05db861': 3 },
        promos: {
          minus: 0,
          percentage: 0,
          slice: 0,
          sliceValue: 0,
          total: '0.00',
        },
      };
      getTotalItems.resetRecomputations();
      getTotalItems({ cart } as RootState);
      expect(getTotalItems.recomputations()).toEqual(1);
      getTotalItems({ cart } as RootState);
      expect(getTotalItems.recomputations()).toEqual(1);
      getTotalItems({ cart } as RootState);
      getTotalItems({ cart } as RootState);
      getTotalItems({ cart } as RootState);
      expect(getTotalItems.recomputations()).toEqual(1);
    });

    it('Should  recompute  with new state', () => {
      const cart: CartState = {
        checkoutState: CHECKOUT_READY,
        errorMessage: '',
        items: { 'c8fabf68-8374-48fe-a7ea-a00ccd07afff': 2, 'a460afed-e5e7-4e39-a39d-c885c05db861': 3 },
        promos: {
          minus: 0,
          percentage: 0,
          slice: 0,
          sliceValue: 0,
          total: '0.00',
        },
      };
      getTotalItems.resetRecomputations();
      getTotalItems({ cart } as RootState);
      expect(getTotalItems.recomputations()).toEqual(1);
      cart.items = { 'c8fabf68-8374-48fe-a7ea-a00ccd07afff': 2 };
      getTotalItems({ cart } as RootState);
      expect(getTotalItems.recomputations()).toEqual(2);
    });
  });

  describe('Total Price function ', () => {
    it('Should return 0 with an empty cart', () => {
      const state: RootState = {
        cart: {
          items: {},
          checkoutState: CHECKOUT_READY,
          errorMessage: '',
          promos: {
            minus: 0,
            percentage: 0,
            slice: 0,
            sliceValue: 0,
            total: '0.00',
          },
        },
        books: { books: {} },
      };
      const result = getTotalPrice(state);

      expect(result).toEqual('0.00');
    });
    it('Should add up the total', () => {
      const state: RootState = {
        cart: {
          items: {
            [books[0].isbn]: 3,
            [books[1].isbn]: 2,
          },
          checkoutState: CHECKOUT_READY,
          errorMessage: '',
        },
        books: {
          books: {
            [books[0].isbn]: books[0],
            [books[1].isbn]: books[1],
          },
        },
      };

      const result = getTotalPrice(state);

      expect(result).toEqual('165.00');
    });
    it('Should not compute again with the same state', () => {
      const state: RootState = {
        cart: {
          items: {
            [books[0].isbn]: 3,
            [books[1].isbn]: 4,
          },
          checkoutState: CHECKOUT_READY,
          errorMessage: '',
          promos: {
            minus: 0,
            percentage: 0,
            slice: 0,
            sliceValue: 0,
            total: '0.00',
          },
        },
        books: {
          books: {
            [books[0].isbn]: books[0],
            [books[1].isbn]: books[1],
          },
        },
      };

      getTotalPrice.resetRecomputations();
      const result = getTotalPrice(state);
      expect(result).toEqual('225.00');
      expect(getTotalPrice.recomputations()).toEqual(1);
      getTotalPrice(state);
      expect(getTotalPrice.recomputations()).toEqual(1);
    });
    it('Should recompute with new books', () => {
      const state: RootState = {
        cart: {
          items: {
            [books[0].isbn]: 3,
            [books[1].isbn]: 2,
          },
          checkoutState: CHECKOUT_READY,
          errorMessage: '',
          promos: {
            minus: 0,
            percentage: 0,
            slice: 0,
            sliceValue: 0,
            total: '0.00',
          },
        },
        books: {
          books: {
            [books[0].isbn]: books[0],
            [books[1].isbn]: books[1],
          },
        },
      };
      getTotalPrice.resetRecomputations();
      let result = getTotalPrice(state);
      expect(result).toEqual('165.00');
      expect(getTotalPrice.recomputations()).toEqual(1);
      state.books.books = {
        [books[0].isbn]: books[0],
        [books[1].isbn]: books[1],
        [books[2].isbn]: books[2],
      };
      result = getTotalPrice({ ...state });
      expect(result).toEqual('165.00');
      expect(getTotalPrice.recomputations()).toEqual(2);
    });
    it('Should recompute when cart changes', () => {
      const state: RootState = {
        cart: {
          items: {
            [books[0].isbn]: 3,
            [books[1].isbn]: 2,
          },
          checkoutState: CHECKOUT_READY,
          errorMessage: '',
        },
        books: {
          books: {
            [books[0].isbn]: books[0],
            [books[1].isbn]: books[1],
          },
        },
      };
      getTotalPrice.resetRecomputations();
      let result = getTotalPrice(state);
      expect(result).toEqual('165.00');
      expect(getTotalPrice.recomputations()).toEqual(1);
      state.cart.items = {};
      result = getTotalPrice({ ...state });
      expect(result).toEqual('0.00');
      expect(getTotalPrice.recomputations()).toEqual(2);
    });
  });
});

describe('CheckoutCart', () => {
  describe('w/mocked dispatch ', () => {
    it('Should checkout', async () => {
      const dispatch = jest.fn();
      const state: RootState = {
        books: { books: {} },
        cart: {
          checkoutState: CHECKOUT_READY,
          errorMessage: '',
          items: { 'c8fabf68-8374-48fe-a7ea-a00ccd07afff': 3 },
        },
      };

      const thunk = checkoutCart();
      await thunk(dispatch, () => state, undefined);
      const { calls } = dispatch.mock;
      expect(calls).toHaveLength(2);
      expect(calls[0][0].type).toEqual('cart/checkout/pending');
      expect(calls[1][0].type).toEqual('cart/checkout/fulfilled');
      expect(calls[1][0].payload).toEqual({ success: true });
    });
    it('Should fail with no items', async () => {
      const dispatch = jest.fn();
      const state: RootState = {
        books: { books: {} },
        cart: { checkoutState: CHECKOUT_READY, errorMessage: '', items: {} },
      };

      const thunk = checkoutCart();
      await thunk(dispatch, () => state, undefined);
      const { calls } = dispatch.mock;
      expect(calls).toHaveLength(2);
      expect(calls[0][0].type).toEqual('cart/checkout/pending');
      expect(calls[1][0].type).toEqual('cart/checkout/rejected');
      expect(calls[1][0].payload).toEqual(undefined);
      expect(calls[1][0].error.message).toEqual('Must include cart items');
    });
  });

  describe('w/mock redux store', () => {
    it('Should checkout', async () => {
      const store = mockStore({ cart: { items: { test: 4 } } });
      await store.dispatch(checkoutCart());
      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toEqual('cart/checkout/pending');
      expect(actions[1].type).toEqual('cart/checkout/fulfilled');
      expect(actions[1].payload).toEqual({ success: true });
    });
    it('Should fail with no items', async () => {
      const store = mockStore({ cart: { items: {} } });
      await store.dispatch(checkoutCart());
      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toEqual('cart/checkout/pending');
      expect(actions[1].type).toEqual('cart/checkout/rejected');
      expect(actions[1].payload).toEqual(undefined);
      expect(actions[1].error.message).toEqual('Must include cart items');
    });
  });
  describe(' w/full redux store', () => {
    it('Should checkout with items', async () => {
      const state = getStateWithItems({ test: 3 });
      const store = getStoreWithState(state);
      await store.dispatch(checkoutCart());
      expect(store.getState().cart).toEqual({
        items: {},
        errorMessage: '',
        checkoutState: CHECKOUT_READY,
      });
    });

    it('Should fail with no items', async () => {
      const state = getStateWithItems({});
      const store = getStoreWithState(state);
      await store.dispatch(checkoutCart());
      expect(store.getState().cart).toEqual({
        items: {},
        errorMessage: 'Must include cart items',
        checkoutState: CHECKOUT_ERROR,
      });
    });

    it('Should handle an error', async () => {
      const state = getStateWithItems({ badItem: 4 });
      const store = getStoreWithState(state);
      await store.dispatch(checkoutCart());
      expect(store.getState().cart).toEqual({
        items: { badItem: 4 },
        errorMessage: '',
        checkoutState: CHECKOUT_ERROR,
      });
    });
    it('Should handle an empty error message', async () => {
      const state = getStateWithItems({ evilItem: 4 });
      const store = getStoreWithState(state);
      await store.dispatch(checkoutCart());
      expect(store.getState().cart).toEqual({
        items: { evilItem: 4 },
        errorMessage: '',
        checkoutState: CHECKOUT_ERROR,
      });
    });
    it('Should be pending before checking out', async () => {
      const state = getStateWithItems({ goodItem: 4 });
      const store = getStoreWithState(state);
      expect(store.getState().cart.checkoutState).toEqual(CHECKOUT_READY);

      const action = store.dispatch(checkoutCart());
      expect(store.getState().cart.checkoutState).toEqual(CHECKOUT_LOADING);

      await action;
      expect(store.getState().cart.checkoutState).toEqual(CHECKOUT_READY);
    });
  });
});
