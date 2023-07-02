import axios from 'axios';
import queryString from 'query-string';
import { InterestInterface, InterestGetQueryInterface } from 'interfaces/interest';
import { GetQueryInterface } from '../../interfaces';

export const getInterests = async (query?: InterestGetQueryInterface) => {
  const response = await axios.get(`/api/interests${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createInterest = async (interest: InterestInterface) => {
  const response = await axios.post('/api/interests', interest);
  return response.data;
};

export const updateInterestById = async (id: string, interest: InterestInterface) => {
  const response = await axios.put(`/api/interests/${id}`, interest);
  return response.data;
};

export const getInterestById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/interests/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteInterestById = async (id: string) => {
  const response = await axios.delete(`/api/interests/${id}`);
  return response.data;
};
