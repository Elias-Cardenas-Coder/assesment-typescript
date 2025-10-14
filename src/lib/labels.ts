export const categoryLabels: Record<string, string> = {
  laptops: "Laptops",
  smartphones: "Smartphones",
  tablets: "Tablets",
  headphones: "Headphones",
  smartwatches: "Smartwatches",
  accessories: "Accessories",
};

export const getCategoryLabel = (category: string): string => {
  return categoryLabels[category.toLowerCase()] || category;
};
