import React from 'react';
import ReactDOM from 'react-dom/client';
import { waitFor } from '@testing-library/react';
import App from './App';

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn().mockImplementation(() => ({
    render: jest.fn(),
  })),
}));

describe('Application root', () => {
  it('should render without crashing', () => {
    const div = document.createElement('div');
    div.id = 'root';
    document.body.appendChild(div);
    require('./main.tsx');

    waitFor(() => {
      expect(ReactDOM.createRoot(div).render).toHaveBeenCalledWith(<App />, div);
    });
  });
});
