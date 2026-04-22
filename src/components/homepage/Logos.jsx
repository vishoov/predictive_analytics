import React, { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useInView,
  wrap,
} from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════

const INSTITUTIONS = [
  'Apollo Hospitals',
  'Manipal Health',
  'Fortis Healthcare',
  'Max Healthcare',
  'Medanta',
  'AIIMS Delhi',
  'Kokilaben Hospital',
  'Narayana Health',
  'Aster DM Healthcare',
  'Sir Ganga Ram Hospital',
  'Lilavati Hospital',
  'Columbia Asia',
];

const STATS = [
  { value: '2,000+', label: 'Patient records managed' },
  { value: '98%',    label: 'Report review accuracy'  },
  { value: '4',      label: 'Clinical roles supported' },
  { value: '<1 day', label: 'Average setup time'      },
];

// ═══════════════════════════════════════════════════════════════════
// INFINITE MARQUEE
// ═══════════════════════════════════════════════════════════════════

function InfiniteMarquee({ children, speed = 55, direction = 'left' }) {
  const x = useMotionValue(0);
  const containerRef = useRef(null);
  const isPaused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (isPaused.current) return;
    const moveBy =
      direction === 'left'
        ? -(delta / 1000) * speed
        : (delta / 1000) * speed;
    const containerWidth = containerRef.current?.scrollWidth ?? 0;
    const halfWidth = containerWidth / 2;
    x.set(wrap(-halfWidth, 0, x.get() + moveBy));
  });

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
    >
      <motion.div
        ref={containerRef}
        style={{ x }}
        className="flex gap-4 whitespace-nowrap will-change-transform"
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// INSTITUTION PILL
// ═══════════════════════════════════════════════════════════════════

function InstitutionPill({ name }) {
  return (
    <motion.span
      className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold select-none cursor-default"
      style={{
        background: 'rgba(255,255,255,0.85)',
        border: '1px solid rgba(0,0,0,0.07)',
        color: '#9ca3af',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
      whileHover={{
        scale: 1.06,
        color: '#111827',
        borderColor: 'rgba(129,140,248,0.4)',
        boxShadow: '0 6px 20px rgba(129,140,248,0.15)',
        backgroundColor: '#ffffff',
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* Dot accent */}
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: 'rgba(129,140,248,0.5)' }}
        aria-hidden="true"
      />
      {name}
    </motion.span>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STAT PILL
// ═══════════════════════════════════════════════════════════════════

function StatPill({ value, label, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-1 px-6 py-4 rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.8)',
        border: '1px solid rgba(0,0,0,0.06)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}
    >
      <span
        className="text-2xl font-extrabold tracking-tight"
        style={{ color: '#1a1a2e' }}
      >
        {value}
      </span>
      <span className="text-[11px] font-medium text-gray-400 text-center leading-tight">
        {label}
      </span>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN SECTION
// ═══════════════════════════════════════════════════════════════════

export function TrustedBySection() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 px-4 sm:py-28"
      style={{ backgroundColor: '#F3F6F7' }}
    >
      {/* Background blobs */}
      <div
        className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.5), transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-40 bottom-10 h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(248,113,113,0.4), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="text-center">
          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-300/50 bg-white/70 px-4 py-1.5 text-xs font-semibold text-gray-500 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            Trusted by clinical teams
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Used across leading
            <br />
            <span style={{ color: '#d1d5db' }}>diagnostic institutions.</span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-gray-500"
          >
            Urologists, neurologists, and diagnostic teams rely on UroFlow
            to manage studies, verify reports, and deliver better patient outcomes.
          </motion.p>
        </div>

        {/* ── Stats row ───────────────────────────────────────────── */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((stat, i) => (
            <StatPill key={stat.label} value={stat.value} label={stat.label} index={i} />
          ))}
        </div>

        {/* ── Marquee rows ────────────────────────────────────────── */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="relative mt-14"
        > */}
          {/* Left fade mask */}
          {/* <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28"
            style={{ background: 'linear-gradient(to right, #F3F6F7, transparent)' }}
            aria-hidden="true"
          /> */}
          {/* Right fade mask */}
          {/* <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28"
            style={{ background: 'linear-gradient(to left, #F3F6F7, transparent)' }}
            aria-hidden="true"
          /> */}

          {/* Row 1 — left */}
          {/* <InfiniteMarquee speed={50} direction="left">
            {INSTITUTIONS.map((name) => (
              <InstitutionPill key={name} name={name} />
            ))}
          </InfiniteMarquee> */}

          {/* Row 2 — right */}
          {/* <div className="mt-4">
            <InfiniteMarquee speed={38} direction="right">
              {[...INSTITUTIONS].reverse().map((name) => (
                <InstitutionPill key={name} name={name} />
              ))}
            </InfiniteMarquee>
          </div>
        </motion.div> */}

        {/* ── Bottom trust note ───────────────────────────────────── */}
        {/* <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-10 text-center text-xs text-gray-400"
        >
          Names shown are representative of institution types served.
          UroFlow is HIPAA-aligned and equipment-agnostic.
        </motion.p> */}

      </div>
    </section>
  );
}
