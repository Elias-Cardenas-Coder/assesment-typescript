// Products listing route (previously Vehicles) - main implementation follows.
import * as React from "react";
import { Link, useLoaderData, useSearchParams, useNavigate } from "react-router-dom";
import { Edit, Info, Plus, Search, Trash2 } from "lucide-react";
import { getProducts, deleteProduct } from "../api";
import { Badge } from "../components/badge";
import { CategoryBadge } from "../components/category-badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/breadcrumb";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Input } from "../components/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationSummary,
} from "../components/pagination";
import { Separator } from "../components/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/table";
import { getWebColor } from "../lib/color";
import { formatCurrency } from "../lib/intl";
import { privateLoader } from "../lib/private-loader";
import type { ProductList } from "../types";

export const loader = privateLoader(async ({ request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || "1");
  const q = url.searchParams.get("q") || "";
  const products = await getProducts(page, q);
  return products;
});

export function Component() {
  const { summary, products } = useLoaderData() as ProductList;
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = React.useState(searchParams.get("q") || "");
  const navigate = useNavigate();

  const setPage = (page: number) => {
    setSearchParams(
      { page: String(page), q: query },
      { preventScrollReset: true },
    );
  };

  return (
    <>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink to="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <div className="flex flex-wrap items-center gap-4 p-4">
          <div className="flex grow items-center gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Catalog</h2>
              <Badge variant="default">{summary.total}</Badge>
            </div>
            <Link to="/add">
              <Button variant="outline" size="sm" className="ml-2">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>

          {/* Search field */}
          <form
            className="relative w-full sm:w-64"
            id="search-form"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              setSearchParams({ q: query, page: "1" });
            }}
          >
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              className="rounded-full pl-10 [&::-webkit-search-cancel-button]:hidden"
              type="search"
              name="q"
              placeholder="Search products"
              aria-label="Search catalog"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>

        <Separator />

        {summary.total === 0 && (
          <div className="flex flex-col items-center gap-4 p-6">
            <Info className="size-10 text-primary" />
            <h3 className="text-xl font-semibold">No results found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search.
            </p>
            <Button variant="default" onClick={() => setSearchParams()}>
              Clear Search
            </Button>
          </div>
        )}

        {summary.total > 0 && (
          <>
            <Table className="table-auto sm:table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-auto lg:w-32">SKU</TableHead>
                  <TableHead className="w-auto lg:w-60">Brand</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-auto text-right lg:w-32">
                    Category
                  </TableHead>
                  <TableHead className="w-auto text-right lg:w-32">
                    Price
                  </TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Link
                        to={`/products/${product.id}`}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {product.sku}
                      </Link>
                    </TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <div
                          className="size-5 shrink-0 rounded-full border"
                          style={{
                            backgroundColor: getWebColor(product.color),
                          }}
                        />
                        <span className="line-clamp-2 text-sm text-muted-foreground">
                          {product.description || 'No description available'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <CategoryBadge category={product.category} />
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(Number(product.price))}
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Link to={`/add?id=${product.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this product?')) {
                            await deleteProduct(product.id);
                            navigate('.', { replace: true });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {summary.totalPages > 1 && (
              <>
                <Separator />

                {/* Pagination */}
                <Pagination>
                  <PaginationContent>
                    <PaginationItem variant="summary">
                      <PaginationSummary
                        page={summary.page}
                        totalPages={summary.totalPages}
                      />
                    </PaginationItem>
                    <PaginationItem variant="button">
                      <PaginationPrevious
                        disabled={summary.page === 1}
                        onClick={() => setPage(summary.page - 1)}
                      />
                    </PaginationItem>
                    <PaginationItem variant="button">
                      <PaginationNext
                        disabled={summary.page === summary.totalPages}
                        onClick={() => setPage(summary.page + 1)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            )}
          </>
        )}
      </Card>
    </>
  );
}
Component.displayName = "Products";
