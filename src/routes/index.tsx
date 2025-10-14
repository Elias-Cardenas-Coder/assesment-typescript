import { useLoaderData } from "react-router-dom";
import { privateLoader } from "../lib/private-loader";
import { getProducts } from "../api";
import { Button } from "../components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/card";
import { formatCurrency } from "../lib/intl";

export const loader = privateLoader(async () => {
  // Get top 6 best-selling products
  const products = await getProducts(1, "");
  return { products: products.products.slice(0, 6) }; // Take first 6 as best-sellers for demo
});

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
};

export function Component() {
  const { products } = useLoaderData() as { products: Product[] };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Productos más vendidos</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="h-48 bg-muted/50 flex items-center justify-center">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-muted-foreground">Sin imagen</div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription>
                {formatCurrency(product.price)}
                <span className="ml-2 text-sm text-green-600">• En stock: {product.stock}</span>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Ver detalles
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

Component.displayName = "Index";
