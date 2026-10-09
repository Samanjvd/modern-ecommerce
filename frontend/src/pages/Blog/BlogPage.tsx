import { ArrowLeft, CalendarDays, ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { blogPosts } from '@/data/BlogPosts';

export default function BlogPage() {
  const { slug } = useParams();
  const post = slug ? blogPosts.find((item) => String(item.id) === slug) : null;

  if (slug && post) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">
        <Link
          to="/blog"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-primary)]"
        >
          <ChevronRight size={17} /> بازگشت به وبلاگ
        </Link>
        <article className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
          <img
            src={post.image}
            alt={post.title}
            className="h-64 w-full object-cover md:h-96"
          />
          <div className="p-6 md:p-10">
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <CalendarDays size={15} /> {post.date}
            </div>
            <h1 className="mt-4 text-2xl leading-10 font-bold text-[var(--color-text)] md:text-4xl">
              {post.title}
            </h1>
            <p className="mt-6 text-sm leading-8 text-[var(--color-text-muted)]">
              {post.description} این مطلب راهنمایی کاربردی برای شناخت بهتر
              فناوری‌ها و انتخاب آگاهانه‌تر محصولات دیجیتال است.
            </p>
          </div>
        </article>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
      <section className="rounded-[var(--radius-xl)] bg-[var(--color-primary)] p-7 text-white md:p-12">
        <p className="text-sm text-white/75">مجله زنبیلک</p>
        <h1 className="mt-3 text-3xl font-black md:text-5xl">
          ایده‌های تازه برای دنیای دیجیتال
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">
          بررسی‌ها، راهنماهای خرید و خبرهای تکنولوژی را ساده و کاربردی دنبال کن.
        </p>
      </section>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((item) => (
          <Link
            key={item.id}
            to={`/blog/${item.id}`}
            className="group overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)] transition hover:-translate-y-1"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <CalendarDays size={14} /> {item.date}
              </div>
              <h2 className="mt-3 line-clamp-2 text-base leading-7 font-bold text-[var(--color-text)]">
                {item.title}
              </h2>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)]">
                ادامه مطلب <ArrowLeft size={15} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
