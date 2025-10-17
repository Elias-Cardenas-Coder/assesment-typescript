import * as React from "react";
import type { ActionFunctionArgs } from "react-router-dom";
import { Form, Link, redirect, useLoaderData, useSearchParams } from "react-router-dom";
import { createProduct, getProduct, updateProduct } from "../api";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/breadcrumb";
import { Button } from "../components/button";
import { Card, CardContent, CardFooter } from "../components/card";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Select } from "../components/select";
import { privateLoader } from "../lib/private-loader";
import type { ProductCategory } from "../types";

export const loader = privateLoader(async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (id) {
    const product = await getProduct(id);
    return { product };
  }

  return { product: null };
});

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const formData = await request.formData();

  const body = {
    name: formData.get("name") as string,
    brand: formData.get("brand") as string,
    model: formData.get("model") as string,
    category: formData.get("category") as ProductCategory,
    color: formData.get("color") as string,
    price: formData.get("price") as string,
    stock: Number(formData.get("stock")),
    description: formData.get("description") as string, // Add description
    sku: '', // Placeholder
    serialNumber: '', // Placeholder
    releaseDate: new Date().toISOString().split('T')[0],
  };

  if (id) {
    const product = await updateProduct(id, body);
    return redirect(`/products/${product.id}`);
  }

  const product = await createProduct(body);
  return redirect(`/products/${product.id}`);
}

export function Component() {
  const { product } = useLoaderData() as any;
  const params = useSearchParams()[0];
  const editId = params.get("id");

  const [formData, setFormData] = React.useState({
    name: product?.name ?? '',
    brand: product?.brand ?? '',
    model: product?.model ?? '',
    category: product?.category ?? '',
    color: product?.color ?? '',
    price: product?.price ?? '',
    stock: product?.stock ?? '',
    description: product?.description ?? '', // Add description
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = Object.values(formData).every(value => value !== '');

  return (
    <>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink to="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{editId ? "Edit" : "Add"} Product</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Form method="post">
        <Card>
          <CardContent className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" type="text" required value={formData.brand} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="model">Model</Label>
              <Input id="model" name="model" type="text" required value={formData.model} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="category">Category</Label>
              <Select id="category" name="category" required value={formData.category} onChange={handleChange}>
                <option value="" disabled>Select a category</option>
                <option value="laptops">Laptops</option>
                <option value="smartphones">Smartphones</option>
                <option value="headphones">Headphones</option>
                <option value="smartwatches">Smartwatches</option>
                <option value="tablets">Tablets</option>
                <option value="accessories">Accessories</option>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="color">Color</Label>
              <Input id="color" name="color" type="text" required value={formData.color} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="price">Price</Label>
              <Input id="price" name="price" type="number" required value={formData.price} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" name="stock" type="number" required value={formData.stock} onChange={handleChange} />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" type="text" required value={formData.description} onChange={handleChange} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link to="/products">Cancel</Link>
            </Button>
            <Button type="submit" disabled={!isFormValid}>{editId ? 'Save Product' : 'Add Product'}</Button>
          </CardFooter>
        </Card>
      </Form>
    </>
  );
}

Component.displayName = "Add";
