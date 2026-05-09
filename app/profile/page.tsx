'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DashboardHeader } from '@/components/dashboard-header';
import { useCourses } from '@/lib/use-courses';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { isLoggedIn, user, getProgress } = useAuth();
  const allCourses = useCourses();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) {
    return null;
  }

  const enrolledCourses = allCourses.filter(c => user.enrolledCourses.includes(c.id));

  const getProgressPercentage = (courseId: string) => {
    const progress = getProgress(courseId);
    if (!progress) return 0;

    const course = allCourses.find(c => c.id === courseId);
    if (!course) return 0;

    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    return totalLessons > 0 ? Math.round((progress.completedLessonIds.length / totalLessons) * 100) : 0;
  };

  const inProgressCourses = enrolledCourses.filter(c => {
    const percent = getProgressPercentage(c.id);
    return percent > 0 && percent < 100;
  });

  const completedCourses = enrolledCourses.filter(c => {
    const percent = getProgressPercentage(c.id);
    return percent === 100;
  });

  const notStartedCourses = enrolledCourses.filter(c => {
    const percent = getProgressPercentage(c.id);
    return percent === 0;
  });

  const totalLessonsCompleted = user.progress.reduce((sum, p) => sum + p.completedLessonIds.length, 0);
  const totalLessonsAvailable = allCourses.reduce((sum, c) => {
    return sum + c.modules.reduce((mSum, m) => mSum + m.lessons.length, 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Track your learning journey and achievements</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
            <p className="text-xl sm:text-2xl font-bold text-primary mb-1">{enrolledCourses.length}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Courses enrolled</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
            <p className="text-xl sm:text-2xl font-bold text-primary mb-1">{completedCourses.length}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
            <p className="text-xl sm:text-2xl font-bold text-primary mb-1">{totalLessonsCompleted}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Lessons completed</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
            <p className="text-xl sm:text-2xl font-bold text-primary mb-1">
              {totalLessonsAvailable > 0 ? Math.round((totalLessonsCompleted / totalLessonsAvailable) * 100) : 0}%
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Overall progress</p>
          </div>
        </div>

        {/* In Progress Courses */}
        {inProgressCourses.length > 0 && (
          <section className="mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">In Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {inProgressCourses.map(course => {
                const progress = getProgress(course.id);
                const progressPercent = getProgressPercentage(course.id);
                const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

                return (
                  <div key={course.id} className="bg-card rounded-lg border border-border p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {progress?.completedLessonIds.length} of {totalLessons} lessons completed
                    </p>
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-muted-foreground">Progress</span>
                        <span className="text-xs font-medium text-foreground">{progressPercent}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                    <Link href={`/course/${course.id}`}>
                      <Button className="w-full">Continue learning</Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Not Started Courses */}
        {notStartedCourses.length > 0 && (
          <section className="mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Not Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {notStartedCourses.map(course => (
                <div key={course.id} className="bg-card rounded-lg border border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                  <Link href={`/course/${course.id}`}>
                    <Button className="w-full">Start learning</Button>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Completed Courses */}
        {completedCourses.length > 0 && (
          <section className="mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Completed Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {completedCourses.map(course => {
                const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

                return (
                  <div key={course.id} className="bg-card rounded-lg border border-border p-6 border-primary/50">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground flex-1">{course.title}</h3>
                      <span className="text-2xl ml-2">✓</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      All {totalLessons} lessons completed
                    </p>
                    <div className="mb-4">
                      <Progress value={100} className="h-2" />
                    </div>
                    <Link href={`/course/${course.id}`}>
                      <Button variant="outline" className="w-full">Review course</Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Empty State */}
        {enrolledCourses.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-foreground mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-6">Start learning by enrolling in a course</p>
            <Link href="/dashboard">
              <Button>Browse courses</Button>
            </Link>
          </div>
        )}

        {/* Account Section */}
        <section className="mt-16 pt-8 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Account</h3>
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-1">Email address</p>
              <p className="text-foreground font-medium">{user.email}</p>
            </div>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-1">Member since</p>
              <p className="text-foreground font-medium">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
