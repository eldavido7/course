'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useCourses } from '@/lib/use-courses';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Menu, X, Volume2, Pause, Play } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LearningPage() {
  const { isLoggedIn, user, markLessonComplete, setLastLesson, getProgress } = useAuth();
  const allCourses = useCourses();
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const [course, setCourse] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [currentModule, setCurrentModule] = useState<any>(null);
  const [showTTS, setShowTTS] = useState(false);
  const [ttsState, setTtsState] = useState<'playing' | 'paused' | 'stopped'>('stopped');
  const [transcriptPage, setTranscriptPage] = useState(1);
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !user?.enrolledCourses.includes(courseId)) {
      router.push('/login');
      return;
    }

    const foundCourse = allCourses.find(c => c.id === courseId);
    if (!foundCourse) {
      router.push('/dashboard');
      return;
    }

    let foundLesson: any = null;
    let foundModule: any = null;

    for (const module of foundCourse.modules) {
      const lesson = module.lessons.find((l: any) => l.id === lessonId);
      if (lesson) {
        foundLesson = lesson;
        foundModule = module;
        break;
      }
    }

    if (!foundLesson) {
      router.push(`/course/${courseId}`);
      return;
    }

    setCourse(foundCourse);
    setLesson(foundLesson);
    setCurrentModule(foundModule);

    setLastLesson(courseId, lessonId);
  }, [isLoggedIn, courseId, lessonId, router, user, getProgress, setLastLesson, allCourses]);

  if (!course || !lesson || !currentModule) {
    return null;
  }

  const currentModuleIndex = course.modules.findIndex((m: any) => m.id === currentModule.id);
  const currentLessonIndexInModule = currentModule.lessons.findIndex((l: any) => l.id === lesson.id);
  const progress = getProgress(courseId);
  const isCompleted = progress?.completedLessonIds.includes(lessonId) ?? false;

  let nextLesson = null;
  let prevLesson = null;

  // Find next lesson
  if (currentLessonIndexInModule < currentModule.lessons.length - 1) {
    nextLesson = currentModule.lessons[currentLessonIndexInModule + 1];
  } else if (currentModuleIndex < course.modules.length - 1) {
    nextLesson = course.modules[currentModuleIndex + 1].lessons[0];
  }

  // Find previous lesson
  if (currentLessonIndexInModule > 0) {
    prevLesson = currentModule.lessons[currentLessonIndexInModule - 1];
  } else if (currentModuleIndex > 0) {
    const prevModule = course.modules[currentModuleIndex - 1];
    prevLesson = prevModule.lessons[prevModule.lessons.length - 1];
  }

  const completeCurrentLesson = (message: string) => {
    if (!isCompleted) {
      try {
        markLessonComplete(courseId, lessonId);
        toast.success(message);
      } catch {
        toast.error('Could not mark lesson complete');
        return false;
      }
    }

    return true;
  };

  const handleNextLesson = () => {
    if (!nextLesson) return;

    if (!completeCurrentLesson('Lesson completed')) return;
    router.push(`/learn/${courseId}/${nextLesson.id}`);
  };

  const handleCompleteCourse = () => {
    if (!completeCurrentLesson('Course completed')) return;
  };

  const handleTTS = () => {
    if (!showTTS) {
      setShowTTS(true);
      const didStart = speakLesson();

      if (!didStart) {
        setShowTTS(false);
        toast.error('Text to speech is not available in this browser');
      }
    }
  };

  const speakLesson = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(lesson.content);
      utterance.rate = 1;

      utterance.onstart = () => setTtsState('playing');
      utterance.onpause = () => setTtsState('paused');
      utterance.onend = () => setTtsState('stopped');

      window.speechSynthesis.speak(utterance);
      return true;
    }

    return false;
  };

  const toggleTTSPlayPause = () => {
    if ('speechSynthesis' in window) {
      if (ttsState === 'playing') {
        window.speechSynthesis.pause();
        setTtsState('paused');
      } else if (ttsState === 'paused') {
        window.speechSynthesis.resume();
        setTtsState('playing');
      } else {
        speakLesson();
      }
    }
  };

  const closeTTS = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setShowTTS(false);
    setTtsState('stopped');
  };

  // Transcript pagination
  const transcriptLines = lesson.transcript.split('\n\n');
  const linesPerPage = 3;
  const totalPages = Math.ceil(transcriptLines.length / linesPerPage);
  const paginatedTranscript = transcriptLines.slice(
    (transcriptPage - 1) * linesPerPage,
    transcriptPage * linesPerPage
  );

  const SidebarContent = () => (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <Link href={`/course/${courseId}`} className="text-primary hover:underline text-sm mb-4 inline-block">
          ← Back to course
        </Link>
        <h3 className="font-semibold text-foreground">{course.title}</h3>
      </div>

      <div className="space-y-2">
        {course.modules.map((module: any, moduleIdx: number) => (
          <Collapsible key={module.id} defaultOpen={module.id === currentModule.id}>
            <CollapsibleTrigger className="text-sm font-medium text-foreground hover:text-primary w-full text-left py-2">
              {module.title}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-2">
              {module.lessons.map((lesson: any) => {
                const progress = getProgress(courseId);
                const isCurrentLesson = lesson.id === lessonId;
                const isLessonCompleted = progress?.completedLessonIds.includes(lesson.id);

                return (
                  <Link
                    key={lesson.id}
                    href={`/learn/${courseId}/${lesson.id}`}
                    className={`block text-xs p-2 rounded transition-colors ${
                      isCurrentLesson
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isLessonCompleted && <span>✓</span>}
                      {lesson.title}
                    </span>
                  </Link>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-card/50 backdrop-blur-sm z-40">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/dashboard" className="text-lg font-bold text-primary">
            LearnHub
          </Link>

          <div className="flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[80vh]">
                <SidebarContent />
              </DrawerContent>
            </Drawer>
          </div>

          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle />
            <Link href={`/course/${courseId}`}>
              <Button variant="ghost" size="sm">Back to course</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar - Desktop only */}
        <div className="hidden sm:block w-64 border-r border-border overflow-y-auto">
          <SidebarContent />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {/* Lesson Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">{lesson.title}</h1>

            {/* Video Section */}
            {lesson.videoUrls && lesson.videoUrls.length > 0 && (
              <div className="mb-8">
                <div className="bg-black rounded-lg overflow-hidden aspect-video mb-4">
                  <iframe
                    src={lesson.videoUrls[0]}
                    title="Lesson video"
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
                {lesson.videoUrls.length > 1 && (
                  <p className="text-xs text-muted-foreground">
                    + {lesson.videoUrls.length - 1} more video{lesson.videoUrls.length > 2 ? 's' : ''}
                  </p>
                )}
              </div>
            )}

            {/* Transcript Section */}
            <div className="bg-card rounded-lg border border-border p-6 mb-8">
              <div className="mb-4">
                <h3 className="font-semibold text-foreground">Transcript</h3>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {paginatedTranscript.map((line: string, idx: number) => (
                  <p key={idx} className="text-sm text-muted-foreground leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTranscriptPage(p => Math.max(1, p - 1))}
                    disabled={transcriptPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Page {transcriptPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTranscriptPage(p => Math.min(totalPages, p + 1))}
                    disabled={transcriptPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>

            {/* Lesson Content */}
            <div className="prose prose-sm max-w-none mb-12 text-foreground">
              <div className="not-prose mb-4 flex items-center justify-between gap-4">
                <h3 className="font-semibold text-foreground">Lesson Content</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTTS}
                  className="gap-2"
                >
                  <Volume2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Listen</span>
                </Button>
              </div>
              <div className="space-y-4">
                {lesson.content.split('\n\n').map((paragraph: string, idx: number) => (
                  <p key={idx} className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 pb-8">
              {prevLesson ? (
                <Link href={`/learn/${courseId}/${prevLesson.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    ← Previous Lesson
                  </Button>
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              {nextLesson ? (
                <Button onClick={handleNextLesson} className="flex-1">
                  Next Lesson →
                </Button>
              ) : (
                <Button
                  onClick={handleCompleteCourse}
                  disabled={isCompleted}
                  variant={isCompleted ? 'secondary' : 'default'}
                  className="flex-1"
                >
                  {isCompleted ? 'Course completed' : 'Mark course complete'}
                </Button>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* TTS Floating Control */}
      {showTTS && (
        <div className="fixed top-24 right-4 bg-card border border-border rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTTSPlayPause}
              className="gap-2"
            >
              {ttsState === 'playing' ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {ttsState === 'playing' ? 'Pause' : 'Play'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeTTS}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {ttsState === 'playing' ? 'Reading lesson...' : 'Paused'}
          </p>
        </div>
      )}
    </div>
  );
}
