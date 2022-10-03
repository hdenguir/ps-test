import { PUBLIC_API_URI } from '../store/constants';

export interface Book {
  isbn: string;
  title: string;
  price: number;
  description: string;
  cover: string;
  synopsis: Array<string>;
}

export interface Offer {
  type: string;
  value: string;
  sliceValue?: string;
}

export async function getBooks(): Promise<Book[]> {
  const results = await fetch(PUBLIC_API_URI);
  const books = await results.json();
  return books;
}

export async function getPromos(ids: Array<string>): Promise<Offer[]> {
  if (ids.length === 0) return [];
  const results = await fetch(`${PUBLIC_API_URI}/${ids.join(',')}/commercialOffers`);
  const response = await results.json();

  return response.offers;
}

export type CartItems = { [isbn: string]: number };
export type CheckoutResponse = { success: boolean; error?: string };

export async function checkout(items: CartItems): Promise<CheckoutResponse> {
  const modifier = Object.keys(items).length > 0 ? 'success' : 'error';
  const url = `/checkout-${modifier}.json`;
  await sleep(500);
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(items),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error);
  }
  return data as CheckoutResponse;
}

// utility function to simulate slowness in an API call
const sleep = (time: number) => new Promise((res) => setTimeout(res, time));
