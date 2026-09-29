import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import {
  changePasswordApi,
  getUserProfileApi,
  updateUserProfileApi,
} from '@/api/user.api';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth.store';

export default function ProfilePage() {
  const currentUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [name, setName] = useState(currentUser?.name ?? '');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserProfileApi()
      .then(({ user }) => {
        setName(user.name ?? '');
        setPhone(user.phone ?? '');
        setAvatar(user.avatar ?? '');
        setUser({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar ?? '',
          role: user.role,
        });
      })
      .catch(() => undefined);
  }, [setUser]);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const { user } = await updateUserProfileApi({
        name,
        phone,
        ...(avatar ? { avatar } : {}),
      });
      setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar ?? '',
        role: user.role ?? currentUser?.role ?? 'USER',
      });
      toast.success('اطلاعات حساب به‌روزرسانی شد');
    } catch {
      toast.error('به‌روزرسانی اطلاعات انجام نشد');
    } finally {
      setLoading(false);
    }
  }

  async function savePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await changePasswordApi({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      toast.success('رمز عبور تغییر کرد');
    } catch {
      toast.error('تغییر رمز عبور انجام نشد');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">
        حساب کاربری
      </h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={saveProfile}
          className="space-y-4 rounded-2xl border bg-white p-6"
        >
          <h2 className="text-lg font-bold">اطلاعات شخصی</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="نام و نام خانوادگی"
            className="h-11 w-full rounded-xl border px-3"
            required
          />
          <input
            value={currentUser?.email ?? ''}
            readOnly
            className="h-11 w-full rounded-xl border bg-gray-50 px-3 text-gray-500"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="شماره موبایل"
            className="h-11 w-full rounded-xl border px-3"
          />
          <input
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="آدرس تصویر پروفایل"
            className="h-11 w-full rounded-xl border px-3"
          />
          <Button type="submit" variant="primary" disabled={loading}>
            ذخیره اطلاعات
          </Button>
        </form>
        <form
          onSubmit={savePassword}
          className="space-y-4 rounded-2xl border bg-white p-6"
        >
          <h2 className="text-lg font-bold">تغییر رمز عبور</h2>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="رمز عبور فعلی"
            className="h-11 w-full rounded-xl border px-3"
            required
            minLength={6}
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="رمز عبور جدید"
            className="h-11 w-full rounded-xl border px-3"
            required
            minLength={6}
          />
          <Button type="submit" variant="outline" disabled={loading}>
            تغییر رمز عبور
          </Button>
        </form>
      </div>
    </main>
  );
}
