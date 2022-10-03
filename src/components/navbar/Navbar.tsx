import React from 'react';
import { Link } from 'react-router-dom';
import { CartLink } from '../cart/CartLink';
import Search from '../search/Search';

import styles from '../../app.module.css';

export default function Navbar() {
  return (
    <div className={styles.container}>
      <header className={styles.header} data-testid="header">
        <nav data-testid="nav">
          <Link className={styles.navLink} to="/">
            Home
          </Link>
          <Link className={styles.navLink} to="/books">
            Books
          </Link>
        </nav>
        <Search />
        <CartLink />
      </header>
    </div>
  );
}
