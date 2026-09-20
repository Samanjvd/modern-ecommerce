import { Outlet } from 'react-router-dom';
import { useState } from 'react';

import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
      />

      <main className="min-w-0 flex-1">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
