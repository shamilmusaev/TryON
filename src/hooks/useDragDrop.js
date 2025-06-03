import { useState, useCallback, useRef } from 'react';

export const useDragDrop = (options = {}) => {
  const {
    onDrop,
    onDragEnter,
    onDragLeave,
    acceptedTypes = ['image/*'],
    multiple = false,
    disabled = false
  } = options;

  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const dragAreaRef = useRef(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;

    setDragCounter(prev => prev + 1);
    
    if (dragCounter === 0) {
      setIsDragOver(true);
      onDragEnter?.(e);
    }
  }, [disabled, dragCounter, onDragEnter]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;

    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragOver(false);
        onDragLeave?.(e);
      }
      return newCounter;
    });
  }, [disabled, onDragLeave]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;

    // Показываем что перетаскивание возможно
    e.dataTransfer.dropEffect = 'copy';
  }, [disabled]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;

    setIsDragOver(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files);
    
    // Фильтруем файлы по типу
    const filteredFiles = files.filter(file => {
      return acceptedTypes.some(type => {
        if (type === '*/*') return true;
        if (type.endsWith('/*')) {
          const baseType = type.replace('/*', '');
          return file.type.startsWith(baseType);
        }
        return file.type === type;
      });
    });

    if (filteredFiles.length === 0) {
      console.warn('No valid files found');
      return;
    }

    // Если multiple = false, берем только первый файл
    const filesToProcess = multiple ? filteredFiles : [filteredFiles[0]];
    
    onDrop?.(filesToProcess);
  }, [disabled, acceptedTypes, multiple, onDrop]);

  const dragProps = {
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
    ref: dragAreaRef
  };

  const reset = useCallback(() => {
    setIsDragOver(false);
    setDragCounter(0);
  }, []);

  return {
    isDragOver,
    dragProps,
    reset
  };
}; 