import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({
  label,
  error,
  id,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[var(--color-text)]"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`h-11 w-full rounded-[var(--radius-md)] border bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] transition-all outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-3 focus:ring-[var(--color-primary-light)] ${
          error
            ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-red-100'
            : 'border-[var(--color-border)]'
        } ${className}`}
        {...props}
      />

      {error && (
        <span className="text-xs text-[var(--color-error)]">{error}</span>
      )}
    </div>
  );
}
