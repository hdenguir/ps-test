import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Book, getBooks } from '../../app/api';
import { useAppDispatch, useAppSelector, useDebounce } from '../../hooks';
import { RootState } from '../../store';
import { allBooks } from '../../store/booksSlice';
import styles from './search.module.css';

function Search() {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { pathname } = useLocation();

  const [searchTerm, setSearchTerm] = useState<string>('');

  const debouncedSearchTerm: string = useDebounce<string>(searchTerm, 500);

  useEffect(() => {
    getBooks().then((books) => {
      let results = books;
      if (debouncedSearchTerm) {
        results = Object.values(books).filter(
          (book: RootState) =>
            book.title.toLowerCase().includes(searchTerm) || book.synopsis.join(',').includes(searchTerm),
        );
      }

      dispatch(allBooks(results));
    });
  }, [debouncedSearchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchTerm('');
    if (pathname !== '/books') {
      history.push('/books');
    }
  };

  return (
    <div className={styles.search} data-testid="searchTermBox">
      <input
        name="searchTerm"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
        onFocus={handleFocus}
      />
    </div>
  );
}

export default Search;
