import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getImagePath } from '../utils/paths';

const routeStars = [
  { path: '/', label: 'Home', x: 50, y: 18 },
  { path: '/games', label: 'Games', x: 61, y: 29 },
  { path: '/contact', label: 'Contact', x: 54, y: 41 },
  { path: '/events', label: 'Events', x: 66, y: 49 },
  { path: '/learning', label: 'Learning', x: 46, y: 58 },
  { path: '/blog', label: 'Blog', x: 57, y: 67 },
  { path: '/gallery', label: 'Gallery', x: 71, y: 76 },
  { path: '/play', label: 'Player', x: 63, y: 23 },
];

const ambientStars = [
  { x: 14, y: 18, size: 2, delay: 0.1, frequency: 1.35, scrollFactor: 0.018 },
  { x: 20, y: 36, size: 3, delay: 0.8, frequency: 1.9, scrollFactor: 0.012 },
  { x: 29, y: 22, size: 2, delay: 1.4, frequency: 1.1, scrollFactor: 0.02 },
  { x: 26, y: 74, size: 2, delay: 0.4, frequency: 1.65, scrollFactor: 0.016 },
  { x: 37, y: 50, size: 3, delay: 1.2, frequency: 1.25, scrollFactor: 0.014 },
  { x: 43, y: 16, size: 2, delay: 0.6, frequency: 2.05, scrollFactor: 0.022 },
  { x: 47, y: 36, size: 2, delay: 1.8, frequency: 1.45, scrollFactor: 0.013 },
  { x: 55, y: 84, size: 3, delay: 0.3, frequency: 1.75, scrollFactor: 0.017 },
  { x: 62, y: 14, size: 2, delay: 1.1, frequency: 1.15, scrollFactor: 0.021 },
  { x: 69, y: 62, size: 2, delay: 0.5, frequency: 1.85, scrollFactor: 0.015 },
  { x: 78, y: 21, size: 3, delay: 1.5, frequency: 1.3, scrollFactor: 0.019 },
  { x: 84, y: 44, size: 2, delay: 0.9, frequency: 2.2, scrollFactor: 0.011 },
  { x: 82, y: 84, size: 2, delay: 1.7, frequency: 1.55, scrollFactor: 0.018 },
];

const resolveActiveStar = (pathname) => {
  if (pathname.startsWith('/play/')) {
    return routeStars.find((star) => star.path === '/play');
  }

  return routeStars.find((star) => star.path === pathname) || routeStars[0];
};

const ConstellationBackground = () => {
  const location = useLocation();
  const [time, setTime] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [scrollEnergy, setScrollEnergy] = useState(0);
  const energyRef = useRef(0);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();

    const animate = (now) => {
      setTime((now - start) / 1000);
      energyRef.current *= 0.92;
      if (energyRef.current < 0.01) {
        energyRef.current = 0;
      }
      setScrollEnergy(energyRef.current);
      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const nextY = window.scrollY || 0;
      const delta = Math.abs(nextY - lastScrollRef.current);
      lastScrollRef.current = nextY;
      setScrollY(nextY);
      energyRef.current = Math.min(1.6, energyRef.current + delta / 180);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeStar = useMemo(() => resolveActiveStar(location.pathname), [location.pathname]);
  const homeLogoOpacity = Math.max(0, 1 - scrollY / 700);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-space-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(181,159,119,0.12),transparent_24%),radial-gradient(circle_at_22%_30%,rgba(216,217,221,0.08),transparent_18%),radial-gradient(circle_at_76%_72%,rgba(181,159,119,0.08),transparent_18%)]" />

      <div className="absolute left-1/2 top-1/2 h-[94vh] max-h-[1100px] aspect-[1024/1536] -translate-x-1/2 -translate-y-[44%]">
        <img src={getImagePath('/images/centaurus constellation.png')} alt="" className="h-full w-full object-contain opacity-[0.16] mix-blend-screen" />

        {location.pathname === '/' ? (
          <div className="absolute left-[50%] top-[44.5%] aspect-square w-[95%] -translate-x-1/2 -translate-y-1/2" style={{ opacity: homeLogoOpacity }}>
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(181,159,119,0.26),transparent_65%)] blur-2xl" />
            <div className="relative h-full w-full overflow-hidden rounded-full border border-white/15">
              <img src={getImagePath('/images/logo_noback.png')} alt="" className="absolute inset-0 h-full w-full scale-[0.94] object-contain object-center" />
            </div>
          </div>
        ) : null}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:52px_52px] opacity-35" />

      {ambientStars.map((star, index) => {
        const scrollPulse = Math.sin(scrollY * star.scrollFactor + star.delay + index * 0.37);
        const idlePulse = Math.sin(time * star.frequency + star.delay);
        const energyBoost = scrollEnergy * (0.45 + (index % 4) * 0.12);
        const flicker = 0.12 + ((scrollPulse + 1) / 2) * (0.52 + energyBoost) + ((idlePulse + 1) / 2) * 0.14;
        const glow = 0.25 + ((Math.cos(scrollY * (star.scrollFactor * 0.7) + star.delay) + 1) / 2) * (0.85 + energyBoost * 1.4);
        const scale = 0.78 + ((Math.sin(scrollY * (star.scrollFactor * 0.45) + time * 0.5 + star.delay) + 1) / 2) * (0.28 + energyBoost * 0.24);

        return (
          <span
            key={`${star.x}-${star.y}-${index}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size * 4}px`,
              height: `${star.size * 4}px`,
              opacity: Math.min(flicker, 1),
              transform: `scale(${scale})`,
              boxShadow: `0 0 ${12 + glow * 28}px rgba(255,255,255,${0.16 + glow * 0.26})`,
            }}
          />
        );
      })}

      {routeStars.map((star) => {
        const isActive = activeStar?.path === star.path;

        return (
          <div
            key={star.path}
            className="absolute"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              className={`absolute left-1/2 top-1/2 rounded-full border transition-all duration-500 ${isActive
                ? 'h-14 w-14 -translate-x-1/2 -translate-y-1/2 border-accent2/70 bg-accent2/10 shadow-[0_0_28px_rgba(181,159,119,0.22)]'
                : 'h-7 w-7 -translate-x-1/2 -translate-y-1/2 border-white/10'
                }`}
            />
            <div
              className={`relative z-10 rounded-full border ${isActive ? 'border-accent bg-accent2/80' : 'border-white/30 bg-white/75'
                }`}
              style={{ width: isActive ? 11 : 8, height: isActive ? 11 : 8 }}
            />
            {isActive ? (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-accent2/35 bg-ink/80 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-accent2 shadow-lg backdrop-blur md:left-5 md:px-3 md:py-1.5 md:text-[10px] md:tracking-[0.26em]">
                You Are Here / {star.label}
              </div>
            ) : null}
          </div>
        );
      })}

      <div className="absolute inset-y-0 left-1/2 w-[56vw] -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_62%)] opacity-55" />
    </div>
  );
};

export default ConstellationBackground;

























