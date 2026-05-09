'use client';

import { useCallback, useEffect, useState } from 'react';
import { Course, mockCourses } from './data';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);

  const loadCourses = useCallback(() => {
    const adminCourses = localStorage.getItem('learnhub_courses');
    const adminCourses2 = localStorage.getItem('learnhub_admin_courses');

    if (adminCourses) {
      try {
        setCourses(JSON.parse(adminCourses));
      } catch {
        setCourses(mockCourses);
      }
    } else if (adminCourses2) {
      try {
        setCourses(JSON.parse(adminCourses2));
      } catch {
        setCourses(mockCourses);
      }
    }
  }, []);

  useEffect(() => {
    loadCourses();

    const handleCoursesUpdated = () => loadCourses();
    window.addEventListener('storage', handleCoursesUpdated);
    window.addEventListener('learnhub_courses_updated', handleCoursesUpdated);

    return () => {
      window.removeEventListener('storage', handleCoursesUpdated);
      window.removeEventListener('learnhub_courses_updated', handleCoursesUpdated);
    };
  }, [loadCourses]);

  return courses;
}
