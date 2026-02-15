import { useMemo } from 'react';

interface StarFieldProps {
  count?: number;
  showShootingStars?: boolean;
}

export default function StarField({ count = 100, showShootingStars = true }: StarFieldProps) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 0.5,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 2,
        opacity: Math.random() * 0.8 + 0.2,
        isIceBlue: Math.random() > 0.6, // More ice blue stars
      })),
    [count]
  );

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Background gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(10, 14, 39, 0.8) 0%, rgba(5, 8, 16, 0.95) 100%)',
        }}
      />

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            backgroundColor: star.isIceBlue ? '#38bdf8' : '#8b5cf6',
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            boxShadow: star.isIceBlue 
              ? '0 0 12px rgba(56, 189, 248, 0.8), 0 0 24px rgba(56, 189, 248, 0.4)' 
              : '0 0 8px rgba(139, 92, 246, 0.6), 0 0 16px rgba(139, 92, 246, 0.3)',
          }}
        />
      ))}

      {/* Shooting stars - Multiple */}
      {showShootingStars && (
        <>
          <div
            className="absolute"
            style={{
              top: '15%',
              right: '10%',
              width: 120,
              height: 2,
              background:
                'linear-gradient(90deg, transparent, #38bdf8, #7dd3fc, transparent)',
              animation: 'shootingStar 10s ease-in-out infinite',
              opacity: 0,
              transform: 'rotate(-35deg)',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.9), 0 0 32px rgba(56, 189, 248, 0.5)',
            }}
          />
          <div
            className="absolute"
            style={{
              top: '60%',
              left: '5%',
              width: 100,
              height: 1.5,
              background:
                'linear-gradient(90deg, transparent, #8b5cf6, #a78bfa, transparent)',
              animation: 'shootingStar 15s ease-in-out 5s infinite',
              opacity: 0,
              transform: 'rotate(-40deg)',
              boxShadow: '0 0 12px rgba(139, 92, 246, 0.8), 0 0 24px rgba(139, 92, 246, 0.4)',
            }}
          />
        </>
      )}

      {/* Nebula clouds - Enhanced */}
      <div
        className="absolute rounded-full blur-[120px] opacity-30"
        style={{
          top: '-10%',
          right: '-5%',
          width: 600,
          height: 600,
          background:
            'radial-gradient(circle, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.08), transparent)',
          animation: 'float 20s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full blur-[120px] opacity-30"
        style={{
          bottom: '-15%',
          left: '-8%',
          width: 700,
          height: 700,
          background:
            'radial-gradient(circle, rgba(56, 189, 248, 0.12), rgba(14, 165, 233, 0.06), transparent)',
          animation: 'float 25s ease-in-out 5s infinite',
        }}
      />
      <div
        className="absolute rounded-full blur-[100px] opacity-20"
        style={{
          top: '40%',
          left: '50%',
          width: 500,
          height: 500,
          background:
            'radial-gradient(circle, rgba(56, 189, 248, 0.1), rgba(99, 102, 241, 0.05), transparent)',
          animation: 'float 30s ease-in-out 10s infinite',
        }}
      />
    </div>
  );
}