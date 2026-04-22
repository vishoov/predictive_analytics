import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import RequestDemoButton from './RequestAccess';

// ═══════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut', delay },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, type: 'spring', bounce: 0.35, delay },
  }),
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, type: 'spring', bounce: 0.25, delay },
  }),
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, type: 'spring', bounce: 0.25, delay },
  }),
};

const floatY = (amplitude = 10, duration = 3) => ({
  animate: {
    y: [0, -amplitude, 0],
    transition: { repeat: Infinity, duration, ease: 'easeInOut' },
  },
});

// ═══════════════════════════════════════════════════════════════════
// GRADIENTS & CONFIG
// ═══════════════════════════════════════════════════════════════════

const GRADIENTS = {
  bgWashLeft:  'radial-gradient(circle, rgba(248,113,113,0.6), transparent 70%)',
  bgWashRight: 'radial-gradient(circle, rgba(129,140,248,0.6), transparent 70%)',
  centralGlow:
    'radial-gradient(ellipse at 25% 45%, rgba(129,140,248,0.45) 0%, transparent 55%),' +
    'radial-gradient(ellipse at 75% 40%,  rgba(248,113,113,0.35) 0%, transparent 55%),' +
    'radial-gradient(ellipse at 50% 80%,  rgba(251,191,36,0.30) 0%, transparent 55%)',
  avatarAmber:  'linear-gradient(135deg, #a8c5da, #7a9fb5)',
  avatarDaniel: 'linear-gradient(135deg, #c4a882, #9a7b5a)',
  floatingAvatars: [
    'linear-gradient(135deg, #f87171, #fb923c)',
    'linear-gradient(135deg, #818cf8, #6366f1)',
    'linear-gradient(135deg, #34d399, #059669)',
    'linear-gradient(135deg, #fbbf24, #f59e0b)',
    'linear-gradient(135deg, #c084fc, #9333ea)',
  ],
};

const FLOAT_CONFIGS = [
  { amplitude: 10, duration: 3.2 },
  { amplitude: 8,  duration: 2.8 },
  { amplitude: 12, duration: 3.6 },
  { amplitude: 6,  duration: 2.5 },
  { amplitude: 9,  duration: 4.0 },
];

// ═══════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════

export function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden px-4 pt-10 pb-16 text-center md:pt-24"
      style={{ backgroundColor: '#F3F6F7', minHeight: '760px' }}
    >
      {/* ── Background washes ──────────────────────────────────── */}
      <motion.div
        className="pointer-events-none absolute -left-40 top-1/4 h-72 w-72 rounded-full blur-3xl opacity-40"
        style={{ background: GRADIENTS.bgWashLeft }}
        animate={{ x: [0, 18, 0], y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute -right-40 top-1/3 h-72 w-72 rounded-full blur-3xl opacity-40"
        style={{ background: GRADIENTS.bgWashRight }}
        animate={{ x: [0, -18, 0], y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      {/* ── Eyebrow pill ───────────────────────────────────────── */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={0}
        className="relative z-10 mb-5 inline-flex items-center gap-2 rounded-full border border-gray-300/50 bg-white/70 px-4 py-1.5 text-xs font-semibold text-gray-500 backdrop-blur-sm"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
        Urodynamics diagnosis is complex. Managing it shouldn&apos;t be.
      </motion.div>

      {/* ── Headline ───────────────────────────────────────────── */}
      <motion.h1
        className="relative z-10 mx-auto max-w-4xl text-3xl sm:text-5xl md:text-[56px] font-extrabold tracking-tight leading-tight"
        style={{ color: '#111827', fontFamily: 'Georgia, serif' }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.1}
      >
        Urodynamics Study Management,
        <br />
        <span style={{ color: '#9ca3af' }}>Built for Better Diagnostics.</span>
      </motion.h1>

      {/* ── Subheadline ────────────────────────────────────────── */}
      <motion.p
        className="relative z-10 mt-5 mx-auto max-w-2xl px-2 text-sm sm:text-base text-gray-500 leading-relaxed"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.2}
      >
        UroFlow gives clinical teams a single platform to manage patient
        studies, verify reports, track diagnostic statistics, and control
        team access — with enterprise-grade security and zero spreadsheets.
      </motion.p>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.3}
      >
        <RequestDemoButton />

        {/* Secondary ghost CTA */}
        {/* <motion.a
          href="#how-it-works"
          className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-gray-600 transition-colors hover:text-gray-900"
          style={{
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(0,0,0,0.08)',
            backdropFilter: 'blur(8px)',
          }}
          whileHover={{ scale: 1.03, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          See how it works
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </motion.a> */}
      </motion.div>

      {/* ── Trust micro-line ───────────────────────────────────── */}
      <motion.p
        className="relative z-10 mt-4 text-xs text-gray-400"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={0.45}
      >
        HIPAA-aligned · Equipment-agnostic · Setup in &lt;1 day
      </motion.p>

      {/* ══ DESKTOP SCENE ══════════════════════════════════════════ */}
      <div
        className="relative mx-auto mt-16 hidden w-full max-w-5xl md:block"
        style={{ height: '420px' }}
      >
        {/* Central glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{ background: GRADIENTS.centralGlow, filter: 'blur(40px)' }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          aria-hidden="true"
        />

        {/* Dr. Nalin card */}
        <motion.div
          className="absolute left-[8%] top-[30%] z-20 w-[280px] rounded-3xl bg-white p-6 text-left shadow-xl border border-black/5"
          style={{ boxShadow: '0 20px 48px rgba(0,0,0,0.10)' }}
          variants={slideInLeft}
          initial="hidden"
          animate="visible"
          custom={0.4}
          whileHover={{ y: -4, boxShadow: '0 28px 56px rgba(0,0,0,0.14)' }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 shrink-0 rounded-full"
              style={{ background: GRADIENTS.avatarAmber }}
              aria-label="Dr. Nalin's avatar"
            />
            <div>
              <p className="text-sm font-bold text-gray-900">Dr. Nalin</p>
              <p className="text-[11px] text-gray-400">Urologist, India</p>
            </div>
          </div>
          <div
            className="my-3 h-px w-full"
            style={{ background: 'linear-gradient(to right, rgba(248,113,113,0.2), transparent)' }}
            aria-hidden="true"
          />
          <p className="text-[13px] text-gray-600">
            New patient record indicating{' '}
            <span className="font-semibold text-gray-900">Neurogenic Bladder</span>
          </p>
        </motion.div>

        {/* Daniel card */}
        <motion.div
          className="absolute right-[8%] top-[26%] z-20 w-[280px] rounded-3xl bg-white p-6 text-left shadow-xl border border-black/5"
          style={{ boxShadow: '0 20px 48px rgba(0,0,0,0.10)' }}
          variants={slideInRight}
          initial="hidden"
          animate="visible"
          custom={0.4}
          whileHover={{ y: -4, boxShadow: '0 28px 56px rgba(0,0,0,0.14)' }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 shrink-0 rounded-full"
              style={{ background: GRADIENTS.avatarDaniel }}
              aria-label="Daniel's avatar"
            />
            <div>
              <p className="text-sm font-bold text-gray-900">Daniel</p>
              <p className="text-[11px] text-gray-400">Neurologist, USA</p>
            </div>
          </div>
          <div
            className="my-3 h-px w-full"
            style={{ background: 'linear-gradient(to right, rgba(129,140,248,0.2), transparent)' }}
            aria-hidden="true"
          />
          <p className="text-[13px] text-gray-600">
            Predicted{' '}
            <span className="font-semibold text-gray-900">External Dyssynergia</span>
          </p>
        </motion.div>

        {/* Shared Insights chip */}
        <motion.div
          className="absolute z-20 flex items-center gap-2 rounded-2xl bg-white px-3 py-1.5 border border-black/5"
          style={{
            top: '20.5%', left: '43%',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          custom={0.65}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-900">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-semibold leading-none text-gray-900">Shared Insights</p>
            <p className="text-[11px] text-gray-400">From UK</p>
          </div>
        </motion.div>

        {/* Verified chip */}
        <motion.div
          className="absolute z-20 flex items-center gap-2 rounded-2xl bg-white px-3 py-1.5 border border-black/5"
          style={{
            top: '59%', left: '47%',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          custom={0.8}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-semibold leading-none text-gray-900">Verified</p>
            <p className="text-[11px] text-gray-400">Report approved</p>
          </div>
        </motion.div>

        {/* Floating avatars */}
        {[
          { top: '19%', left: '39%', size: 54 },
          { top: '57%', left: '43%', size: 56 },
          { top: '35%', left: '52%', size: 56 },
          { top: '43%', left: '39%', size: 33 },
          { top: '69%', left: '59%', size: 40 },
        ].map((a, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full ring-2 ring-white"
            style={{
              width: a.size,
              height: a.size,
              top: a.top,
              left: a.left,
              background: GRADIENTS.floatingAvatars[i],
              zIndex: 15,
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            }}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            custom={0.5 + i * 0.1}
          >
            <motion.div
              style={{ width: '100%', height: '100%', borderRadius: '50%' }}
              animate={floatY(FLOAT_CONFIGS[i].amplitude, FLOAT_CONFIGS[i].duration).animate}
            />
          </motion.div>
        ))}

        {/* Arrow badges */}
        {[
          { top: '28%', left: '42%'   },
          { top: '65%', left: '46.5%' },
          { top: '46%', left: '41%'   },
          { top: '75%', left: '61%'   },
          { top: '43%', left: '56%'   },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-gray-900"
            style={{
              top: pos.top,
              left: pos.left,
              zIndex: 25,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            custom={0.7 + i * 0.08}
            whileHover={{ scale: 1.2, rotate: 45 }}
            aria-hidden="true"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* ══ MOBILE STACKED CARDS ═══════════════════════════════════ */}
      <div className="relative mt-16 mb-6 flex flex-col items-center gap-5 px-4 md:hidden">
        {/* Dr. Nalin card */}
        <motion.div
          className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-5 text-left border border-black/5"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          whileHover={{ y: -3 }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-11 w-11 shrink-0 rounded-full"
              style={{ background: GRADIENTS.avatarAmber }}
            />
            <div>
              <p className="text-sm font-bold text-gray-900">Dr. Nalin</p>
              <p className="text-[11px] text-gray-400">Urologist, India</p>
            </div>
          </div>
          <div
            className="my-3 h-px w-full"
            style={{ background: 'linear-gradient(to right, rgba(248,113,113,0.2), transparent)' }}
            aria-hidden="true"
          />
          <p className="text-sm text-gray-600">
            New record indicating{' '}
            <span className="font-semibold text-gray-900">Neurogenic Bladder</span>
          </p>
        </motion.div>

        {/* Shared Insights chip */}
        <motion.div
          className="relative z-10 flex items-center gap-2 self-center rounded-2xl bg-white px-3 py-1.5 border border-black/5"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.07)' }}
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.15}
        >
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-900">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-semibold leading-none text-gray-900">Shared Insights</p>
            <p className="text-[11px] text-gray-400">From UK</p>
          </div>
        </motion.div>

        {/* Verified chip */}
        <motion.div
          className="relative z-10 flex items-center gap-2 self-center rounded-2xl bg-white px-3 py-1.5 border border-black/5"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.07)' }}
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.25}
        >
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-semibold leading-none text-gray-900">Verified</p>
            <p className="text-[11px] text-gray-400">Report approved</p>
          </div>
        </motion.div>

        {/* Daniel card */}
        <motion.div
          className="relative z-10 mb-6 w-full max-w-sm rounded-3xl bg-white p-5 text-left border border-black/5"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.35}
          whileHover={{ y: -3 }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-11 w-11 shrink-0 rounded-full"
              style={{ background: GRADIENTS.avatarDaniel }}
            />
            <div>
              <p className="text-sm font-bold text-gray-900">Daniel</p>
              <p className="text-[11px] text-gray-400">Neurologist, USA</p>
            </div>
          </div>
          <div
            className="my-3 h-px w-full"
            style={{ background: 'linear-gradient(to right, rgba(129,140,248,0.2), transparent)' }}
            aria-hidden="true"
          />
          <p className="text-sm text-gray-600">
            Predicted{' '}
            <span className="font-semibold text-gray-900">External Dyssynergia</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
