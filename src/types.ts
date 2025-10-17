export type Role = 'rolos admir' | 'user';

export interface Session {
  token: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role?: Role;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role?: Role;
}

export interface Summary {
  count: number;
  oems: number;
  value: number;
}

export type ProductCategory = 'laptops' | 'smartphones' | 'tablets' | 'headphones' | 'smartwatches' | 'accessories';

export interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  model: string;
  category: ProductCategory;
  color: string;
  serialNumber: string;
  releaseDate: string;
  price: string;
  description?: string;
  image?: string; // Product image URL
  stock: number; // Stock quantity
  // user id of the creator/owner (optional in fixtures)
  ownerId?: string;
}

export interface ApiProduct extends Product {
  // Additional API-specific fields can be added here if needed
}

export type ProductFormData = Omit<Product, "id">;

// Base chart data point with index signature
export type BaseChartDataPoint = {
  [key: string]: string | number | undefined;
};

// Specific chart data point types
export type SalesDataPoint = BaseChartDataPoint & {
  month: string;
  laptops: number;
  smartphones: number;
  headphones: number;
  smartwatches: number;
};

export type InventoryDataPoint = BaseChartDataPoint & {
  category: string;
  value: number;
};

export type ChartDataPoint = SalesDataPoint | InventoryDataPoint;

export interface ChartDataset {
  id: string;
  data: ChartDataPoint[];
}

export type Chart = ChartDataset[];

export type ChartResponse = ChartDataset[];

export interface ProductList {
  summary: {
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
  };
  products: Array<
    Pick<
      Product,
      | "id"
      | "sku"
      | "brand"
      | "model"
      | "category"
      | "color"
      | "price"
      | "description"
      | "image"
      | "stock"
      | "name"
    >
  >;
}
