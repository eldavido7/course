'use client';

import { useAdmin } from '@/lib/admin-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AdminHeader } from '@/components/admin-header';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCoursesPage() {
  const { isLoggedIn, isReady, courses, deleteCourse } = useAdmin();
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (isReady && !isLoggedIn) {
      router.push('/admin/login');
    }
  }, [isReady, isLoggedIn, router]);

  if (!isReady || !isLoggedIn) return null;

  const handleDelete = (courseId: string) => {
    try {
      deleteCourse(courseId);
      toast.success('Course deleted');
      setDeleteId(null);
    } catch {
      toast.error('Could not delete course');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Courses</h1>
            <p className="text-muted-foreground">Manage all your courses and content</p>
          </div>
          <Link href="/admin/courses/new">
            <Button>Create Course</Button>
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-6">No courses yet</p>
            <Link href="/admin/courses/new">
              <Button>Create your first course</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>

                <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                  <p>📚 Modules: {course.modules.length}</p>
                  <p>📖 Lessons: {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)}</p>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/courses/${course.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog open={deleteId === course.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(course.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogTitle>Delete Course</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{course.title}"? This action cannot be undone. All modules and lessons will be deleted.
                      </AlertDialogDescription>
                      <div className="flex gap-3 justify-end">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(course.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
