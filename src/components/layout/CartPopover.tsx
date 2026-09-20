import { ChevronLeft, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useCartStore } from '@/stores/cartStore';

export function CartPopover() {
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const items = useCartStore((state) => state.items);

  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const removeItem = useCartStore((state) => state.removeItem);

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[var(--color-primary-light)]"
        aria-label="سبد خرید"
      >
        <ShoppingCart size={21} />

        {cartCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] text-white">
            {cartCount.toLocaleString('fa-IR')}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-[calc(100%+10px)] left-0 z-[80] w-[360px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h3 className="font-bold text-gray-900">سبد خرید</h3>

              <p className="mt-1 text-xs text-gray-500">
                {cartCount.toLocaleString('fa-IR')} کالا
              </p>
            </div>

            <ShoppingCart size={20} className="text-[var(--color-primary)]" />
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-12 text-center">
              <ShoppingCart size={42} className="text-gray-300" />

              <p className="mt-4 font-medium text-gray-700">
                سبد خرید خالی است
              </p>

              <p className="mt-1 text-sm text-gray-400">
                هنوز محصولی به سبد خرید اضافه نکرده‌اید
              </p>
            </div>
          ) : (
            <>
              <div className="max-h-80 overflow-y-auto p-3">
                {items.map((item) => {
                  const colorValue = item.selectedColor?.value;

                  return (
                    <div
                      key={`${item.product.id}-${colorValue ?? 'default'}`}
                      className="flex gap-3 rounded-xl p-2 transition hover:bg-gray-50"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        {item.product.image?.[0]?.url && (
                          <img
                            src={item.product.image[0].url}
                            alt={item.product.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {item.product.title}
                        </p>

                        {item.selectedColor && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                            <span
                              className="h-3 w-3 rounded-full border"
                              style={{
                                backgroundColor: item.selectedColor.value,
                              }}
                            />

                            <span>{item.selectedColor.name}</span>
                          </div>
                        )}

                        <p className="mt-1 text-sm font-bold text-[var(--color-primary)]">
                          {item.product.price.toLocaleString('fa-IR')} تومان
                        </p>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-lg border">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                  colorValue,
                                )
                              }
                              disabled={item.quantity >= item.product.stock}
                              className="p-1.5 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Plus size={13} />
                            </button>

                            <span className="min-w-6 text-center text-xs">
                              {item.quantity.toLocaleString('fa-IR')}
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                if (item.quantity === 1) {
                                  removeItem(item.product.id, colorValue);

                                  return;
                                }

                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                  colorValue,
                                );
                              }}
                              className="p-1.5 transition hover:bg-gray-100"
                            >
                              <Minus size={13} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(item.product.id, colorValue)
                            }
                            className="rounded-lg p-1.5 text-red-400 transition hover:bg-red-50 hover:text-red-500"
                            aria-label="حذف محصول"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t p-4">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-gray-500">مبلغ کل</span>

                  <span className="font-bold text-gray-900">
                    {totalPrice.toLocaleString('fa-IR')} تومان
                  </span>
                </div>

                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  <span>مشاهده سبد خرید</span>

                  <ChevronLeft size={18} />
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
