import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Wishlist from './components/Wishlist';
import api from './components/api';

jest.mock('./components/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

test('renders the empty wishlist state from the backend response', async () => {
  api.get.mockResolvedValueOnce({ data: [] });

  render(
    <MemoryRouter>
      <Wishlist />
    </MemoryRouter>
  );

  expect(screen.getByText(/loading your wishlist/i)).toBeInTheDocument();
  expect(await screen.findByText(/your wishlist is empty/i)).toBeInTheDocument();
});
