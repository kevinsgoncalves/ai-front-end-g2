import { useState, useCallback } from 'react';

export function useDragAndDrop(onFileDrop: (file: File) => void) {
  const [isDragging, setIsDragging] = useState(false);

  const onDragEnter = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFileDrop(files[0]);
      }
    },
    [onFileDrop]
  );

  const dragHandlers = { onDragEnter, onDragLeave, onDragOver, onDrop };

  return { isDragging, dragHandlers };
}
