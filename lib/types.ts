export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  gender: string;
  birthDate: string;
  image: string;
  [key: string]: any;
}

export interface UsersState {
  users: User[];
  total: number;
  limit: number;
  page: number;
  loading: boolean;
  error: string | null;
  allUsers: User[];
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  [key: string]: any;
}

export interface ProductsState {
  products: Product[];
  total: number;
  limit: number;
  page: number;
  loading: boolean;
  error: string | null;
  allProducts: Product[];
  allCategories: string[];
}

export interface ApiResponse<T> {
  total: number;
  skip: number;
  limit: number;
  data: T[];
}
