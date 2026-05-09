'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DashboardHeader } from '@/components/dashboard-header';
import { useCourses } from '@/lib/use-courses';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CoursePreviewPage() {
  const { isLoggedIn, user, enrollCourse, getProgress } = useAuth();
  const allCourses = useCourses();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<any>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    const foundCourse = allCourses.find(c => c.id === courseId);
    if (!foundCourse) {
      router.push('/dashboard');
      return;
    }

    setCourse(foundCourse);
  }, [isLoggedIn, courseId, allCourses, router]);

  if (!course) {
    return null;
  }

  const isEnrolled = user?.enrolledCourses.includes(course.id);
  const progress = getProgress(course.id);
  const totalLessons = course.modules.reduce((sum: number, m: any) => sum + m.lessons.length, 0);
  const completedLessons = progress?.completedLessonIds.length || 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const handleEnroll = () => {
    setIsEnrolling(true);
    try {
      enrollCourse(course.id);
      toast.success('Enrolled in course');
      setTimeout(() => {
        setIsEnrolling(false);
        // Rerender to show enrolled state
        router.refresh();
      }, 300);
    } catch {
      toast.error('Could not enroll in this course');
      setIsEnrolling(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-primary hover:underline text-sm mb-4 inline-block">
            ← Back to courses
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{course.title}</h1>
          <p className="text-lg text-muted-foreground">{course.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Stats */}
            <div className="bg-card rounded-lg border border-border p-6 mb-8">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-bold text-primary">{course.modules.length}</p>
                  <p className="text-xs text-muted-foreground">Modules</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{totalLessons}</p>
                  <p className="text-xs text-muted-foreground">Lessons</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">Beginner</p>
                  <p className="text-xs text-muted-foreground">Level</p>
                </div>
              </div>
            </div>

            {/* Progress */}
            {isEnrolled && (
              <div className="bg-card rounded-lg border border-border p-6 mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Your Progress</h3>
                <div className="mb-2 flex justify-between">
                  <span className="text-sm text-muted-foreground">Overall completion</span>
                  <span className="text-sm font-medium text-foreground">{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {completedLessons} of {totalLessons} lessons completed
                </p>
              </div>
            )}

            {/* Modules */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Course Content</h3>
              <div className="space-y-2">
                {course.modules.map((module: any) => (
                  <Collapsible key={module.id} className="border border-border rounded-lg">
                    <div className="flex items-center gap-2 p-4 hover:bg-secondary/50">
                      <CollapsibleTrigger className="flex min-w-0 flex-1 items-center gap-3 text-left">
                        <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{module.title}</p>
                          <p className="text-xs text-muted-foreground">{module.lessons.length} lessons</p>
                        </div>
                      </CollapsibleTrigger>
                      {isEnrolled && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/learn/${course.id}/${module.lessons[0].id}`}>Open</Link>
                        </Button>
                      )}
                    </div>
                    <CollapsibleContent className="border-t border-border">
                      <div className="p-4 space-y-2 bg-secondary/30">
                        {module.lessons.map((lesson: any) => {
                          const isCompleted = progress?.completedLessonIds.includes(lesson.id);
                          const isLocked = !isEnrolled;
                          const lessonContent = (
                            <div className="flex items-start gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                                isCompleted
                                  ? 'bg-primary border-primary'
                                  : 'border-border'
                              }`} />
                              <span className={`text-sm ${isCompleted ? 'text-foreground line-through' : 'text-foreground'}`}>
                                {lesson.title}
                              </span>
                            </div>
                          );

                          return isLocked ? (
                            <div
                              key={lesson.id}
                              className="p-3 rounded border border-border bg-muted/30 opacity-50 cursor-not-allowed"
                            >
                              {lessonContent}
                            </div>
                          ) : (
                            <Link
                              key={lesson.id}
                              href={`/learn/${course.id}/${lesson.id}`}
                              className="block p-3 rounded border border-border hover:bg-card transition-colors"
                            >
                              {lessonContent}
                            </Link>
                          );
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
              {isEnrolled ? (
                <>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Let&apos;s continue learning</h3>
                  <Link href={`/learn/${course.id}/${progress?.lastLessonId || course.modules[0].lessons[0].id}`}>
                    <Button className="w-full mb-3">
                      {progressPercent === 100 ? 'Review Course' : 'Continue Course'}
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard">Back to dashboard</Link>
                  </Button>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-2xl font-bold text-foreground mb-2">Free</p>
                    <p className="text-xs text-muted-foreground">Start learning immediately</p>
                  </div>
                  <Button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="w-full"
                  >
                    {isEnrolling ? 'Enrolling...' : 'Enroll in Course'}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Access all course materials and track your progress
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
