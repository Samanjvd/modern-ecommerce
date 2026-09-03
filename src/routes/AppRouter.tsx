import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { PublicLayout } from '@/layouts/PublicLayout';
import { Home } from '@/pages/Home';
import { ProductListPage } from '@/pages/Products/ProductListPage';
import { ProductDetailPage } from '@/pages/Products/ProductDetailPage';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">{title}</h1>
    </main>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/products" element={<ProductListPage />} />

          <Route path="/product/:id" element={<ProductDetailPage />} />

          <Route
            path="/categories/:slug"
            element={<PlaceholderPage title="دسته‌بندی" />}
          />

          <Route
            path="/search"
            element={<PlaceholderPage title="نتایج جستجو" />}
          />

          <Route path="/cart" element={<PlaceholderPage title="سبد خرید" />} />

          <Route
            path="/checkout"
            element={<PlaceholderPage title="تسویه حساب" />}
          />

          <Route
            path="/checkout/payment"
            element={<PlaceholderPage title="پرداخت" />}
          />

          <Route
            path="/checkout/success"
            element={<PlaceholderPage title="پرداخت موفق" />}
          />

          <Route
            path="/favorites"
            element={<PlaceholderPage title="علاقه‌مندی‌ها" />}
          />

          <Route
            path="/compare"
            element={<PlaceholderPage title="مقایسه محصولات" />}
          />

          <Route path="/login" element={<PlaceholderPage title="ورود" />} />

          <Route
            path="/login/otp"
            element={<PlaceholderPage title="ورود با کد تایید" />}
          />

          <Route
            path="/register"
            element={<PlaceholderPage title="ثبت نام" />}
          />

          <Route
            path="/about"
            element={<PlaceholderPage title="درباره ما" />}
          />

          <Route
            path="/contact"
            element={<PlaceholderPage title="تماس با ما" />}
          />

          <Route path="/blog" element={<PlaceholderPage title="وبلاگ" />} />

          <Route
            path="/blog/:slug"
            element={<PlaceholderPage title="مقاله" />}
          />

          <Route
            path="/faq"
            element={<PlaceholderPage title="سوالات متداول" />}
          />

          <Route
            path="/terms"
            element={<PlaceholderPage title="قوانین و مقررات" />}
          />

          <Route
            path="/privacy"
            element={<PlaceholderPage title="حریم خصوصی" />}
          />

          <Route
            path="/shipping-returns"
            element={<PlaceholderPage title="ارسال و مرجوعی" />}
          />

          <Route
            path="/track-order/:code"
            element={<PlaceholderPage title="پیگیری سفارش" />}
          />

          <Route path="*" element={<PlaceholderPage title="صفحه پیدا نشد" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
