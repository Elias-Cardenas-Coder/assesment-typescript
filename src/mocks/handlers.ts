import { fakerEN_GB as faker } from "@faker-js/faker";
import type { DefaultBodyType, PathParams } from "msw";
import { delay, http, HttpResponse } from "msw";
import type {
  ChartResponse,
  Product as ApiProduct,
  ProductList,
  SalesDataPoint,
  InventoryDataPoint,
  Session,
  Role as ApiRole,
} from "../types";

type Role = 'admin' | 'user' | 'rolos admin';

// In-memory users data
const users: MockUser[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin' as const
  }
];

// Top 6 best-selling products (fixed for the dashboard)
const bestSellingProducts: MockProduct[] = [
  {
    id: 'prod-1001',
    name: 'MacBook Pro 16',
    brand: 'Apple',
    model: 'M2 Max',
    category: 'laptops' as const,
    description: 'Powerful laptop with Liquid Retina XDR display and M2 Max chip',
    price: '2499',
    image: '/images/products/macbook.jpg',
    stock: 15,
    rating: 4.8,
    specifications: {
      processor: 'Apple M2 Max',
      ram: '32GB',
      storage: '1TB SSD',
      display: '16.2\" Liquid Retina XDR',
      color: 'Space Gray'
    }
  },
  {
    id: 'prod-1002',
    name: 'Samsung Galaxy S23 Ultra',
    brand: 'Samsung',
    model: 'S23 Ultra',
    category: 'smartphones' as const,
    description: 'Smartphone with 200MP camera and integrated S Pen',
    price: '1199',
    image: '/images/products/samsunggalaxy.jpg',
    stock: 25,
    rating: 4.7,
    specifications: {
      processor: 'Snapdragon 8 Gen 2',
      ram: '12GB',
      storage: '256GB',
      display: '6.8\" Dynamic AMOLED 2X',
      camera: '200MP + 12MP + 10MP + 10MP'
    }
  },
  {
    id: 'prod-1003',
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    model: 'WH-1000XM5',
    category: 'headphones' as const,
    description: 'Wireless headphones with industry-leading noise cancellation',
    price: '399',
    image: '/images/products/sonywh.jpg',
    stock: 30,
    rating: 4.8,
    specifications: {
      type: 'Wireless',
      noiseCancellation: 'Yes',
      batteryLife: '30 hours',
      connectivity: 'Bluetooth 5.2'
    }
  },
  {
    id: 'prod-1004',
    name: 'Apple Watch Series 8',
    brand: 'Apple',
    model: 'Series 8',
    category: 'smartwatches' as const,
    description: 'The most advanced watch for a healthy lifestyle',
    price: '429',
    image: '/images/products/applewatch.jpg',
    stock: 20,
    rating: 4.6,
    specifications: {
      display: 'Always-On Retina',
      batteryLife: '18 hours',
      waterResistant: '50m',
      connectivity: 'GPS + Cellular'
    }
  },
  {
    id: 'prod-1005',
    name: 'iPad Pro 12.9"',
    brand: 'Apple',
    model: 'iPad Pro 12.9\" M2',
    category: 'tablets' as const,
    description: 'Powerful tablet with Liquid Retina XDR display',
    price: '1099',
    image: '/images/products/ipadpro.jpg',
    stock: 18,
    rating: 4.7,
    specifications: {
      processor: 'Apple M2',
      display: '12.9\" Liquid Retina XDR',
      storage: '256GB',
      connectivity: 'WiFi + 5G'
    }
  },
  {
    id: 'prod-1006',
    name: 'Logitech MX Master 3S',
    brand: 'Logitech',
    model: 'MX Master 3S',
    category: 'accessories' as const,
    description: 'Advanced wireless mouse for productivity',
    price: '99',
    image: '/images/products/logitechmx.jpg',
    stock: 35,
    rating: 4.8,
    specifications: {
      type: 'Wireless',
      connectivity: 'Bluetooth / USB Receiver',
      dpi: '8000',
      buttons: '7 programmable'
    }
  }
];

// In-memory user store with roles
interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}

type ProductCategory = 'laptops' | 'smartphones' | 'tablets' | 'headphones' | 'smartwatches' | 'accessories';

interface MockProduct {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: ProductCategory;
  description: string;
  price: string | number;
  image: string;
  stock: number;
  rating: number;
  specifications: {
    color?: string;
    storage?: string;
    ram?: string;
    screenSize?: string;
    operatingSystem?: string;
    processor?: string;
    batteryLife?: string;
    wireless?: string;
    waterResistant?: string;
    features?: string[];
    [key: string]: string | string[] | undefined;
  };
}

// Function to get initial products from localStorage or default
const getInitialProducts = (): MockProduct[] => {
  try {
    const storedProducts = window.localStorage.getItem('allProducts');
    if (storedProducts) {
      return JSON.parse(storedProducts);
    }
  } catch (error) {
    console.error('Error reading from localStorage', error);
  }
  // If localStorage is empty, initialize with best-selling and save
  const initialProducts = [...bestSellingProducts];
  window.localStorage.setItem('allProducts', JSON.stringify(initialProducts));
  return initialProducts;
};

let allProducts: MockProduct[] = getInitialProducts();

// Function to update products in localStorage
const updateStoredProducts = () => {
  window.localStorage.setItem('allProducts', JSON.stringify(allProducts));
};

// API delay in milliseconds
const DELAY = 200;

// Helper function to map MockProduct to the API's expected Product type
const mapProduct = (mockProduct: MockProduct): ApiProduct => {
  const price = typeof mockProduct.price === 'string' ? mockProduct.price : mockProduct.price.toString();
  const color = typeof mockProduct.specifications.color === 'string' ? mockProduct.specifications.color : 'Black';

  return {
    id: mockProduct.id,
    name: mockProduct.name,
    sku: `TECH-PROD-${mockProduct.id.split('-')[1]}`,
    brand: mockProduct.brand,
    model: mockProduct.name,
    category: mockProduct.category,
    color,
    serialNumber: `VIN${mockProduct.id.replace(/-/g, '').substring(0, 17).toUpperCase()}`,
    releaseDate: new Date().toISOString().split('T')[0],
    price,
    description: mockProduct.description,
    // Ensure the image URL is accessible
    image: mockProduct.image || `https://picsum.photos/400/300?random=${mockProduct.id}`,
    stock: mockProduct.stock || 0,
    ownerId: undefined
  };
};

// Helper function to convert specifications to a string record
const convertSpecs = (specs: MockProduct['specifications']): Record<string, string> => {
  const result: Record<string, string> = {};
  
  Object.entries(specs).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      result[key] = value.join(', ');
    } else if (value !== undefined) {
      result[key] = value;
    }
  });
  
  return result;
};

export const handlers = [
  // Login handler
  http.post<PathParams, { email: string; password: string }, Session>(
    `${import.meta.env.VITE_API_URL}/api/login`,
    async ({ request }) => {
      await delay(DELAY);
      
      const { email, password } = await request.json();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return new HttpResponse(null, { status: 401 });
      }
      
      return HttpResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as ApiRole
        },
        token: 'mock-jwt-token'
      });
    }
  ),

  // Get best-selling products
  http.get<PathParams, DefaultBodyType, ProductList>(
    `${import.meta.env.VITE_API_URL}/api/products/best-selling`,
    () => {
      return HttpResponse.json({
        summary: {
          total: bestSellingProducts.length,
          totalPages: 1,
          page: 1,
          pageSize: bestSellingProducts.length,
        },
        products: bestSellingProducts.map(mapProduct),
      });
    }
  ),

  // Get products handler
  http.get<PathParams, DefaultBodyType, ProductList>(
    `${import.meta.env.VITE_API_URL}/api/products`,
    async ({ request }) => {
      await delay(DELAY);
      
      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page')) || 1;
      const pageSize = 10;
      const q = url.searchParams.get('q') || '';

      // Filter products by search term
      const filteredProducts = q
        ? allProducts.filter(product => 
            product.name.toLowerCase().includes(q.toLowerCase()) ||
            product.brand.toLowerCase().includes(q.toLowerCase()) ||
            product.model.toLowerCase().includes(q.toLowerCase())
          )
        : allProducts;

      const totalPages = Math.ceil(filteredProducts.length / pageSize);
      let currentPage = page;
      if (page > totalPages && totalPages > 0) {
        currentPage = 1;
      }

      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const paginatedProducts = filteredProducts.slice(start, end);
      
      return HttpResponse.json({
        summary: {
          total: filteredProducts.length,
          totalPages,
          page: currentPage,
          pageSize
        },
        products: paginatedProducts.map(mapProduct)
      });
    }
  ),

  // Get single product handler
  http.get<{ id: string }, DefaultBodyType, ApiProduct & { 
    description: string;
    image: string;
    stock: number;
    rating: number;
    specifications: Record<string, string>;
  } | { error: string }>(
    `${import.meta.env.VITE_API_URL}/api/products/:id`,
    async ({ params }) => {
      await delay(DELAY);
      const product = allProducts.find(p => p.id === params.id);
      
      if (!product) {
        return HttpResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      return HttpResponse.json({
        ...mapProduct(product),
        description: `${product.name}: ${product.description}`,
        image: product.image,
        stock: product.stock,
        rating: product.rating,
        specifications: convertSpecs(product.specifications)
      });
    }
  ),

  // Create product handler
  http.post<PathParams, Omit<ApiProduct, 'id' | 'vrm'>, ApiProduct | { error: string }>(
    `${import.meta.env.VITE_API_URL}/api/products`,
    async ({ request }) => {
      await delay(DELAY);
      const formData = await request.json();
      
      // Generate a new auto-incrementing ID
      const lastId = allProducts.reduce((maxId, product) => {
        const idNum = parseInt(product.id.split('-')[1], 10);
        return idNum > maxId ? idNum : maxId;
      }, 1000);
      const newId = `prod-${lastId + 1}`;

      const newProduct: MockProduct = {
        id: newId,
        name: formData.model || 'New Product',
        brand: formData.brand || 'Brand',
        model: formData.model || 'Model',
        category: formData.category || 'accessories',
        description: formData.description || 'No description',
        price: formData.price || '0',
        image: '',
        stock: formData.stock || 0,
        rating: 0,
        specifications: {
          color: formData.color || 'Black',
          storage: '256GB',
          ram: '8GB'
        }
      };
      
      // Add the new product and update localStorage
      allProducts.unshift(newProduct);
      updateStoredProducts();
      
      // Return the created product
      return HttpResponse.json(mapProduct(newProduct), { status: 201 });
    }
  ),

  // Update product handler
  http.patch<{ id: string }, Partial<ApiProduct>, ApiProduct | { error: string }>(
    `${import.meta.env.VITE_API_URL}/api/products/:id`,
    async ({ request, params }) => {
      await delay(DELAY);
      const updates = await request.json() as Partial<ApiProduct>;
      const index = allProducts.findIndex(p => p.id === params.id);
      
      if (index === -1) {
        return HttpResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      // Update the mock product with the new values
      const updatedProduct = { ...allProducts[index] };

      if (updates.brand) updatedProduct.brand = updates.brand;
      if (updates.model) updatedProduct.model = updates.model;

      // Validate and update the category
      if (updates.category) {
        const validCategories: ProductCategory[] = ['laptops', 'smartphones', 'tablets', 'headphones', 'smartwatches', 'accessories'];
        if (validCategories.includes(updates.category)) {
          updatedProduct.category = updates.category;
        }
      }

      if (updates.color) updatedProduct.specifications.color = updates.color;
      if (updates.price) updatedProduct.price = updates.price;
      if (updates.stock) updatedProduct.stock = updates.stock;
      
      allProducts[index] = updatedProduct;
      updateStoredProducts();
      return HttpResponse.json(mapProduct(updatedProduct));
    }
  ),

  // Delete product handler
  http.delete<{ id: string }, DefaultBodyType, { success: boolean } | { error: string }>(
    `${import.meta.env.VITE_API_URL}/api/products/:id`,
    async ({ params }) => {
      await delay(DELAY);
      const index = allProducts.findIndex(p => p.id === params.id);
      
      if (index === -1) {
        return HttpResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      allProducts.splice(index, 1);
      updateStoredProducts();
      return HttpResponse.json({ success: true });
    }
  ),

  // Get charts data handler
  http.get<PathParams, DefaultBodyType, ChartResponse>(
    `${import.meta.env.VITE_API_URL}/api/charts`,
    async () => {
      await delay(DELAY);
      
      const categories = ['laptops', 'smartphones', 'headphones', 'smartwatches'] as const;
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
      
      return HttpResponse.json([
        {
          id: 'sales',
          data: months.map(month => ({
            month,
            [categories[0]]: faker.number.int({ min: 1000, max: 10000 }),
            [categories[1]]: faker.number.int({ min: 1000, max: 10000 }),
            [categories[2]]: faker.number.int({ min: 1000, max: 10000 }),
            [categories[3]]: faker.number.int({ min: 1000, max: 10000 })
          } as SalesDataPoint))
        },
        {
          id: 'inventory',
          data: categories.map(category => ({
            category,
            value: allProducts.filter(p => p.category === category).length * 10
          } as InventoryDataPoint))
        }
      ]);
    }
  )
];
