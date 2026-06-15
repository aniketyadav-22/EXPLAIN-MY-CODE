import { useMemo } from 'react';

export default function ParticleBackground() {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3 + 0.05,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            background: p.id % 3 === 0
              ? 'rgba(6, 182, 212, 0.6)'
              : p.id % 3 === 1
              ? 'rgba(139, 92, 246, 0.6)'
              : 'rgba(59, 130, 246, 0.6)',
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            filter: `blur(${p.size > 3 ? 1 : 0}px)`,
          }}
        />
      ))}
    </div>
  );
}
