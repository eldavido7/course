'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Course, Module, Lesson, mockCourses } from './data';

interface AdminContextType {
  isLoggedIn: boolean;
  isReady: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  addCourse: (course: Course) => void;
  updateCourse: (courseId: string, course: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  addModule: (courseId: string, module: Module) => void;
  updateModule: (courseId: string, moduleId: string, module: Partial<Module>) => void;
  deleteModule: (courseId: string, moduleId: string) => void;
  addLesson: (courseId: string, moduleId: string, lesson: Lesson) => void;
  updateLesson: (courseId: string, moduleId: string, lessonId: string, lesson: Partial<Lesson>) => void;
  deleteLesson: (courseId: string, moduleId: string, lessonId: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  // Load admin state and courses from localStorage on mount
  useEffect(() => {
    const savedAdminLogin = localStorage.getItem('learnhub_admin_login');
    const savedCourses = localStorage.getItem('learnhub_courses');

    if (savedAdminLogin === 'true') {
      setIsLoggedIn(true);
    }

    if (savedCourses) {
      try {
        setCourses(JSON.parse(savedCourses));
      } catch {
        setCourses(mockCourses);
      }
    } else {
      setCourses(mockCourses);
    }

    setIsReady(true);
  }, []);

  // Persist courses to localStorage
  const persistCourses = useCallback((updatedCourses: Course[]) => {
    setCourses(updatedCourses);
    localStorage.setItem('learnhub_courses', JSON.stringify(updatedCourses));
    // Also update the user-facing app's courses
    localStorage.setItem('learnhub_admin_courses', JSON.stringify(updatedCourses));
    window.dispatchEvent(new Event('learnhub_courses_updated'));
  }, []);

  const login = useCallback((email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      localStorage.setItem('learnhub_admin_login', 'true');
    } else {
      throw new Error('Invalid credentials');
    }
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.removeItem('learnhub_admin_login');
  }, []);

  const addCourse = useCallback((course: Course) => {
    const updatedCourses = [...courses, course];
    persistCourses(updatedCourses);
  }, [courses, persistCourses]);

  const updateCourse = useCallback((courseId: string, updates: Partial<Course>) => {
    const updatedCourses = courses.map(c =>
      c.id === courseId ? { ...c, ...updates } : c
    );
    persistCourses(updatedCourses);
  }, [courses, persistCourses]);

  const deleteCourse = useCallback((courseId: string) => {
    const updatedCourses = courses.filter(c => c.id !== courseId);
    persistCourses(updatedCourses);
  }, [courses, persistCourses]);

  const addModule = useCallback((courseId: string, module: Module) => {
    const updatedCourses = courses.map(c =>
      c.id === courseId ? { ...c, modules: [...c.modules, module] } : c
    );
    persistCourses(updatedCourses);
  }, [courses, persistCourses]);

  const updateModule = useCallback((courseId: string, moduleId: string, updates: Partial<Module>) => {
    const updatedCourses = courses.map(c =>
      c.id === courseId
        ? {
          ...c,
          modules: c.modules.map(m =>
            m.id === moduleId ? { ...m, ...updates } : m
          ),
        }
        : c
    );
    persistCourses(updatedCourses);
  }, [courses, persistCourses]);

  const deleteModule = useCallback((courseId: string, moduleId: string) => {
    const updatedCourses = courses.map(c =>
      c.id === courseId
        ? { ...c, modules: c.modules.filter(m => m.id !== moduleId) }
        : c
    );
    persistCourses(updatedCourses);
  }, [courses, persistCourses]);

  const addLesson = useCallback((courseId: string, moduleId: string, lesson: Lesson) => {
    const updatedCourses = courses.map(c =>
      c.id === courseId
        ? {
          ...c,
          modules: c.modules.map(m =>
            m.id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m
          ),
        }
        : c
    );
    persistCourses(updatedCourses);
  }, [courses, persistCourses]);

  const updateLesson = useCallback((courseId: string, moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    const updatedCourses = courses.map(c =>
      c.id === courseId
        ? {
          ...c,
          modules: c.modules.map(m =>
            m.id === moduleId
              ? {
                ...m,
                lessons: m.lessons.map(l =>
                  l.id === lessonId ? { ...l, ...updates } : l
                ),
              }
              : m
          ),
        }
        : c
    );
    persistCourses(updatedCourses);
  }, [courses, persistCourses]);

  const deleteLesson = useCallback((courseId: string, moduleId: string, lessonId: string) => {
    const updatedCourses = courses.map(c =>
      c.id === courseId
        ? {
          ...c,
          modules: c.modules.map(m =>
            m.id === moduleId
              ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
              : m
          ),
        }
        : c
    );
    persistCourses(updatedCourses);
  }, [courses, persistCourses]);

  return (
    <AdminContext.Provider
      value={{
        isLoggedIn,
        isReady,
        login,
        logout,
        courses,
        setCourses: persistCourses,
        addCourse,
        updateCourse,
        deleteCourse,
        addModule,
        updateModule,
        deleteModule,
        addLesson,
        updateLesson,
        deleteLesson,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
