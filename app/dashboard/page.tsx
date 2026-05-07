'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DashboardHeader } from '@/components/dashboard-header';
import { mockCourses } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function DashboardPage() {
  const { isLoggedIn, user, getProgress } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) {
    return null;
  }

  const enrolledCourses = mockCourses.filter(c => user.enrolledCourses.includes(c.id));
  const availableCourses = mockCourses.filter(c => !user.enrolledCourses.includes(c.id));

  // Get courses with started lessons
  const continueLearnCourses = enrolledCourses.filter(course => {
    const progress = getProgress(course.id);
    return progress && progress.lastLessonId && progress.completedLessonIds.length > 0;
  });

  const getProgressPercentage = (courseId: string) => {
    const progress = getProgress(courseId);
    if (!progress) return 0;

    const course = mockCourses.find(c => c.id === courseId);
    if (!course) return 0;

    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    return totalLessons > 0 ? Math.round((progress.completedLessonIds.length / totalLessons) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Welcome */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">
            Welcome back, {user.email.split('@')[0]}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Continue your learning journey and expand your skills
          </p>
        </div>

        {/* Continue Learning */}
        {continueLearnCourses.length > 0 && (
          <section className="mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Continue Learning</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {continueLearnCourses.map(course => {
                const progress = getProgress(course.id);
                const progressPercent = getProgressPercentage(course.id);

                return (
                  <Link key={course.id} href={`/course/${course.id}`}>
                    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer h-full flex flex-col">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Last accessed: {progress?.lastLessonId ? `Lesson ${progress.lastLessonId}` : 'N/A'}
                      </p>
                      <div className="mb-4 flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-muted-foreground">Progress</span>
                          <span className="text-xs font-medium text-foreground">{progressPercent}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>
                      <Button className="w-full">Continue</Button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* My Courses */}
        {enrolledCourses.length > 0 && (
          <section className="mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {enrolledCourses.map(course => {
                const progressPercent = getProgressPercentage(course.id);
                const isCompleted = progressPercent === 100;

                return (
                  <Link key={course.id} href={`/course/${course.id}`}>
                    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer h-full flex flex-col">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {isCompleted ? '✓ Completed' : `${progressPercent}% complete`}
                      </p>
                      <div className="mb-4 flex-1">
                        <Progress value={progressPercent} className="h-2" />
                      </div>
                      <Button variant="outline" className="w-full">
                        {isCompleted ? 'Review' : 'Continue'}
                      </Button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* All Courses */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
            {availableCourses.length > 0 ? 'Available Courses' : 'All Courses'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {(availableCourses.length > 0 ? availableCourses : enrolledCourses.length === 0 ? mockCourses : []).map(course => {
              const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

              return (
                <Link key={course.id} href={`/course/${course.id}`}>
                  <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer h-full flex flex-col">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                    <div className="mb-4 flex-1 text-xs text-muted-foreground">
                      <p>{course.modules.length} modules • {totalLessons} lessons</p>
                    </div>
                    <Button className="w-full">
                      View Details
                    </Button>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
