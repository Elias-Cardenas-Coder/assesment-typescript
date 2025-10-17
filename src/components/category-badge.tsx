import { Badge } from "./badge";
import type { ProductCategory } from "../types";

const categoryColors: Record<ProductCategory, string> = {
  laptops: "bg-blue-500",
  smartphones: "bg-green-500",
  headphones: "bg-yellow-500",
  smartwatches: "bg-purple-500",
  tablets: "bg-indigo-500",
  accessories: "bg-pink-500",
};

export function CategoryBadge({ category }: { category: ProductCategory }) {
  const colorClass = categoryColors[category] || "bg-gray-500";
  return <Badge className={`${colorClass} text-white`}>{category}</Badge>;
}
