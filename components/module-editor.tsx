'use client';

import { Module, Lesson } from '@/lib/data';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { LessonEditor } from './lesson-editor';
import { ChevronDown, Trash2 } from 'lucide-react';

interface ModuleEditorProps {
  module: Module;
  index: number;
  onUpdate: (module: Partial<Module>) => void;
  onDelete: () => void;
}

export function ModuleEditor({ module, index, onUpdate, onDelete }: ModuleEditorProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleAddLesson = () => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: `Lesson ${module.lessons.length + 1}`,
      content: '',
      videoUrls: [],
      transcript: '',
    };
    onUpdate({
      lessons: [...module.lessons, newLesson],
    });
  };

  const handleUpdateLesson = (lessonId: string, updated: Partial<Lesson>) => {
    onUpdate({
      lessons: module.lessons.map(l =>
        l.id === lessonId ? { ...l, ...updated } : l
      ),
    });
  };

  const handleDeleteLesson = (lessonId: string) => {
    onUpdate({
      lessons: module.lessons.filter(l => l.id !== lessonId),
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border border-border rounded-lg">
      <CollapsibleTrigger asChild>
        <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
          <div className="text-left">
            <h3 className="font-semibold text-foreground">Module {index + 1}</h3>
            <p className="text-sm text-muted-foreground">{module.lessons.length} lessons</p>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="border-t border-border px-6 py-4 space-y-4">
        <div>
          <Label htmlFor={`module-title-${module.id}`} className="text-sm">Module Title</Label>
          <Input
            id={`module-title-${module.id}`}
            value={module.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="e.g., Getting Started"
            className="mt-2"
          />
        </div>

        {/* Lessons */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-foreground">Lessons</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddLesson}
            >
              Add Lesson
            </Button>
          </div>

          <div className="space-y-3 bg-secondary/30 rounded-lg p-4">
            {module.lessons.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No lessons yet</p>
            ) : (
              module.lessons.map((lesson, lessonIndex) => (
                <LessonEditor
                  key={lesson.id}
                  lesson={lesson}
                  index={lessonIndex}
                  onUpdate={(updated) => handleUpdateLesson(lesson.id, updated)}
                  onDelete={() => handleDeleteLesson(lesson.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Delete Module Button */}
        <div className="flex justify-end pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Module
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
