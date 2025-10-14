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

export interface Product {
  id: string;
  vrm: string; // SKU-like identifier
  manufacturer: string; // brand
  model: string;
  type: string; // variant
  fuel: string; // category (kept name for compatibility)
  color: string;
  vin: string; // serial number
  mileage: number; // stock quantity
  registrationDate: string; // release date
  price: string;
  description?: string;
  // user id of the creator/owner (optional in fixtures)
  ownerId?: string;
}

export interface ApiProduct extends Product {
  // Additional API-specific fields can be added here if needed
}

export type ProductFormData = Omit<Product, "id">;

// Base chart data point with index signature
type BaseChartDataPoint = {
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
      | "vrm"
      | "manufacturer"
      | "model"
      | "type"
      | "color"
      | "fuel"
      | "price"
      | "description"
    >
  >;
}
