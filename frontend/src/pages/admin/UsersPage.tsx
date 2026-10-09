import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { getAdminUsersApi, updateUserRoleApi } from '@/api/admin.api';
import type { UserProfile } from '@/api/user.api';

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  useEffect(() => {
    getAdminUsersApi()
      .then(({ users: result }) => setUsers(result))
      .catch(() => toast.error('دریافت کاربران انجام نشد'));
  }, []);
  async function changeRole(id: number, role: 'USER' | 'ADMIN') {
    try {
      await updateUserRoleApi(id, role);
      setUsers((current) =>
        current.map((user) => (user.id === id ? { ...user, role } : user)),
      );
      toast.success('نقش کاربر تغییر کرد');
    } catch {
      toast.error('تغییر نقش انجام نشد');
    }
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">کاربران</h1>
        <p className="mt-1 text-sm text-gray-500">مدیریت نقش کاربران</p>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-right">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-4">نام</th>
              <th className="px-5 py-4">ایمیل</th>
              <th className="px-5 py-4">تلفن</th>
              <th className="px-5 py-4">نقش</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="px-5 py-4">{user.name || '-'}</td>
                <td className="px-5 py-4">{user.email}</td>
                <td className="px-5 py-4">{user.phone || '-'}</td>
                <td className="px-5 py-4">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      changeRole(user.id, e.target.value as 'USER' | 'ADMIN')
                    }
                    className="rounded-lg border px-3 py-2"
                  >
                    <option value="USER">کاربر</option>
                    <option value="ADMIN">ادمین</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
