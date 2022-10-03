import React from 'react';
import { screen, render } from '@testing-library/react';
import Home from './Home';

describe('Home Component', () => {
  it('Should contain a title and subtitle', () => {
    render(<Home />);
    expect(screen.getByTestId('title')).toBeInTheDocument();
    expect(screen.getByTestId('subtitle')).toBeInTheDocument();
  });
});
