import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

// ── Trust avatars data ────────────────────────────────────────────────────────

const AVATARS = [
  { bg: 'linear-gradient(135deg,#f87171,#fb923c)', initials: 'SM' },
  { bg: 'linear-gradient(135deg,#818cf8,#6366f1)', initials: 'DR' },
  { bg: 'linear-gradient(135deg,#34d399,#059669)', initials: 'AK' },
  { bg: 'linear-gradient(135deg,#fbbf24,#f59e0b)', initials: 'LP' },
  { bg: 'linear-gradient(135deg,#c084fc,#9333ea)', initials: 'RN' },
];

const TRUST_STATS = [
  { value: '2,000+', label: 'Patient records' },
  { value: '98%',    label: 'Review accuracy' },
  { value: '4',      label: 'Role types supported' },
];

// ── Main section ──────────────────────────────────────────────────────────────

export function CTABannerSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      className="relative overflow-hidden py-24 px-4 sm:py-32"
      style={{ backgroundColor: '#fafafa' }}
      id='request-access'
    >
      {/* ── Background decoration ───────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(129,140,248,0.1) 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, rgba(248,113,113,0.08) 0%, transparent 55%)',
        }}
        aria-hidden="true"
      />

      {/* Floating particles */}
      {[
        { size: 72, top: '10%',  left: '4%',   bg: 'radial-gradient(circle, rgba(248,113,113,0.5), transparent 70%)' },
        { size: 56, top: '70%',  left: '6%',   bg: 'radial-gradient(circle, rgba(251,191,36,0.4), transparent 70%)'  },
        { size: 64, top: '15%',  right: '5%',  bg: 'radial-gradient(circle, rgba(129,140,248,0.5), transparent 70%)' },
        { size: 48, top: '72%',  right: '4%',  bg: 'radial-gradient(circle, rgba(52,211,153,0.4), transparent 70%)'  },
      ].map((p, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-full opacity-60 blur-2xl animate-pulse"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            right: p.right,
            background: p.bg,
            animationDelay: `${i * 0.6}s`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* ── Card ────────────────────────────────────────────────── */}
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] px-8 py-16 text-center sm:px-16"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
          boxShadow: '0 32px 80px -16px rgba(26,26,46,0.5)',
        }}
      >
        {/* Inner glow blobs */}
        <div
          className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.3), transparent 70%)' }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(248,113,113,0.25), transparent 70%)' }}
          aria-hidden="true"
        />

        {/* Eyebrow pill */}
        <motion.div
          variants={fadeIn}
          custom={0}
          className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          <span
            className="h-1.5 w-1.5 animate-pulse rounded-full"
            style={{ background: '#34d399' }}
          />
          Now accepting new diagnostic centers
        </motion.div>

        {/* Heading */}
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Modernise your
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #818cf8, #c084fc, #f87171)',
            }}
          >
            urodynamics workflows.
          </span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mx-auto mt-5 max-w-lg text-sm leading-relaxed sm:text-base"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          Join diagnostic centers already using UroFlow to manage patient
          records, streamline report verification, and surface real-time
          clinical insights — all in one platform.
        </motion.p>

        {/* Avatars + social proof */}
        <motion.div
          variants={fadeUp}
          custom={3}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          {/* Avatar stack */}
          <div className="flex -space-x-2.5" aria-hidden="true">
            {AVATARS.map((av, i) => (
              <div
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2"
                style={{
                  background: av.bg,
                  ringColor: '#1a1a2e',
                  boxShadow: '0 0 0 2px #1a1a2e',
                  zIndex: AVATARS.length - i,
                }}
              >
                {av.initials}
              </div>
            ))}
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Trusted by urology teams across 3 continents
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          custom={4}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <motion.a
            href="/request-demo"
            className="rounded-2xl px-8 py-3.5 text-sm font-bold text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, #818cf8, #6366f1)' }}
            whileHover={{ scale: 1.05, boxShadow: '0 12px 32px rgba(99,102,241,0.5)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Request a demo →
          </motion.a>

          {/* <motion.a
            href="/contact"
            className="rounded-2xl px-8 py-3.5 text-sm font-semibold transition-colors"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.8)',
            }}
            whileHover={{
              background: 'rgba(255,255,255,0.14)',
              scale: 1.03,
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Talk to sales
          </motion.a> */}
        </motion.div>

        {/* Trust stats row */}
        <motion.div
          variants={fadeUp}
          custom={5}
          className="mx-auto mt-12 grid max-w-sm grid-cols-3 gap-4 sm:max-w-none sm:gap-8"
        >
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span
                className="text-xl font-extrabold sm:text-2xl"
                style={{ color: '#ffffff' }}
              >
                {stat.value}
              </span>
              <span
                className="text-[11px] leading-tight text-center"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

      </motion.div>
    </section>
  );
}
