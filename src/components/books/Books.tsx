import React, { useEffect } from 'react';
import { Book, getBooks } from '../../app/api';
import { allBooks } from '../../store/booksSlice';
import { addToCart } from '../../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { RootState } from '../../store';

import styles from './books.module.css';

function Books() {
  const dispatch = useAppDispatch();
  const books = useAppSelector((state: RootState) => state.books.books) as Book[];

  useEffect(() => {
    getBooks().then((books) => dispatch(allBooks(books)));
  }, []);

  return (
    <main className={styles.container}>
      {Object.values(books).length === 0 && <p>Aucune Livre trouvé</p>}
      <ul className={styles.books}>
        {Object.values(books).map((book) => (
          <li key={book.isbn}>
            <article className={styles.book}>
              <figure>
                <img src={book.cover} alt={book.title} />
              </figure>
              <figcaption dangerouslySetInnerHTML={{ __html: book.synopsis.join(',') }}></figcaption>
              <div className={styles.desc}>
                <h1 className={styles.title}>{book.title}</h1>

                <div className={styles.footer}>
                  <p>${book.price}</p>
                  <button
                    className={styles.btn}
                    aria-label={`Add ${book.title} to cart`}
                    onClick={() => dispatch(addToCart(book.isbn))}
                  >
                    Ajouter 🛒
                  </button>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Books;
