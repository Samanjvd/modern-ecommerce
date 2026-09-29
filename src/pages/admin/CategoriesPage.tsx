import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

import {
  createCategoryApi,
  deleteCategoryApi,
  getCategoriesApi,
  updateCategoryApi,
  type Category,
} from '@/api/category.api';
import { Button } from '@/components/ui/Button';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  async function load() {
    const { categories: result } = await getCategoriesApi();
    setCategories(result);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load().catch(() => toast.error('دریافت دسته‌بندی‌ها انجام نشد'));
  }, []);

  function reset() {
    setName('');
    setSlug('');
    setEditingId(null);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    try {
      if (editingId) await updateCategoryApi(editingId, { name, slug });
      else await createCategoryApi({ name, slug });
      reset();
      await load();
      toast.success('دسته‌بندی ذخیره شد');
    } catch {
      toast.error('ذخیره دسته‌بندی انجام نشد');
    }
  }

  async function remove(id: number) {
    if (!window.confirm('این دسته‌بندی حذف شود؟')) return;
    try {
      await deleteCategoryApi(id);
      await load();
      toast.success('دسته‌بندی حذف شد');
    } catch {
      toast.error('دسته‌بندی دارای محصول است یا حذف نشد');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">دسته‌بندی‌ها</h1>
        <p className="mt-1 text-sm text-gray-500">مدیریت دسته‌بندی محصولات</p>
      </div>
      <form
        onSubmit={submit}
        className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-5 shadow-sm"
      >
        <label className="flex-1 text-sm">
          نام
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border px-3"
            required
          />
        </label>
        <label className="flex-1 text-sm">
          Slug
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-2 h-11 w-full rounded-xl border px-3"
            required
          />
        </label>
        <Button type="submit" variant="primary">
          <Plus size={17} />
          {editingId ? 'ذخیره تغییرات' : 'افزودن'}
        </Button>
        {editingId && (
          <Button type="button" variant="outline" onClick={reset}>
            انصراف
          </Button>
        )}
      </form>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-right">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-4">نام</th>
              <th className="px-5 py-4">Slug</th>
              <th className="px-5 py-4">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b last:border-0">
                <td className="px-5 py-4">{category.name}</td>
                <td className="px-5 py-4 text-sm text-gray-500">
                  {category.slug}
                </td>
                <td className="flex gap-2 px-5 py-4">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setEditingId(category.id);
                      setName(category.name);
                      setSlug(category.slug);
                    }}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => remove(category.id)}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
