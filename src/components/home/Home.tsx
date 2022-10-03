import React from 'react';
import styles from './home.module.css';

export default function Home() {
  return (
    <main className={styles.page}>
      <h1 data-testid="title">La bibliothèque d`Henri Potier</h1>
      <p data-testid="subtitle">
        Il était une fois, une collection de cinq livres racontant les histoires d’un formidable héros nommé Henri
        Potier. Tous les enfants du monde trouvaient les histoires de cet adolescent fantastiques. L’éditeur de cette
        collection, dans un immense élan de générosité (mais aussi pour booster ses ventes ;)), décida de mettre en
        place des offres commerciales aussi aléatoires que l’issue des sorts de Ron Weasley.
      </p>
    </main>
  );
}
