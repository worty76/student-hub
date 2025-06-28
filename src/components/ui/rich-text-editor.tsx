'use client';

import React, { useRef, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Mô tả sản phẩm của bạn...',
  disabled = false,
  className,
  minHeight = '150px'
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('insertUnorderedList')) formats.add('unordered');
    if (document.queryCommandState('insertOrderedList')) formats.add('ordered');
    
    if (document.queryCommandState('justifyLeft')) formats.add('align-left');
    if (document.queryCommandState('justifyCenter')) formats.add('align-center');
    if (document.queryCommandState('justifyRight')) formats.add('align-right');
    
    setActiveFormats(formats);
  }, []);

  const execCommand = useCallback((command: string, value?: string) => {
    if (disabled) return;
    
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    
    // Update active formats
    updateActiveFormats();
    
    // Trigger onChange
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  }, [disabled, onChange, updateActiveFormats]);

  const handleInput = useCallback(() => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
    updateActiveFormats();
  }, [onChange, updateActiveFormats]);

  const handleKeyUp = useCallback(() => {
    updateActiveFormats();
  }, [updateActiveFormats]);

  const handleMouseUp = useCallback(() => {
    updateActiveFormats();
  }, [updateActiveFormats]);

  const isFormatActive = (format: string) => activeFormats.has(format);

  return (
    <div className={cn(
      "border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20 transition-all duration-200",
      disabled && "opacity-50 cursor-not-allowed bg-gray-50",
      className
    )}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => execCommand('bold')}
            className={cn(
              "h-8 w-8 p-0 hover:bg-blue-100",
              isFormatActive('bold') && "bg-blue-100 text-blue-700"
            )}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => execCommand('italic')}
            className={cn(
              "h-8 w-8 p-0 hover:bg-blue-100",
              isFormatActive('italic') && "bg-blue-100 text-blue-700"
            )}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => execCommand('underline')}
            className={cn(
              "h-8 w-8 p-0 hover:bg-blue-100",
              isFormatActive('underline') && "bg-blue-100 text-blue-700"
            )}
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => execCommand('insertUnorderedList')}
            className={cn(
              "h-8 w-8 p-0 hover:bg-blue-100",
              isFormatActive('unordered') && "bg-blue-100 text-blue-700"
            )}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => execCommand('insertOrderedList')}
            className={cn(
              "h-8 w-8 p-0 hover:bg-blue-100",
              isFormatActive('ordered') && "bg-blue-100 text-blue-700"
            )}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => execCommand('justifyLeft')}
            className={cn(
              "h-8 w-8 p-0 hover:bg-blue-100",
              isFormatActive('align-left') && "bg-blue-100 text-blue-700"
            )}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => execCommand('justifyCenter')}
            className={cn(
              "h-8 w-8 p-0 hover:bg-blue-100",
              isFormatActive('align-center') && "bg-blue-100 text-blue-700"
            )}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => execCommand('justifyRight')}
            className={cn(
              "h-8 w-8 p-0 hover:bg-blue-100",
              isFormatActive('align-right') && "bg-blue-100 text-blue-700"
            )}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => {
              const url = prompt('Nhập URL:');
              if (url) {
                execCommand('createLink', url);
              }
            }}
            className="h-8 w-8 p-0 hover:bg-blue-100"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => execCommand('removeFormat')}
            className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
          >
            <Type className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleInput}
          onKeyUp={handleKeyUp}
          onMouseUp={handleMouseUp}
          className={cn(
            "p-4 min-h-[150px] outline-none prose max-w-none",
            "focus:ring-0 focus:outline-none",
            disabled && "cursor-not-allowed"
          )}
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: value }}
          suppressContentEditableWarning
        />
        
        {!value && !disabled && (
          <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
        
        <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded shadow">
          {value ? value.replace(/<[^>]*>/g, '').length : 0}/1000
        </div>
      </div>
    </div>
  );
} 