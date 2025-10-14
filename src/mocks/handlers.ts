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
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password',
    role: 'user' as const
  },
  {
    id: '3',
    name: 'Rolos Admin',
    email: 'rolos@example.com',
    password: 'password',
    role: 'rolos admin' as const
  }
];

// In-memory users store with roles
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

// Generate technology products with realistic specifications
const generateProducts = (): MockProduct[] => {
  const categories = {
    laptops: {
      brands: ['Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Apple', 'MSI', 'Razer', 'Microsoft', 'Samsung'],
      models: ['XPS', 'Spectre', 'ThinkPad', 'ZenBook', 'MacBook', 'ROG', 'VivoBook', 'IdeaPad', 'Omen', 'Legion'],
      processors: ['Intel i5', 'Intel i7', 'Intel i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2'],
      descriptions: [
        'Potente portátil con pantalla Full HD de 15.6", ideal para trabajo y entretenimiento',
        'Ultrabook ligero y potente con SSD ultrarrápido y batería de larga duración',
        'Equipo gaming con tarjeta gráfica dedicada y pantalla de alta tasa de refresco',
        'Convertible 2 en 1 con pantalla táctil y lápiz digital incluido',
        'Portátil empresarial con máxima seguridad y durabilidad certificada MIL-STD'
      ]
    },
    smartphones: {
      brands: ['Samsung', 'Apple', 'Xiaomi', 'OnePlus', 'Google', 'Huawei', 'Oppo', 'Vivo', 'Realme', 'Motorola'],
      models: ['Galaxy S', 'iPhone', 'Redmi Note', 'Pixel', 'Mate', 'Find X', 'Vivo V', 'Realme GT', 'Moto G'],
      storage: ['64GB', '128GB', '256GB', '512GB', '1TB'],
      descriptions: [
        'Smartphone de gama alta con cámara profesional y pantalla AMOLED de 120Hz',
        'Diseño premium con resistencia al agua y carga inalámbrica rápida',
        'Batería de larga duración con carga ultrarrápida de 65W',
        'Sistema de cámara cuádruple con zoom óptico 10x',
        'Rendimiento potente con el último procesador y 5G integrado'
      ]
    },
    headphones: {
      brands: ['Sony', 'Bose', 'Sennheiser', 'JBL', 'Jabra', 'Beats', 'Audio-Technica', 'Anker', 'Razer'],
      types: ['In-ear', 'On-ear', 'Over-ear', 'True Wireless', 'Noise Cancelling'],
      descriptions: [
        'Auriculares con cancelación activa de ruido y sonido envolvente',
        'Diseño ergonómico para máximo confort durante horas de uso',
        'Resistencia al agua y al sudor, perfecto para deportistas',
        'Batería de hasta 30 horas con carga rápida USB-C',
        'Micrófono con reducción de ruido para llamadas cristalinas'
      ]
    },
    smartwatches: {
      brands: ['Apple', 'Samsung', 'Garmin', 'Fitbit', 'Amazfit', 'Huawei', 'Xiaomi', 'Fossil', 'Withings'],
      features: ['GPS', 'Heart Rate', 'Sleep Tracking', 'Waterproof', 'SpO2', 'ECG', 'NFC'],
      descriptions: [
        'Reloj inteligente con monitorización avanzada de salud y actividad física',
        'Pantalla AMOLED siempre encendida y resistencia al agua 5ATM',
        'Seguimiento de más de 100 modos deportivos y GPS integrado',
        'Batería de larga duración con carga magnética rápida',
        'Diseño premium con correas intercambiables y personalización completa'
      ]
    },
    tablets: {
      brands: ['Apple', 'Samsung', 'Huawei', 'Lenovo', 'Amazon', 'Xiaomi', 'Microsoft'],
      models: ['iPad', 'Galaxy Tab', 'MatePad', 'Tab P', 'Fire HD', 'Mi Pad', 'Surface'],
      descriptions: [
        'Tablet versátil con lápiz digital incluido y teclado desmontable',
        'Pantalla de alta resolución perfecta para streaming y productividad',
        'Ligera y delgada, ideal para llevar contigo a todas partes',
        'Rendimiento potente para multitarea y aplicaciones exigentes',
        'Batería de larga duración para todo el día de uso'
      ]
    },
    accessories: {
      brands: ['Logitech', 'Anker', 'Belkin', 'Samsung', 'Apple', 'Sony', 'Bose'],
      types: ['Chargers', 'Cables', 'Docks', 'Stands', 'Cases', 'Screen Protectors', 'Stylus'],
      descriptions: [
        'Cargador rápido con tecnología Power Delivery de 30W',
        'Cable resistente con conectores reforzados y carga rápida',
        'Base de carga inalámbrica con alineación magnética',
        'Funda protectora con diseño delgado y protección contra caídas',
        'Protector de pantalla templado con precisión láser'
      ]
    }
  };

  const generateLaptop = (): MockProduct => {
    const brand = faker.helpers.arrayElement(categories.laptops.brands);
    const modelNumber = faker.number.int({ min: 1000, max: 9999 });
    const model = `${faker.helpers.arrayElement(categories.laptops.models)} ${modelNumber}`;
    const processor = faker.helpers.arrayElement(categories.laptops.processors);
    const ram = faker.helpers.arrayElement([8, 16, 32]);
    const storage = faker.helpers.arrayElement([256, 512, 1000, 2000]);
    const description = faker.helpers.arrayElement(categories.laptops.descriptions);
    const price = faker.number.int({ min: 699, max: 2999 });
    
    return {
      id: faker.string.uuid(),
      name: model,
      brand,
      model: modelNumber.toString(),
      category: 'laptops',
      description: description.replace('{processor}', processor)
                            .replace('{ram}', ram.toString())
                            .replace('{storage}', storage.toString()),
      price: price.toString(),
      image: faker.image.urlLoremFlickr({ category: 'laptop' }),
      stock: faker.number.int({ min: 5, max: 50 }),
      rating: faker.number.float({ min: 3, max: 5, precision: 0.1 }),
      specifications: {
        processor,
        ram: `${ram}GB`,
        storage: `${storage}GB SSD`,
        screenSize: `${faker.number.int({ min: 13, max: 17 })} pulgadas`,
        operatingSystem: faker.helpers.arrayElement(['Windows 11', 'macOS', 'Chrome OS', 'Linux']),
        color: faker.color.human(),
        graphics: faker.helpers.arrayElement(['Intel Iris Xe', 'NVIDIA GeForce RTX 3050', 'AMD Radeon', 'Apple M1 GPU'])
      }
    };
  };

  const generateSmartphone = (): MockProduct => {
    const brand = faker.helpers.arrayElement(categories.smartphones.brands);
    const model = faker.helpers.arrayElement(categories.smartphones.models);
    const modelNumber = faker.number.int({ min: 10, max: 20 });
    const storage = faker.helpers.arrayElement(categories.smartphones.storage);
    const ram = faker.helpers.arrayElement([4, 6, 8, 12]);
    const price = faker.number.int({ min: 299, max: 1499 });
    const description = faker.helpers.arrayElement(categories.smartphones.descriptions);
    
    return {
      id: faker.string.uuid(),
      name: `${brand} ${model} ${modelNumber} ${storage}`,
      brand,
      model: modelNumber.toString(),
      category: 'smartphones' as const,
      description: `${description} ${storage} de almacenamiento, ${ram}GB RAM.`,
      price: price.toString(),
      image: faker.image.urlLoremFlickr({ category: 'smartphone' }),
      stock: faker.number.int({ min: 10, max: 100 }),
      rating: faker.number.float({ min: 3, max: 5, precision: 0.1 }),
      specifications: {
        storage,
        ram: `${ram}GB`,
        screenSize: `${faker.number.float({ min: 5.5, max: 7.0, precision: 0.1 })} pulgadas`,
        operatingSystem: faker.helpers.arrayElement(['Android', 'iOS']),
        color: faker.color.human(),
        batteryLife: `${faker.number.int({ min: 3000, max: 6000 })} mAh`,
        camera: `${faker.number.int({ min: 12, max: 108 })} MP`
      }
    };
  };

  const generateHeadphones = (): MockProduct => {
    const brand = faker.helpers.arrayElement(categories.headphones.brands);
    const type = faker.helpers.arrayElement(categories.headphones.types);
    const isWireless = faker.datatype.boolean();
    const modelCode = faker.string.alphanumeric(3).toUpperCase();
    const price = faker.number.int({ min: 49, max: 499 });
    
    return {
      id: faker.string.uuid(),
      name: `${type} ${isWireless ? 'Wireless' : ''}`,
      brand,
      model: modelCode,
      category: 'headphones',
      description: `${isWireless ? 'Inalámbricos ' : ''}con cancelación de ruido y sonido de alta calidad.`,
      price: price.toString(),
      image: faker.image.urlLoremFlickr({ category: 'headphones' }),
      stock: faker.number.int({ min: 10, max: 100 }),
      rating: faker.number.float({ min: 3, max: 5, precision: 0.1 }),
      specifications: {
        type,
        wireless: isWireless ? 'Sí' : 'No',
        batteryLife: isWireless ? `${faker.number.int({ min: 10, max: 40 })} horas` : 'N/A',
        color: faker.color.human(),
        noiseCancellation: faker.datatype.boolean() ? 'Sí' : 'No',
        connectivity: isWireless ? 'Bluetooth 5.0' : 'Cable 3.5mm'
      }
    };
  };

  const generateSmartwatch = (): MockProduct => {
    const brand = faker.helpers.arrayElement(categories.smartwatches.brands);
    const modelCode = `${faker.string.alpha(1).toUpperCase()}${faker.number.int({ min: 1, max: 9 })}`;
    const model = `Watch ${modelCode}`;
    const features = faker.helpers.arrayElements(categories.smartwatches.features, { min: 2, max: 5 });
    const price = faker.number.int({ min: 99, max: 799 });
    
    return {
      id: faker.string.uuid(),
      name: model,
      brand,
      model: modelCode,
      category: 'smartwatches',
      description: `Con ${features.join(', ')}. Ideal para monitorear tu actividad diaria.`,
      price: price.toString(),
      image: faker.image.urlLoremFlickr({ category: 'smartwatch' }),
      stock: faker.number.int({ min: 5, max: 50 }),
      rating: faker.number.float({ min: 3, max: 5, precision: 0.1 }),
      specifications: {
        screenSize: `${faker.number.float({ min: 1.2, max: 1.9, precision: 0.1 })} pulgadas`,
        batteryLife: `${faker.number.int({ min: 1, max: 30 })} días`,
        waterResistant: faker.datatype.boolean() ? 'Sí' : 'No',
        color: faker.color.human(),
        features,
        connectivity: 'Bluetooth 5.0',
        compatibleWith: faker.helpers.arrayElements(['iOS', 'Android', 'Windows'], { min: 1, max: 3 })
      }
    };
  };

  const generateTablet = (): MockProduct => {
    const brand = faker.helpers.arrayElement(categories.tablets.brands);
    const model = faker.helpers.arrayElement(categories.tablets.models);
    const storage = faker.helpers.arrayElement([64, 128, 256]);
    const price = faker.number.int({ min: 199, max: 999 });
    const description = faker.helpers.arrayElement(categories.tablets.descriptions);
    
    return {
      id: faker.string.uuid(),
      name: `${brand} ${model} ${storage}GB`,
      brand,
      model,
      category: 'tablets',
      description: description.replace('{storage}', storage.toString()),
      price: price.toString(),
      image: faker.image.urlLoremFlickr({ category: 'tablet' }),
      stock: faker.number.int({ min: 10, max: 100 }),
      rating: faker.number.float({ min: 3, max: 5, precision: 0.1 }),
      specifications: {
        screenSize: `${faker.number.float({ min: 7.9, max: 12.9, precision: 0.1 })} pulgadas`,
        storage: `${storage}GB`,
        ram: faker.helpers.arrayElement(['4GB', '6GB', '8GB']),
        operatingSystem: faker.helpers.arrayElement(['iPadOS', 'Android', 'Windows']),
        batteryLife: `Hasta ${faker.number.int({ min: 8, max: 15 })} horas`,
        color: faker.color.human()
      }
    };
  };

  const generateAccessory = (): MockProduct => {
    const accessoryTypes = ['Cargador', 'Funda', 'Auriculares', 'Cable', 'Soporte', 'Batería externa'];
    const colors = ['Negro', 'Blanco', 'Azul', 'Rojo', 'Verde', 'Rosa', 'Gris', 'Dorado'];
    const brand = faker.helpers.arrayElement([...categories.smartphones.brands, ...categories.laptops.brands, 'Anker', 'Belkin', 'Spigen', 'OtterBox']);
    const type = faker.helpers.arrayElement(accessoryTypes);
    const color = faker.helpers.arrayElement(colors);
    const price = faker.number.int({ min: 9, max: 99 });
    const model = faker.helpers.arrayElement(['Pro', 'Air', 'Max', 'Plus', 'Lite', '']);
    
    return {
      id: faker.string.uuid(),
      name: `${brand} ${type} ${model} ${color}`.trim(),
      brand,
      model: model || 'Standard',
      category: 'accessories',
      description: `${type} ${color} de alta calidad compatible con múltiples dispositivos.`,
      price: price.toString(),
      image: faker.image.urlLoremFlickr({ category: 'accessory' }),
      stock: faker.number.int({ min: 5, max: 50 }),
      rating: faker.number.float({ min: 3, max: 5, precision: 0.1 }),
      specifications: {
        color,
        compatibility: faker.helpers.arrayElement([
          'Universal', 
          'iPhone/Android', 
          'Solo iPhone', 
          'Solo Android',
          'Tablets y smartphones',
          'Laptops y tablets'
        ]),
        warranty: faker.helpers.arrayElement(['6 meses', '1 año', '2 años', 'Limitada']),
        material: faker.helpers.arrayElement(['Plástico', 'Silicón', 'Cuero', 'Metal', 'Tela']),
        features: [
          faker.helpers.arrayElement(['Resistente al agua', 'Antigolpes', 'Carga rápida', 'Inalámbrico']),
          faker.helpers.arrayElement(['Diseño delgado', 'Ligero', 'Antideslizante', 'Imán integrado'])
        ].filter(Boolean)
      }
    };
  };

  // Generate products
  return [
    ...Array<null>(15).fill(null).map((): MockProduct => generateLaptop()),
    ...Array<null>(15).fill(null).map((): MockProduct => generateSmartphone()),
    ...Array<null>(10).fill(null).map((): MockProduct => generateHeadphones()),
    ...Array<null>(10).fill(null).map((): MockProduct => generateSmartwatch()),
    ...Array<null>(10).fill(null).map((): MockProduct => generateTablet()),
    ...Array<null>(10).fill(null).map((): MockProduct => generateAccessory())
  ];
};

// Initialize products
const products = generateProducts();

// API delay in milliseconds
const DELAY = 100;

// Helper function to map MockProduct to the API's expected Product type
const mapProduct = (mockProduct: MockProduct): ApiProduct => {
  const price = typeof mockProduct.price === 'string' ? mockProduct.price : mockProduct.price.toString();
  const color = typeof mockProduct.specifications.color === 'string' ? mockProduct.specifications.color : 'Negro';
  
  return {
    id: mockProduct.id,
    vrm: `TECH-${mockProduct.id.substring(0, 8).toUpperCase()}`,
    manufacturer: mockProduct.brand,
    model: mockProduct.name, // Use the product name as the model
    type: mockProduct.category,
    fuel: mockProduct.category, // Using category as fuel for display purposes
    color,
    vin: `VIN${mockProduct.id.replace(/-/g, '').substring(0, 17).toUpperCase()}`,
    mileage: 0, // Not applicable for tech products
    registrationDate: new Date().toISOString().split('T')[0],
    price,
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

  // Get products handler
  http.get<PathParams, DefaultBodyType, ProductList>(
    `${import.meta.env.VITE_API_URL}/api/products`,
    async ({ request }) => {
      await delay(DELAY);
      
      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page')) || 1;
      const pageSize = 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const q = url.searchParams.get('q') || '';

      // Filter products by search term
      const filteredProducts = q
        ? products.filter(product => 
            product.name.toLowerCase().includes(q.toLowerCase()) ||
            product.brand.toLowerCase().includes(q.toLowerCase()) ||
            product.model.toLowerCase().includes(q.toLowerCase())
          )
        : products;

      const paginatedProducts = filteredProducts.slice(start, end);
      
      return HttpResponse.json({
        summary: {
          total: filteredProducts.length,
          totalPages: Math.ceil(filteredProducts.length / pageSize),
          page,
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
      const product = products.find(p => p.id === params.id);
      
      if (!product) {
        return HttpResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      return HttpResponse.json({
        ...mapProduct(product),
        description: product.description,
        image: product.image,
        stock: product.stock,
        rating: product.rating,
        specifications: convertSpecs(product.specifications)
      });
    }
  ),

  // Create product handler
  http.post<PathParams, any, ApiProduct | { error: string }>(
    `${import.meta.env.VITE_API_URL}/api/products`,
    async ({ request }) => {
      await delay(DELAY);
      const formData = await request.json();
      
      // Create a new product with form data
      const newProduct: MockProduct = {
        id: faker.string.uuid(),
        name: formData.model || 'New Product',
        brand: formData.manufacturer || 'Unknown',
        model: formData.model || 'Unknown Model',
        category: (formData.type as ProductCategory) || 'accessories',
        description: `A ${formData.color || 'new'} ${formData.manufacturer || 'product'} ${formData.model || ''}`,
        price: parseFloat(formData.price) || 0,
        image: faker.image.technics(400, 400, true),
        stock: 100,
        rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
        specifications: {
          color: formData.color || '',
          fuel: formData.fuel || '',
          mileage: formData.mileage ? String(formData.mileage) : '',
          vin: formData.vin || '',
          registrationDate: formData.registrationDate || ''
        }
      };

      // Add the new product to our in-memory array
      products.push(newProduct);
      
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
      const index = products.findIndex(p => p.id === params.id);
      
      if (index === -1) {
        return HttpResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      // Update the mock product with the new values
      const updatedProduct = { ...products[index] };
      
      if (updates.manufacturer) updatedProduct.brand = updates.manufacturer;
      if (updates.model) updatedProduct.model = updates.model;
      
      // Validar y actualizar la categoría
      if (updates.type) {
        const validCategories: ProductCategory[] = ['laptops', 'smartphones', 'tablets', 'headphones', 'smartwatches', 'accessories'];
        if (validCategories.includes(updates.type as ProductCategory)) {
          updatedProduct.category = updates.type as ProductCategory;
        }
      }
      
      if (updates.color) updatedProduct.specifications.color = updates.color;
      if (updates.price) updatedProduct.price = updates.price;
      
      products[index] = updatedProduct;
      return HttpResponse.json(mapProduct(updatedProduct));
    }
  ),

  // Delete product handler
  http.delete<{ id: string }, DefaultBodyType, { success: boolean } | { error: string }>(
    `${import.meta.env.VITE_API_URL}/api/products/:id`,
    async ({ params }) => {
      await delay(DELAY);
      const index = products.findIndex(p => p.id === params.id);
      
      if (index === -1) {
        return HttpResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      products.splice(index, 1);
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
            value: faker.number.int({ min: 50, max: 500 })
          } as InventoryDataPoint))
        }
      ]);
    }
  )
];
