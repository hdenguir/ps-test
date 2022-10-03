import React, { useEffect, useState } from 'react';
import { Book, getBooks } from '../../app/api';
import { useAppDispatch, useAppSelector, useDebounce } from '../../hooks';
import { RootState } from '../../store';
import { allBooks } from '../../store/booksSlice';
import styles from './search.module.css';

function Search() {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const bks = useAppSelector((state: RootState) => state.books.books) as Book[];

  const debouncedSearchTerm: string = useDebounce<string>(searchTerm, 500);

  useEffect(() => {
    getBooks().then((books) => {
      let results = books;
      if (debouncedSearchTerm) {
        results = Object.values(books).filter(
          (book: RootState) => book.title.toLowerCase().includes(searchTerm) || book.synopsis.includes(searchTerm),
        );
      }

      dispatch(allBooks(results || bks));
    });
  }, [debouncedSearchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  return (
    <div className={styles.search} data-testid="searchTermBox">
      <input name="searchTerm" type="text" placeholder="Search..." value={searchTerm} onChange={handleChange} />
    </div>
  );
}

export default Search;
