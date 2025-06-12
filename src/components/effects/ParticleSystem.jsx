import React, {
  useEffect,
  useRef,
  useMemo,
  useState,
  useCallback,
} from "react";
import { motion } from "framer-motion";

const ParticleSystem = ({
  count = 20,
  type = "spark",
  intensity = 1.0,
  sourcePosition = { x: 50, y: 50 }, // % from container
  targetPosition = { x: 50, y: 80 }, // % from container
  containerBounds = { width: 400, height: 600 },
  isActive = true,
  className = "",
}) => {
  const [particles, setParticles] = useState([]);
  const animationFrameRef = useRef();
  const lastUpdate = useRef(Date.now());

  // Цвета частиц в зависимости от типа
  const getParticleColor = useCallback((particleType) => {
    const colors = {
      spark: ["#FFD700", "#FFA500", "#FF6347", "#FF1493"],
      glow: ["#00FF88", "#00CC6A", "#4ECDC4", "#45B7D1"],
      connect: ["#8B5CF6", "#A855F7", "#C084FC", "#DDD6FE"],
      float: ["#FFFFFF", "#F3F4F6", "#E5E7EB", "#D1D5DB"],
    };

    const colorSet = colors[particleType] || colors.spark;
    return colorSet[Math.floor(Math.random() * colorSet.length)];
  }, []);

  // Генерация частиц
  const generateParticles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (sourcePosition.x / 100) * containerBounds.width,
      y: (sourcePosition.y / 100) * containerBounds.height,
      targetX: (targetPosition.x / 100) * containerBounds.width,
      targetY: (targetPosition.y / 100) * containerBounds.height,
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      },
      life: Math.random() * 1000 + 500, // 0.5-1.5 seconds
      maxLife: Math.random() * 1000 + 500,
      size: Math.random() * 4 + 2, // 2-6px
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 5,
      color: getParticleColor(type),
      opacity: Math.random() * 0.8 + 0.2,
      trail: type === "connect" ? [] : null,
    }));
  }, [
    count,
    sourcePosition,
    targetPosition,
    containerBounds,
    type,
    getParticleColor,
  ]);

  // Обновление анимации частиц
  const updateParticles = useCallback(() => {
    if (!isActive) return;

    const now = Date.now();
    const deltaTime = now - lastUpdate.current;
    lastUpdate.current = now;

    setParticles((prevParticles) => {
      return prevParticles.map((particle) => {
        const newParticle = { ...particle };

        // Уменьшаем время жизни
        newParticle.life -= deltaTime;

        // Удаляем мертвые частицы и создаем новые
        if (newParticle.life <= 0) {
          const newId = Math.random().toString(36).substr(2, 9);
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 2 + 1;

          return {
            id: newId,
            x:
              (sourcePosition.x / 100) * containerBounds.width +
              (Math.random() - 0.5) * 40,
            y:
              (sourcePosition.y / 100) * containerBounds.height +
              (Math.random() - 0.5) * 40,
            targetX:
              (targetPosition.x / 100) * containerBounds.width +
              (Math.random() - 0.5) * 60,
            targetY:
              (targetPosition.y / 100) * containerBounds.height +
              (Math.random() - 0.5) * 60,
            velocity: {
              x: Math.cos(angle) * speed,
              y: Math.sin(angle) * speed,
            },
            size: Math.random() * 3 + 1,
            life: Math.random() * 3000 + 2000,
            maxLife: Math.random() * 3000 + 2000,
            color: getParticleColor(type),
            opacity: 1,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 4,
            trail: type === "connect" ? [] : null,
          };
        }

        // Обновляем позицию в зависимости от типа
        switch (type) {
          case "connect":
            // Движение к цели с trail эффектом
            const progress = 1 - newParticle.life / newParticle.maxLife;
            const progressToTarget = Math.min(progress * 1.5, 1);

            newParticle.x =
              particle.x + (particle.targetX - particle.x) * progressToTarget;
            newParticle.y =
              particle.y + (particle.targetY - particle.y) * progressToTarget;

            // Добавляем точку в trail
            if (newParticle.trail) {
              newParticle.trail.push({ x: newParticle.x, y: newParticle.y });
              if (newParticle.trail.length > 10) {
                newParticle.trail.shift();
              }
            }
            break;

          case "float":
            // Плавающее движение
            newParticle.x += Math.sin(now * 0.001 + particle.id) * 0.5;
            newParticle.y += Math.cos(now * 0.0015 + particle.id) * 0.3;
            break;

          case "spark":
          case "glow":
          default:
            // Хаотичное движение с замедлением
            newParticle.velocity.x *= 0.98;
            newParticle.velocity.y *= 0.98;
            newParticle.x += newParticle.velocity.x * intensity;
            newParticle.y += newParticle.velocity.y * intensity;
            break;
        }

        // Обновляем вращение
        newParticle.rotation += newParticle.rotationSpeed;

        // Обновляем прозрачность
        const lifeRatio = newParticle.life / newParticle.maxLife;
        newParticle.opacity = Math.sin(lifeRatio * Math.PI) * 0.8 + 0.2;

        return newParticle;
      });
    });

    if (isActive) {
      animationFrameRef.current = requestAnimationFrame(updateParticles);
    }
  }, [
    isActive,
    intensity,
    type,
    sourcePosition,
    targetPosition,
    containerBounds,
    getParticleColor,
  ]);

  // Запуск анимации
  useEffect(() => {
    if (isActive) {
      setParticles(generateParticles);
      lastUpdate.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(updateParticles);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, generateParticles, updateParticles]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!isActive) return null;

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        width: containerBounds.width,
        height: containerBounds.height,
      }}
    >
      <svg
        className="absolute inset-0"
        width="100%"
        height="100%"
        viewBox={`0 0 ${containerBounds.width} ${containerBounds.height}`}
      >
        <defs>
          {/* Гlow фильтр */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />

            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Spark фильтр */}
          <filter id="spark">
            <feGaussianBlur stdDeviation="1" result="softBlur" />

            <feMerge>
              <feMergeNode in="softBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {particles.map((particle) => {
          const ParticleComponent = () => {
            switch (type) {
              case "connect":
                return (
                  <g key={particle.id}>
                    {/* Trail линия */}
                    {particle.trail && particle.trail.length > 1 && (
                      <path
                        d={`M ${particle.trail.map((p) => `${p.x},${p.y}`).join(" L ")}`}
                        stroke={particle.color}
                        strokeWidth="1"
                        fill="none"
                        opacity={particle.opacity * 0.5}
                        filter="url(#glow)"
                      />
                    )}

                    {/* Основная частица */}
                    <circle
                      cx={particle.x}
                      cy={particle.y}
                      r={particle.size}
                      fill={particle.color}
                      opacity={particle.opacity}
                      filter="url(#glow)"
                    />
                  </g>
                );

              case "spark":
                return (
                  <g key={particle.id}>
                    <polygon
                      points={`${particle.x},${particle.y - particle.size} ${particle.x + particle.size * 0.5},${particle.y + particle.size * 0.5} ${particle.x - particle.size * 0.5},${particle.y + particle.size * 0.5}`}
                      fill={particle.color}
                      opacity={particle.opacity}
                      transform={`rotate(${particle.rotation} ${particle.x} ${particle.y})`}
                      filter="url(#spark)"
                    />
                  </g>
                );

              case "glow":
              case "float":
              default:
                return (
                  <circle
                    key={particle.id}
                    cx={particle.x}
                    cy={particle.y}
                    r={particle.size}
                    fill={particle.color}
                    opacity={particle.opacity}
                    filter="url(#glow)"
                  />
                );
            }
          };

          return <ParticleComponent key={particle.id} />;
        })}
      </svg>

      {/* CSS-based particles для лучшей производительности на некоторых устройствах */}
      <div className="absolute inset-0">
        {type === "float" &&
          particles.slice(0, 5).map((particle) => (
            <motion.div
              key={`css-${particle.id}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
                left: particle.x,
                top: particle.y,
              }}
              animate={{
                x: [0, 20, -10, 15, 0],
                y: [0, -15, 10, -5, 0],
                scale: [1, 1.2, 0.8, 1.1, 1],
                opacity: [0.8, 1, 0.6, 0.9, 0.8],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.id * 0.2,
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default ParticleSystem;
