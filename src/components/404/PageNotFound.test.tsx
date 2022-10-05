import React from 'react';
import { screen, render } from '@testing-library/react';
import PageNotFound from './PageNotFound';
import { BrowserRouter } from 'react-router-dom';

describe('404 Component', () => {
  it('Should contain a title and subtitle', () => {
    render(
      <BrowserRouter>
        <PageNotFound />
      </BrowserRouter>,
    );
    expect(screen.getByTestId('title')).toBeInTheDocument();
    expect(screen.getByTestId('subtitle')).toBeInTheDocument();
  });
});
