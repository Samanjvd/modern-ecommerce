import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

import ProductForm from '@/components/admin/products/ProductForm';

import { Button } from '@/components/ui/Button';
import { api } from '@/api/axios';
import { Modal } from '@/components/ui/Modal/Modal';
import { Pagination } from '@/components/ui/Pagination/Pagination';

const PAGE_SIZE = 15;

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
  images?: { id: number; url: string }[];
  colors?: { id: number; name: string; value: string }[];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);

  async function fetchProducts() {
    try {
      setLoading(true);

      const response = await api.get('/products', {
        params: { page: 1, limit: 50, sort: 'newest' },
      });

      setProducts(response.data.products ?? []);
      setPage(1);
    } catch {
      toast.error('دریافت محصولات انجام نشد');
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const visibleProducts = products.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  async function handleDelete(id: number) {
    const confirmed = window.confirm('آیا از حذف این محصول مطمئن هستید؟');

    if (!confirmed) return;

    try {
      await api.delete(`/admin/products/${id}`);

      setProducts((current) => current.filter((product) => product.id !== id));
    } catch {
      toast.error('حذف محصول انجام نشد');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-3xl bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-primary-dark)] p-6 text-white shadow-lg">
        <div>
          <h1 className="text-2xl font-bold">محصولات</h1>

          <p className="mt-1 text-sm text-white/75">مدیریت محصولات فروشگاه</p>
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

      <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
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
                  <th className="px-6 py-4 text-sm font-medium">ردیف</th>

                  <th className="px-6 py-4 text-sm font-medium">محصول</th>

                  <th className="px-6 py-4 text-sm font-medium">برند</th>

                  <th className="px-6 py-4 text-sm font-medium">قیمت</th>

                  <th className="px-6 py-4 text-sm font-medium">موجودی</th>

                  <th className="px-6 py-4 text-sm font-medium">عملیات</th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map((product, index) => (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {((page - 1) * PAGE_SIZE + index + 1).toLocaleString(
                        'fa-IR',
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.title}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-xl bg-gray-100" />
                        )}
                        <div>
                          <p className="font-medium">{product.title}</p>

                          <p className="mt-1 text-xs text-gray-400">
                            {product.slug}
                          </p>
                        </div>
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
        {!loading && products.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
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
                  image: editingProduct.images?.[0]?.url ?? '',
                  colors: editingProduct.colors ?? [],
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
