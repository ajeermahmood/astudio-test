import axios from 'axios';

const dummyjson = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 5000,
});

export const fetchUsers = async (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const response = await dummyjson.get('/users', {
    params: {
      search: `q=${params.search}`,
      limit: params.limit,
      skip: ((params.page || 1) - 1) * (params.limit || 5),
    }
  });

  // console.log(response.data);
  return response.data;
};

export const fetchProducts = async (params: {
  page?: number;
  limit?: number;
  category?: string;
}) => {
  const response = await dummyjson.get('/products' + (params.category ? `/category/${params.category}` : ''), {
    params: {
      limit: params.limit,
      skip: ((params.page || 1) - 1) * (params.limit || 5),
    }
  });
  return response.data;
};