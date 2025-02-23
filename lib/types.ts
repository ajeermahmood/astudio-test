export interface User {
    id: number;
    firstName: string;
    lastName: string;
    maidenName?: string;
    age: number;
    gender: string;
    email: string;
    username: string;
    birthDate: string;
    bloodGroup: string;
    eyeColor: string;
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
  }
  
  export interface ApiResponse<T> {
    total: number;
    skip: number;
    limit: number;
    data: T[];
  }