import type * as React from "react";
import { useLoaderData } from "react-router-dom";
import { getProduct } from "../api";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/card";
import { Separator } from "../components/separator";
import { getColorName, getWebColor } from "../lib/color";
import { formatCurrency, formatNumber } from "../lib/intl";
import { privateLoader } from "../lib/private-loader";
import type { Product } from "../types";

function Detail(props: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <>
      <dt className="font-semibold text-muted-foreground">{props.label}</dt>
      <dd className="mb-4 last:mb-0">{props.value}</dd>
    </>
  );
}

export const loader = privateLoader(async ({ params }) => {
  const product = await getProduct(params.id as string);
  return { product };
});

export function Component() {
  const { product } = useLoaderData() as { product: Product };

  return (
    <>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink to="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink to="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.sku}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>{product.sku}</CardTitle>
          <CardDescription>{product.name}</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <dl className="mt-6 text-base">
            <Detail label="Brand" value={product.brand} />
            <Detail label="Model" value={product.model} />
            <Detail label="Category" value={product.category} />
            <Detail
              label="Color"
              value={
                <div className="flex items-center gap-1.5">
                  <div
                    className="size-4 shrink-0 rounded-full border"
                    style={{ backgroundColor: getWebColor(product.color) }}
                  />
                  <span>{getColorName(product.color)}</span>
                </div>
              }
            />
            <Detail label="Stock" value={formatNumber(product.stock)} />
            <Detail
              label="Price"
              value={formatCurrency(parseInt(product.price, 10), {
                minimumFractionDigits: 0,
              })}
            />
            <Detail
              label="Release Date"
              value={new Intl.DateTimeFormat("en-GB", {
                dateStyle: "long",
              }).format(new Date(product.releaseDate))}
            />
            <Detail label="Serial Number" value={product.serialNumber} />
          </dl>
        </CardContent>
      </Card>
    </>
  );
}
