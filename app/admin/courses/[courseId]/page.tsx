'use client';

import { useAdmin } from '@/lib/admin-context';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AdminHeader } from '@/components/admin-header';
import { ModuleEditor } from '@/components/module-editor';
import { Course, Module } from '@/lib/data';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CourseEditorPage() {
  const { isLoggedIn, isReady, courses, updateCourse, addCourse } = useAdmin();
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const isNew = courseId === 'new';

  const [course, setCourse] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isReady && !isLoggedIn) {
      router.push('/admin/login');
      return;
    }

    if (!isReady || !isLoggedIn) return;

    if (!isNew) {
      const found = courses.find(c => c.id === courseId);
      if (found) {
        setCourse(JSON.parse(JSON.stringify(found)));
      } else {
        router.push('/admin/courses');
      }
    } else {
      setCourse({
        id: `course-${Date.now()}`,
        title: '',
        description: '',
        modules: [],
      });
    }
  }, [isReady, isLoggedIn, router, isNew, courseId, courses]);

  if (!isReady || !isLoggedIn || !course) return null;

  const handleSave = async (event?: React.FormEvent) => {
    event?.preventDefault();

    if (!course.title.trim() || !course.description.trim()) {
      toast.error('Please fill in course title and description');
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        addCourse(course);
      } else {
        updateCourse(courseId, {
          title: course.title,
          description: course.description,
          modules: course.modules,
        });
      }
      toast.success(isNew ? 'Course created' : 'Course changes saved');
      router.push('/admin/courses');
    } catch {
      toast.error(isNew ? 'Could not create course' : 'Could not save course changes');
    } finally {
      setSaving(false);
    }
  };

  const handleAddModule = () => {
    const newModule: Module = {
      id: `module-${Date.now()}`,
      title: `Module ${course.modules.length + 1}`,
      lessons: [],
    };
    setCourse({
      ...course,
      modules: [...course.modules, newModule],
    });
  };

  const handleUpdateModule = (moduleId: string, updatedModule: Partial<Module>) => {
    setCourse({
      ...course,
      modules: course.modules.map(m =>
        m.id === moduleId ? { ...m, ...updatedModule } : m
      ),
    });
  };

  const handleDeleteModule = (moduleId: string) => {
    setCourse({
      ...course,
      modules: course.modules.filter(m => m.id !== moduleId),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/courses" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
          <ChevronLeft className="w-4 h-4" />
          Back to Courses
        </Link>

        <div className="bg-card rounded-lg border border-border p-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            {isNew ? 'Create Course' : 'Edit Course'}
          </h1>

          <form onSubmit={handleSave} className="space-y-8">
            {/* Course Details */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-base">Course Title</Label>
                <Input
                  id="title"
                  value={course.title}
                  onChange={(e) => setCourse({ ...course, title: e.target.value })}
                  placeholder="e.g., React Fundamentals"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-base">Description</Label>
                <Textarea
                  id="description"
                  value={course.description}
                  onChange={(e) => setCourse({ ...course, description: e.target.value })}
                  placeholder="Describe what students will learn..."
                  className="mt-2 min-h-24"
                />
              </div>
            </div>

            {/* Modules Section */}
            <div className="border-t border-border pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Modules</h2>
                <Button type="button" variant="outline" onClick={handleAddModule}>
                  Add Module
                </Button>
              </div>

              <div className="space-y-4">
                {course.modules.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">No modules yet. Add one to get started!</p>
                ) : (
                  course.modules.map((module, index) => (
                    <ModuleEditor
                      key={module.id}
                      module={module}
                      index={index}
                      onUpdate={(updated) => handleUpdateModule(module.id, updated)}
                      onDelete={() => handleDeleteModule(module.id)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end border-t border-border pt-8">
              <Link href="/admin/courses">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : isNew ? 'Create Course' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
