type ProductPriceProps = {
  price: number;
  discountPrice?: number;
  discount?: number;
};

export function ProductPrice({
  price,
  discountPrice,
  discount,
}: ProductPriceProps) {
  const finalPrice = discountPrice ?? price;

  return (
    <div className="border-y border-[var(--color-border)] py-5">
      <p className="text-xs text-[var(--color-text-muted)]">قیمت محصول</p>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <p className="text-2xl font-bold text-[var(--color-text)]">
          {finalPrice.toLocaleString('fa-IR')}
          <span className="mr-2 text-sm font-normal text-[var(--color-text-muted)]">
            تومان
          </span>
        </p>

        {discountPrice && discount && discount > 0 && (
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-[var(--color-error)]">
            {discount.toLocaleString('fa-IR')}٪ تخفیف
          </span>
        )}
      </div>

      {discountPrice && (
        <p className="mt-2 text-sm text-[var(--color-text-muted)] line-through">
          {price.toLocaleString('fa-IR')} تومان
        </p>
      )}
    </div>
  );
}
