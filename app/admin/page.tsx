'use client';

import { useAdmin } from '@/lib/admin-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AdminHeader } from '@/components/admin-header';

export default function AdminDashboard() {
  const { isLoggedIn, isReady, courses } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !isLoggedIn) {
      router.push('/admin/login');
    }
  }, [isReady, isLoggedIn, router]);

  if (!isReady || !isLoggedIn) return null;

  const totalModules = courses.reduce((sum, c) => sum + c.modules.length, 0);
  const totalLessons = courses.reduce(
    (sum, c) => sum + c.modules.reduce((mSum, m) => mSum + m.lessons.length, 0),
    0
  );
  const totalEnrolledUsers = 1250;

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your courses and content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Courses</p>
            <p className="text-3xl font-bold text-primary">{courses.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Modules</p>
            <p className="text-3xl font-bold text-primary">{totalModules}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Lessons</p>
            <p className="text-3xl font-bold text-primary">{totalLessons}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Enrolled Users</p>
            <p className="text-3xl font-bold text-primary">{totalEnrolledUsers}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-lg border border-border p-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Quick Actions</h2>
          <Link href="/admin/courses">
            <Button size="lg">Manage Courses</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
