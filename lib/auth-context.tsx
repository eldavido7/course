'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { User, UserProgress, mockUser } from './data';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => void;
  signup: (email: string, password: string) => void;
  logout: () => void;
  enrollCourse: (courseId: string) => void;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  setLastLesson: (courseId: string, lessonId: string) => void;
  getProgress: (courseId: string) => UserProgress | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const persistUser = (updatedUser: User) => {
  localStorage.setItem('learnhub_user', JSON.stringify(updatedUser));
  return updatedUser;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('learnhub_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem('learnhub_user');
      }
    }
  }, []);

  const login = useCallback((email: string, password: string) => {
    // Mock login - in real app, would validate against backend
    const newUser: User = {
      id: 'user-' + Date.now(),
      email,
      enrolledCourses: mockUser.enrolledCourses,
      progress: mockUser.progress
    };
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('learnhub_user', JSON.stringify(newUser));
  }, []);

  const signup = useCallback((email: string, password: string) => {
    // Mock signup - in real app, would validate and create user on backend
    const newUser: User = {
      id: 'user-' + Date.now(),
      email,
      enrolledCourses: [],
      progress: []
    };
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('learnhub_user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('learnhub_user');
  }, []);

  const enrollCourse = useCallback((courseId: string) => {
    setUser(currentUser => {
      if (!currentUser) return currentUser;

      const hasCourse = currentUser.enrolledCourses.includes(courseId);
      const hasProgress = currentUser.progress.some(p => p.courseId === courseId);

      if (hasCourse && hasProgress) return currentUser;

      return persistUser({
        ...currentUser,
        enrolledCourses: [...new Set([...currentUser.enrolledCourses, courseId])],
        progress: hasProgress
          ? currentUser.progress
          : [...currentUser.progress, { courseId, completedLessonIds: [] }]
      });
    });
  }, []);

  const markLessonComplete = useCallback((courseId: string, lessonId: string) => {
    setUser(currentUser => {
      if (!currentUser) return currentUser;

      const progress = currentUser.progress.find(p => p.courseId === courseId);

      if (progress?.completedLessonIds.includes(lessonId)) return currentUser;

      const updatedProgress = progress
        ? currentUser.progress.map(p => {
          if (p.courseId !== courseId) return p;

          return {
            ...p,
            completedLessonIds: [...p.completedLessonIds, lessonId],
            lastLessonId: lessonId
          };
        })
        : [...currentUser.progress, { courseId, completedLessonIds: [lessonId], lastLessonId: lessonId }];

      return persistUser({ ...currentUser, progress: updatedProgress });
    });
  }, []);

  const setLastLesson = useCallback((courseId: string, lessonId: string) => {
    setUser(currentUser => {
      if (!currentUser) return currentUser;

      const progress = currentUser.progress.find(p => p.courseId === courseId);

      if (progress?.lastLessonId === lessonId) return currentUser;

      const updatedProgress = progress
        ? currentUser.progress.map(p => {
          if (p.courseId !== courseId) return p;

          return { ...p, lastLessonId: lessonId };
        })
        : [...currentUser.progress, { courseId, completedLessonIds: [], lastLessonId: lessonId }];

      return persistUser({ ...currentUser, progress: updatedProgress });
    });
  }, []);

  const getProgress = useCallback((courseId: string) => {
    return user?.progress.find(p => p.courseId === courseId);
  }, [user]);

  const authValue = useMemo(() => ({
    user,
    isLoggedIn,
    login,
    signup,
    logout,
    enrollCourse,
    markLessonComplete,
    setLastLesson,
    getProgress
  }), [
    user,
    isLoggedIn,
    login,
    signup,
    logout,
    enrollCourse,
    markLessonComplete,
    setLastLesson,
    getProgress
  ]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
