import { useForm } from 'react-hook-form';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

type ProductFormData = {
  name: string;
  brand: string;
  model: string;
  category: string;
  description: string;
  price: string;
  color: string;
  specifications: {
    storage?: string;
    ram?: string;
    screenSize?: string;
    operatingSystem?: string;
    [key: string]: any;
  };
};

type ProductFormProps = {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
};

export function ProductForm({ initialData, onSubmit, onCancel, isSubmitting }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: initialData || {
      name: '',
      brand: '',
      model: '',
      category: '',
      description: '',
      price: '',
      color: '',
      specifications: {}
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            {...register('name', { required: 'Product name is required' })}
            placeholder="e.g., Ultra HD Smart TV"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            {...register('brand', { required: 'Brand is required' })}
            placeholder="e.g., Samsung"
          />
          {errors.brand && <p className="text-sm text-red-500">{errors.brand.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            {...register('model', { required: 'Model is required' })}
            placeholder="e.g., QN90B"
          />
          {errors.model && <p className="text-sm text-red-500">{errors.model.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            onValueChange={(value) => {
              // Handle category change if needed
            }}
            defaultValue={initialData?.category || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="laptops">Laptops</SelectItem>
              <SelectItem value="smartphones">Smartphones</SelectItem>
              <SelectItem value="tablets">Tablets</SelectItem>
              <SelectItem value="headphones">Headphones</SelectItem>
              <SelectItem value="smartwatches">Smartwatches</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register('price', { 
              required: 'Price is required',
              min: { value: 0.01, message: 'Price must be greater than 0' }
            })}
            placeholder="e.g., 999.99"
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            {...register('color')}
            placeholder="e.g., Black"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description', { required: 'Description is required' })}
          placeholder="Enter product description..."
          rows={4}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </form>
  );
}
