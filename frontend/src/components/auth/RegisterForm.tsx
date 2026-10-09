import { useState } from 'react';

import type { RegisterFormValues } from '@/types/auth';

import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

import { UserPlus } from 'lucide-react';

import { registerApi } from '@/api/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const [form, setForm] = useState<RegisterFormValues>({
    name: '',
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
      const data = await registerApi(form);

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
          <UserPlus size="60" className="p-3 text-[var(--color-primary)]" />
        </span>

        <h1 className="mt-6 text-2xl font-bold">ساخت حساب کاربری</h1>

        <p className="mt-2 text-sm text-gray-500">
          اطلاعات خود را برای ثبت نام وارد کنید
        </p>
      </div>

      <Input
        name="name"
        value={form.name}
        onChange={handleChange}
        className="w-full py-6"
        placeholder="نام"
      />

      <Input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        className="w-full py-6"
        placeholder="example@gmail.com"
      />

      <Input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        className="w-full py-6"
        placeholder="********"
      />

      <Button
        type="submit"
        variant="primary"
        className="mt-8 w-full rounded-full py-7"
      >
        ثبت نام
      </Button>
    </form>
  );
}
