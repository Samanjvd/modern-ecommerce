import InstagramIcon from '@/components/icons/InstagramIcon';
import XIcon from '@/components/icons/XIcon';
import { Send, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = [
  {
    title: 'زنبیلک',
    links: ['درباره ما', 'تماس با ما', 'فرصت‌های شغلی', 'مجله زنبیلک'],
  },
  {
    title: 'خدمات مشتریان',
    links: [
      'پرسش‌های متداول',
      'شرایط بازگشت کالا',
      'حریم خصوصی',
      'قوانین و مقررات',
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-8 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="w-full px-4 py-10 md:px-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-primary)]">
              زنبیلک
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--color-text-muted)]">
              تجربه‌ای ساده، سریع و مطمئن برای خرید آنلاین محصولات مورد نیاز
              شما.
            </p>

            <div className="flex items-center gap-2">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <InstagramIcon className="size-6" />
              </a>

              <a
                href="#"
                aria-label="Telegram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <Send size={19} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <XIcon />
              </a>
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                {section.title}
              </h3>

              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-bold text-[var(--color-text)]">
              ارتباط با ما
            </h3>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                <Phone size={17} className="shrink-0" />
                <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                <Mail size={17} className="shrink-0" />
                <span>info@zanbilak.ir</span>
              </div>

              <div className="flex items-start gap-3 text-xs leading-6 text-[var(--color-text-muted)]">
                <MapPin size={17} className="mt-1 shrink-0" />
                <span>مشهد، بلوار وکیل آباد، مرکز فناوری زنبیلک</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--color-border)] pt-5 text-xs text-[var(--color-text-muted)] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} زنبیلک. تمامی حقوق محفوظ است.</p>

          <p>طراحی و توسعه با ❤️</p>
        </div>
      </div>
    </footer>
  );
}
