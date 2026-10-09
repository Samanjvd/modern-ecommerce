import { useState } from 'react';
import type { LoginFormValues } from '@/types/auth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { User2 } from 'lucide-react';

import { loginApi } from '@/api/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [form, setForm] = useState<LoginFormValues>({
    email: '',
    password: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const data = await loginApi(form);

      setAuth(data.user, data.accessToken);

      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow"
    >
      <div className="flex flex-col items-center">
        <span className="rounded-2xl bg-[var(--color-primary-light)]">
          <User2 size="60" className="p-3 text-[var(--color-primary)]" />
        </span>

        <h1 className="mt-6 text-2xl font-bold">ورود به حساب کاربری</h1>

        <p className="mt-2 text-sm text-gray-500">
          برای ادامه وارد حساب خود شوید
        </p>
      </div>

      <div>
        <Input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full py-6"
          placeholder="example@gmail.com"
        />
      </div>

      <div>
        <Input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="w-full py-6"
          placeholder="********"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        className="mt-8 w-full rounded-full py-7"
      >
        ورود
      </Button>

      <div className="flex justify-center">
        هنوز حساب درست نکردی?
        <Link to={'/register'} className="text-[var(--color-primary)]">
          &nbsp;پس بیا بریم
        </Link>
      </div>
    </form>
  );
}
