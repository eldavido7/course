'use client';

import { Lesson } from '@/lib/data';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, Trash2, Plus } from 'lucide-react';

interface LessonEditorProps {
  lesson: Lesson;
  index: number;
  onUpdate: (lesson: Partial<Lesson>) => void;
  onDelete: () => void;
}

export function LessonEditor({ lesson, index, onUpdate, onDelete }: LessonEditorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddVideoUrl = () => {
    onUpdate({
      videoUrls: [...(lesson.videoUrls || []), ''],
    });
  };

  const handleUpdateVideoUrl = (urlIndex: number, url: string) => {
    const updated = [...(lesson.videoUrls || [])];
    updated[urlIndex] = url;
    onUpdate({ videoUrls: updated });
  };

  const handleRemoveVideoUrl = (urlIndex: number) => {
    onUpdate({
      videoUrls: (lesson.videoUrls || []).filter((_, i) => i !== urlIndex),
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border border-border rounded-lg bg-card">
      <CollapsibleTrigger asChild>
        <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors">
          <div className="text-left">
            <h4 className="font-medium text-foreground text-sm">Lesson {index + 1}</h4>
            <p className="text-xs text-muted-foreground">{lesson.title || 'Untitled'}</p>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="border-t border-border px-4 py-4 space-y-4">
        {/* Title */}
        <div>
          <Label htmlFor={`lesson-title-${lesson.id}`} className="text-xs">Lesson Title</Label>
          <Input
            id={`lesson-title-${lesson.id}`}
            value={lesson.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="e.g., Introduction to React"
            className="mt-1 text-sm"
          />
        </div>

        {/* Content */}
        <div>
          <Label htmlFor={`lesson-content-${lesson.id}`} className="text-xs">Content</Label>
          <Textarea
            id={`lesson-content-${lesson.id}`}
            value={lesson.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Lesson content goes here..."
            className="mt-1 text-sm min-h-20"
          />
        </div>

        {/* Video URLs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs">Video URLs</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddVideoUrl}
              className="h-6 px-2"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Video
            </Button>
          </div>
          <div className="space-y-2">
            {(lesson.videoUrls || []).length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">No videos added yet</p>
            ) : (
              (lesson.videoUrls || []).map((url, urlIndex) => (
                <div key={urlIndex} className="flex gap-2 items-start">
                  <Input
                    value={url}
                    onChange={(e) => handleUpdateVideoUrl(urlIndex, e.target.value)}
                    placeholder="e.g., https://www.youtube.com/embed/..."
                    className="text-sm flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveVideoUrl(urlIndex)}
                    className="text-destructive hover:text-destructive h-9 px-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Transcript */}
        <div>
          <Label htmlFor={`lesson-transcript-${lesson.id}`} className="text-xs">Transcript (Optional)</Label>
          <Textarea
            id={`lesson-transcript-${lesson.id}`}
            value={lesson.transcript}
            onChange={(e) => onUpdate({ transcript: e.target.value })}
            placeholder="Full transcript of the lesson content..."
            className="mt-1 text-sm min-h-24"
          />
        </div>

        {/* Delete Button */}
        <div className="flex justify-end pt-2 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Lesson
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
