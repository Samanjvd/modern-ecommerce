import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

import ProductForm from '@/components/admin/products/ProductForm';

import { Button } from '@/components/ui/Button';
import { api } from '@/api/axios';
import { Modal } from '@/components/ui/Modal/Modal';

type Product = {
  id: number;
  title: string;
  slug: string;
  brand: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  async function fetchProducts() {
    try {
      setLoading(true);

      const response = await api.get('/products');

      setProducts(response.data.products ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, []);

  async function handleDelete(id: number) {
    const confirmed = window.confirm('آیا از حذف این محصول مطمئن هستید؟');

    if (!confirmed) return;

    try {
      await api.delete(`/admin/products/${id}`);

      setProducts((current) => current.filter((product) => product.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">محصولات</h1>

          <p className="mt-1 text-sm text-gray-500">مدیریت محصولات فروشگاه</p>
        </div>

        <Button
          type="button"
          variant="primary"
          className="flex items-center gap-2"
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={18} />
          افزودن محصول
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            در حال دریافت محصولات...
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            محصولی وجود ندارد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium">محصول</th>

                  <th className="px-6 py-4 text-sm font-medium">برند</th>

                  <th className="px-6 py-4 text-sm font-medium">قیمت</th>

                  <th className="px-6 py-4 text-sm font-medium">موجودی</th>

                  <th className="px-6 py-4 text-sm font-medium">عملیات</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{product.title}</p>

                        <p className="mt-1 text-xs text-gray-400">
                          {product.slug}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm">{product.brand}</td>

                    <td className="px-6 py-4 text-sm">
                      {product.discountPrice
                        ? product.discountPrice
                        : product.price}{' '}
                      تومان
                    </td>

                    <td className="px-6 py-4 text-sm">{product.stock}</td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          className="p-2"
                          onClick={() => {
                            setEditingProduct(product);
                            setIsModalOpen(true);
                          }}
                        >
                          <Pencil size={16} />
                        </Button>

                        <Button
                          type="button"
                          variant="secondary"
                          className="p-2 text-red-500"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'ویرایش محصول' : 'افزودن محصول'}
      >
        <ProductForm
          productId={editingProduct?.id}
          initialData={
            editingProduct
              ? {
                  title: editingProduct.title,
                  slug: editingProduct.slug,
                  brand: editingProduct.brand,
                  price: String(editingProduct.price),
                  discountPrice: editingProduct.discountPrice
                    ? String(editingProduct.discountPrice)
                    : '',
                  stock: String(editingProduct.stock),
                  categoryId: String(editingProduct.categoryId),
                }
              : undefined
          }
          onSuccess={() => {
            setIsModalOpen(false);
            fetchProducts();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
