import React, { useEffect } from 'react';
import classNames from 'classnames';
import { RootState } from '../../store';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addPromos, checkoutCart, getTotalPrice, removeFromCart, updateQuantity } from '../../store/cartSlice';

import styles from './cart.module.css';
import { getPromos } from '../../app/api';
import { CHECKOUT_ERROR, CHECKOUT_LOADING } from '../../store/constants';

function Cart() {
  const dispatch = useAppDispatch();

  const items = useAppSelector((state: RootState) => state.cart.items);
  const books = useAppSelector((state: RootState) => state.books.books);

  const checkoutState = useAppSelector((state: RootState) => state.cart.checkoutState);
  const errorMessage = useAppSelector((state: RootState) => state.cart.errorMessage);

  const totalPrice = useAppSelector(getTotalPrice);

  const minusValue = useAppSelector((state: RootState) => state.cart.promos.minus);
  const sliceValue = useAppSelector((state: RootState) => state.cart.promos.sliceValue);
  const percentageValue = useAppSelector((state: RootState) => state.cart.promos.percentage);
  const total = useAppSelector((state: RootState) => state.cart.promos.total);

  useEffect(() => {
    getPromos(Object.keys(items)).then((offers) => dispatch(addPromos({ offers, totalPrice })));
  }, [items]);

  const onQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, isbn: string) => {
    e.preventDefault();
    if (e.target.value) {
      const quantity = Number(e.target.value);

      dispatch(updateQuantity({ isbn, quantity }));
    }
  };

  const onCheckout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(checkoutCart());
  };

  const tableClasses = classNames({
    [styles.table]: true,
    [styles.checkoutError]: checkoutState === CHECKOUT_ERROR,
    [styles.checkoutLoading]: checkoutState === CHECKOUT_LOADING,
  });

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Panier</h1>
      <table className={tableClasses}>
        <thead>
          <tr>
            <th>Livre</th>
            <th>Quantité</th>
            <th>Total</th>
            <th>Supprimer</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(items).map(([isbn, quantity]) => (
            <tr key={isbn} data-testid="row">
              <td>{books[isbn].title}</td>
              <td>
                <input
                  type="text"
                  data-testid={books[isbn].isbn}
                  aria-label={`Update ${books[isbn].title} quantity`}
                  className={styles.input}
                  value={Number(quantity)}
                  onChange={(e) => onQuantityChange(e, isbn)}
                />
              </td>
              <td>{books[isbn].price}</td>
              <td>
                <button
                  aria-label={`supprimer ${books[isbn].title} from Shopping Cart`}
                  title={`supprimer ${books[isbn].title}`}
                  onClick={() => dispatch(removeFromCart(isbn))}
                  className={styles.btnDelete}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr className={styles.totalSubText}>
            <td></td>
            <td>Promotions</td>
            <td>{minusValue ? `$${minusValue}` : `${percentageValue}%`}</td>
            <td></td>
          </tr>
          <tr className={styles.totalSubText}>
            <td></td>
            <td>Remboursement</td>
            <td>{!!sliceValue && `$${sliceValue}`}</td>
            <td></td>
          </tr>

          <tr className={styles.totalText}>
            <td></td>
            <td>Total</td>
            <td className={styles.total}>{`$${total}`}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <form onSubmit={onCheckout}>
        {checkoutState === CHECKOUT_ERROR && errorMessage ? <p className={styles.errorBox}>{errorMessage}</p> : null}
        <button className={styles.button} type="submit">
          Checkout
        </button>
      </form>
    </main>
  );
}

export default Cart;
