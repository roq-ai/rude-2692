import axios from 'axios';
import queryString from 'query-string';
import { BookOwnerInterface, BookOwnerGetQueryInterface } from 'interfaces/book-owner';
import { GetQueryInterface } from '../../interfaces';

export const getBookOwners = async (query?: BookOwnerGetQueryInterface) => {
  const response = await axios.get(`/api/book-owners${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createBookOwner = async (bookOwner: BookOwnerInterface) => {
  const response = await axios.post('/api/book-owners', bookOwner);
  return response.data;
};

export const updateBookOwnerById = async (id: string, bookOwner: BookOwnerInterface) => {
  const response = await axios.put(`/api/book-owners/${id}`, bookOwner);
  return response.data;
};

export const getBookOwnerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/book-owners/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBookOwnerById = async (id: string) => {
  const response = await axios.delete(`/api/book-owners/${id}`);
  return response.data;
};
