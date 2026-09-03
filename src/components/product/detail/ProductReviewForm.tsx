import { useState } from 'react';
import { LogIn, Send, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';

type ProductReviewFormProps = {
  isLoggedIn?: boolean;
};

export function ProductReviewForm({
  isLoggedIn = false,
}: ProductReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!rating || !comment.trim()) {
      return;
    }

    // بعداً به API متصل می‌شود.
    console.log({
      rating,
      comment: comment.trim(),
    });

    setRating(0);
    setComment('');
  };

  if (!isLoggedIn) {
    return (
      <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
          <LogIn size={20} />
        </div>

        <h3 className="mt-4 text-sm font-bold text-[var(--color-text)]">
          برای ثبت دیدگاه وارد حساب خود شوید
        </h3>

        <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-[var(--color-text-muted)]">
          برای اینکه بتوانید تجربه خود از این محصول را با دیگران به اشتراک
          بگذارید، ابتدا باید وارد حساب کاربری خود شوید.
        </p>

        <Link to="/login" className="mt-5 inline-flex">
          <Button type="button" variant="primary" size="md">
            ورود به حساب
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5"
    >
      <h3 className="text-sm font-bold text-[var(--color-text)]">
        دیدگاه خود را ثبت کنید
      </h3>

      {/* Rating */}
      <div className="mt-5">
        <p className="text-xs font-medium text-[var(--color-text)]">
          امتیاز شما
        </p>

        <div className="mt-2 flex items-center gap-1">
          {Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;

            return (
              <button
                key={starValue}
                type="button"
                onClick={() => setRating(starValue)}
                className="rounded-sm p-1 transition-transform duration-150 hover:scale-110"
                aria-label={`امتیاز ${starValue} از ۵`}
              >
                <Star
                  size={20}
                  className={
                    starValue <= rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-[var(--color-border)]'
                  }
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Comment */}
      <div className="mt-5">
        <label
          htmlFor="product-review"
          className="text-xs font-medium text-[var(--color-text)]"
        >
          متن دیدگاه
        </label>

        <textarea
          id="product-review"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="تجربه خود از خرید و استفاده از این محصول را بنویسید..."
          rows={5}
          className="mt-2 w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-text)] transition outline-none focus:border-[var(--color-primary)] focus:ring-3 focus:ring-[var(--color-primary-light)]"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        className="mt-4"
        disabled={!rating || !comment.trim()}
      >
        <Send size={16} />
        ثبت دیدگاه
      </Button>
    </form>
  );
}
