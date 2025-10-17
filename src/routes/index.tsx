import { Link, useLoaderData } from "react-router-dom";
import { getBestSellingProducts } from "../api";
import { Card, CardTitle } from "../components/card";
import { formatCurrency } from "../lib/intl";
import { privateLoader } from "../lib/private-loader";
import type { ProductList } from "../types";

export const loader = privateLoader(async () => {
  return getBestSellingProducts();
});

export function Component() {
  const { products } = useLoaderData() as ProductList;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Best-Selling Products</h1>
        <p className="text-muted-foreground">Discover our star products.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col overflow-hidden">
            <div className="aspect-square bg-muted">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <CardTitle className="mb-2">{product.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{product.brand} • {product.category}</p>
              <div className="flex-grow" />
              <p className="mt-4 text-lg font-semibold">{formatCurrency(Number(product.price))}</p>
              <p className="text-sm text-green-500">In stock: {product.stock}</p>
              <Link to={`/products/${product.id}`} className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90 text-center py-2 rounded-md">
                View Details
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

Component.displayName = "Index";
