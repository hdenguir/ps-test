import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import Navbar from './Navbar';
import { renderWithContext } from '../../utils/utils-test';

import mockListBooks from '../../../public/books.json';
import * as api from '../../app/api';

type Book = api.Book;
const getBooksSpy = jest.spyOn(api, 'getBooks');

getBooksSpy.mockResolvedValue(mockListBooks as Book[]);

describe('Navbar Component', () => {
  it('Should contain a header and nav', async () => {
    renderWithContext(<Navbar />);
    await waitFor(() => expect(getBooksSpy).toHaveBeenCalledTimes(1));

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
    expect(screen.getAllByRole('link').length).toBe(3);
  });
});
