import { useState, useCallback, useRef } from 'react';

export const useImageZoom = ({ 
  minZoom = 1, 
  maxZoom = 3, 
  doubleTapZoom = 2 
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const lastTap = useRef(0);
  const lastPinchDistance = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Расчет расстояния между двумя точками касания
  const getDistance = useCallback((touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Сброс зума
  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsZoomed(false);
  }, []);

  // Двойное касание/клик для зума
  const handleDoubleTap = useCallback((e) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTap.current;
    
    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      e.preventDefault();
      
      if (zoom === 1) {
        setZoom(doubleTapZoom);
        setIsZoomed(true);
      } else {
        resetZoom();
      }
    }
    
    lastTap.current = now;
  }, [zoom, doubleTapZoom, resetZoom]);

  // Touch events (existing)
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      lastPinchDistance.current = distance;
    }
  }, [getDistance]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && lastPinchDistance.current) {
      e.preventDefault();
      
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / lastPinchDistance.current;
      
      setZoom(prevZoom => {
        const newZoom = Math.min(Math.max(prevZoom * scale, minZoom), maxZoom);
        setIsZoomed(newZoom > 1);
        return newZoom;
      });
      
      lastPinchDistance.current = currentDistance;
    } else if (e.touches.length === 1 && isZoomed) {
      // Панорамирование при зуме
      e.preventDefault();
      const touch = e.touches[0];
      if (lastMousePos.current.x !== 0) {
        setPan(prevPan => ({
          x: prevPan.x + (touch.clientX - lastMousePos.current.x),
          y: prevPan.y + (touch.clientY - lastMousePos.current.y)
        }));
      }
      lastMousePos.current = { x: touch.clientX, y: touch.clientY };
    }
  }, [getDistance, minZoom, maxZoom, isZoomed]);

  const handleTouchEnd = useCallback((e) => {
    if (e.touches.length === 0) {
      lastPinchDistance.current = null;
      lastMousePos.current = { x: 0, y: 0 };
    }
  }, []);

  // Mouse events (new)
  const handleMouseDown = useCallback((e) => {
    if (isZoomed) {
      setIsDragging(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  }, [isZoomed]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging && isZoomed) {
      e.preventDefault();
      
      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      
      setPan(prevPan => ({
        x: prevPan.x + deltaX,
        y: prevPan.y + deltaY
      }));
      
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  }, [isDragging, isZoomed]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    lastMousePos.current = { x: 0, y: 0 };
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    lastMousePos.current = { x: 0, y: 0 };
  }, []);

  // Mouse wheel для зума
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    
    setZoom(prevZoom => {
      const newZoom = Math.min(Math.max(prevZoom * delta, minZoom), maxZoom);
      setIsZoomed(newZoom > 1);
      
      // Сбрасываем панорамирование если зум вернулся к 1
      if (newZoom === 1) {
        setPan({ x: 0, y: 0 });
      }
      
      return newZoom;
    });
  }, [minZoom, maxZoom]);

  // Programmatic zoom
  const zoomIn = useCallback(() => {
    setZoom(prevZoom => {
      const newZoom = Math.min(prevZoom * 1.5, maxZoom);
      setIsZoomed(newZoom > 1);
      return newZoom;
    });
  }, [maxZoom]);

  const zoomOut = useCallback(() => {
    setZoom(prevZoom => {
      const newZoom = Math.max(prevZoom / 1.5, minZoom);
      setIsZoomed(newZoom > 1);
      if (newZoom === 1) {
        setPan({ x: 0, y: 0 });
      }
      return newZoom;
    });
  }, [minZoom]);

  const zoomHandlers = {
    // Touch events
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    
    // Mouse events
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
    onWheel: handleWheel,
    
    // Click events
    onClick: handleDoubleTap
  };

  const imageTransform = {
    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
    transition: zoom === 1 ? 'transform 0.3s ease-out' : 'none',
    cursor: isZoomed ? (isDragging ? 'grabbing' : 'grab') : 'pointer'
  };

  return {
    zoom,
    pan,
    isZoomed,
    isDragging,
    zoomHandlers,
    imageTransform,
    resetZoom,
    zoomIn,
    zoomOut
  };
}; 