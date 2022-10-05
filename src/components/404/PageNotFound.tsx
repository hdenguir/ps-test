import React from 'react';
import { Link } from 'react-router-dom';
import styles from './404.module.css';

export default function Home() {
  return (
    <main className={styles.page}>
      <h1 data-testid="title">404</h1>
      <p data-testid="subtitle">
        La page que vous recherchez n`existe plus, <br />
        retournez à la <Link to="/">page d`accueil</Link> et rappelez-vous. tu n`as rien vu
      </p>
    </main>
  );
}
