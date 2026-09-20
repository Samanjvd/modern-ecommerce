import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/api/axios';

type ProductColor = {
  name: string;
  value: string;
};

export type ProductFormData = {
  title: string;
  slug: string;
  description: string;
  brand: string;
  price: string;
  discountPrice: string;
  discount: string;
  rating: string;
  reviewCount: string;
  stock: string;
  isNew: boolean;
  isPopular: boolean;
  isFeatured: boolean;
  categoryId: string;
  specifications: string;
  image: string;
  colors: ProductColor[];
};

type Category = {
  id: number;
  name: string;
};

type ProductFormProps = {
  initialData?: Partial<ProductFormData>;
  productId?: number;
  onSuccess: () => void;
  onCancel: () => void;
};

const defaultForm: ProductFormData = {
  title: '',
  slug: '',
  description: '',
  brand: '',
  price: '',
  discountPrice: '',
  discount: '',
  rating: '0',
  reviewCount: '0',
  stock: '0',
  isNew: false,
  isPopular: false,
  isFeatured: false,
  categoryId: '',
  specifications: '',
  image: '',
  colors: [],
};

export default function ProductForm({
  initialData,
  productId,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>({
    ...defaultForm,
    ...initialData,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await api.get('/categories');

        setCategories(response.data.categories ?? []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCategories();
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleBooleanChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;

    setForm((current) => ({
      ...current,
      [name]: checked,
    }));
  }

  function addColor() {
    setForm((current) => ({
      ...current,
      colors: [
        ...current.colors,
        {
          name: '',
          value: '#000000',
        },
      ],
    }));
  }

  function removeColor(index: number) {
    setForm((current) => ({
      ...current,
      colors: current.colors.filter((_, colorIndex) => colorIndex !== index),
    }));
  }

  function updateColor(
    index: number,
    field: keyof ProductColor,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      colors: current.colors.map((color, colorIndex) =>
        colorIndex === index
          ? {
              ...color,
              [field]: value,
            }
          : color,
      ),
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        title: form.title,
        slug: form.slug,
        description: form.description || undefined,
        brand: form.brand,
        price: Number(form.price),
        discountPrice: form.discountPrice
          ? Number(form.discountPrice)
          : undefined,
        discount: form.discount ? Number(form.discount) : undefined,
        rating: Number(form.rating),
        reviewCount: Number(form.reviewCount),
        stock: Number(form.stock),
        isNew: form.isNew,
        isPopular: form.isPopular,
        isFeatured: form.isFeatured,
        categoryId: Number(form.categoryId),
        specifications: form.specifications
          ? JSON.parse(form.specifications)
          : undefined,
        image: form.image || undefined,
        colors: form.colors,
      };

      if (productId) {
        await api.patch(`/admin/products/${productId}`, payload);
      } else {
        await api.post('/admin/products', payload);
      }

      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="عنوان محصول"
          className="w-full py-6"
          required
        />

        <Input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="slug"
          className="w-full py-6"
          required
        />

        <Input
          name="brand"
          value={form.brand}
          onChange={handleChange}
          placeholder="برند"
          className="w-full py-6"
          required
        />

        <Input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="قیمت"
          className="w-full py-6"
          required
        />

        <Input
          name="discountPrice"
          type="number"
          value={form.discountPrice}
          onChange={handleChange}
          placeholder="قیمت با تخفیف"
          className="w-full py-6"
        />

        <Input
          name="discount"
          type="number"
          value={form.discount}
          onChange={handleChange}
          placeholder="درصد تخفیف"
          className="w-full py-6"
        />

        <Input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="موجودی"
          className="w-full py-6"
          required
        />

        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="w-full rounded-xl border px-4 py-3"
          required
        >
          <option value="">انتخاب دسته‌بندی</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="توضیحات محصول"
        className="min-h-32 w-full rounded-xl border p-4 outline-none"
      />

      <Input
        name="image"
        value={form.image}
        onChange={handleChange}
        placeholder="آدرس تصویر محصول"
        className="w-full py-6"
      />

      <textarea
        name="specifications"
        value={form.specifications}
        onChange={handleChange}
        placeholder='مشخصات به صورت JSON، مثال: {"ram":"16GB","storage":"512GB"}'
        className="min-h-32 w-full rounded-xl border p-4 font-mono outline-none"
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">رنگ‌ها</h3>

          <Button type="button" variant="secondary" onClick={addColor}>
            افزودن رنگ
          </Button>
        </div>

        {form.colors.map((color, index) => (
          <div key={index} className="flex items-center gap-3">
            <Input
              value={color.name}
              onChange={(e) => updateColor(index, 'name', e.target.value)}
              placeholder="نام رنگ"
              className="flex-1 py-5"
            />

            <Input
              type="text"
              value={color.value}
              onChange={(e) => updateColor(index, 'value', e.target.value)}
              placeholder="#000000"
              className="flex-1 py-5"
            />

            <Button
              type="button"
              variant="secondary"
              onClick={() => removeColor(index)}
              className="text-red-500"
            >
              حذف
            </Button>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isNew"
            checked={form.isNew}
            onChange={handleBooleanChange}
          />
          محصول جدید
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPopular"
            checked={form.isPopular}
            onChange={handleBooleanChange}
          />
          محبوب
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={handleBooleanChange}
          />
          ویژه
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t pt-5">
        <Button type="button" variant="secondary" onClick={onCancel}>
          انصراف
        </Button>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading
            ? 'در حال ذخیره...'
            : productId
              ? 'ذخیره تغییرات'
              : 'افزودن محصول'}
        </Button>
      </div>
    </form>
  );
}
