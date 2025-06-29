'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { cn } from '@/lib/utils';

interface QuillEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minHeight?: string;
}

export interface QuillEditorRef {
  focus: () => void;
  blur: () => void;
  getContent: () => string;
  setContent: (content: string) => void;
}

export const QuillEditor = forwardRef<QuillEditorRef, QuillEditorProps>(({
  value = '',
  onChange,
  placeholder = 'Mô tả sản phẩm của bạn...',
  disabled = false,
  className,
  minHeight = '150px'
}, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const isUpdatingRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const mountedRef = useRef(false);

  // Stable reference for onChange callback
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useImperativeHandle(ref, () => ({
    focus: () => quillRef.current?.focus(),
    blur: () => quillRef.current?.blur(),
    getContent: () => quillRef.current?.root.innerHTML || '',
    setContent: (content: string) => {
      if (quillRef.current && mountedRef.current) {
        isUpdatingRef.current = true;
        quillRef.current.root.innerHTML = content;
        isUpdatingRef.current = false;
      }
    }
  }));

    useEffect(() => {
    mountedRef.current = true;
    
    if (typeof window === 'undefined' || !editorRef.current) return;

    // Prevent double initialization
    if (quillRef.current) return;

    const currentPlaceholder = placeholder; // Capture current value
    const currentValue = value; // Capture current value
    const currentDisabled = disabled; // Capture current value

    const loadQuill = async () => {
      try {
        // Import Quill
        const { default: Quill } = await import('quill');

        // Check if component is still mounted
        if (!mountedRef.current || !editorRef.current) return;

        // Clear any existing content
        editorRef.current.innerHTML = '';

        // Initialize Quill with minimal toolbar
        quillRef.current = new Quill(editorRef.current, {
          theme: 'snow',
          placeholder: currentPlaceholder,
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link'],
              ['clean']
            ]
          }
        });

        // Handle text changes
        const handleTextChange = () => {
          if (!isUpdatingRef.current && quillRef.current && mountedRef.current) {
            const content = quillRef.current.root.innerHTML;
            onChangeRef.current?.(content);
          }
        };

        quillRef.current.on('text-change', handleTextChange);

        // Set initial content if provided
        if (currentValue && mountedRef.current) {
          isUpdatingRef.current = true;
          quillRef.current.root.innerHTML = currentValue;
          isUpdatingRef.current = false;
        }

        // Handle disabled state
        if (currentDisabled) {
          quillRef.current.enable(false);
        }

        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load Quill:', error);
        setLoadError(true);
      }
    };

    const timeoutId = setTimeout(loadQuill, 100); // Small delay to ensure DOM is ready

    return () => {
      clearTimeout(timeoutId);
      mountedRef.current = false;
      
      if (quillRef.current) {
        try {
          quillRef.current.off('text-change');
        } catch {
          // Ignore cleanup errors
        }
        quillRef.current = null;
      }
    };
  }, [placeholder, value, disabled]); // Include necessary dependencies

  // Update content when value prop changes
  useEffect(() => {
    if (quillRef.current && !isUpdatingRef.current && mountedRef.current) {
      const currentContent = quillRef.current.root.innerHTML;
      if (value !== currentContent) {
        isUpdatingRef.current = true;
        quillRef.current.root.innerHTML = value || '';
        isUpdatingRef.current = false;
      }
    }
  }, [value]);

  // Handle disabled state changes
  useEffect(() => {
    if (quillRef.current && mountedRef.current) {
      quillRef.current.enable(!disabled);
    }
  }, [disabled]);

  if (loadError) {
    return (
      <div 
        className={cn(
          "border border-input rounded-md bg-background p-4",
          className
        )}
        style={{ minHeight }}
      >
        <div className="flex items-center justify-center text-destructive">
          <span>Không thể tải trình soạn thảo. Vui lòng thử lại.</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "border border-input rounded-md bg-background overflow-hidden",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {!isLoaded && (
        <div 
          style={{ minHeight }}
          className="flex items-center justify-center p-4 text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
            <span>Đang tải trình soạn thảo...</span>
          </div>
        </div>
      )}
      
      <div 
        ref={editorRef}
        style={{ 
          minHeight: isLoaded ? minHeight : '0',
          display: isLoaded ? 'block' : 'none'
        }}
        className="quill-wrapper"
      />
    </div>
  );
});

QuillEditor.displayName = 'QuillEditor'; 