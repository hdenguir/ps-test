import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import { getTotalItems } from '../../store/cartSlice';

import styles from './cartlink.module.css';

export function CartLink() {
  const totalItems = useAppSelector(getTotalItems);

  return (
    <Link to="/cart" className={styles.link} data-testid="link">
      🛒 <span className={styles.text}>{totalItems ? totalItems : 'Panier'}</span>
    </Link>
  );
}
