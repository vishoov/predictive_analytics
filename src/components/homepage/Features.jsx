import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ── Icons ─────────────────────────────────────────────────────────────────────

function LockClosedIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16Z" />
      <circle cx="12" cy="16" r="2" />
      <path d="M6 10V8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8V10" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C18.25 22.15 22 17.25 22 12V7L12 2z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C9.5 2 7.5 3.5 7 5.5C5.5 5.5 4 6.8 4 8.5C4 9.3 4.3 10 4.8 10.5C3.7 11 3 12.2 3 13.5C3 15.4 4.5 17 6.5 17H7V19C7 20.1 7.9 21 9 21H15C16.1 21 17 20.1 17 19V17H17.5C19.5 17 21 15.4 21 13.5C21 12.2 20.3 11 19.2 10.5C19.7 10 20 9.3 20 8.5C20 6.8 18.5 5.5 17 5.5C16.5 3.5 14.5 2 12 2Z" />
      <line x1="12" y1="8" x2="12" y2="14" />
      <line x1="9" y1="11" x2="15" y2="11" />
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    id: 'records',
    icon: <LockClosedIcon />,
    tag: 'Secure Storage',
    title: 'Patient Records',
    description:
      '2,000+ patient records securely stored and instantly available for review and longitudinal analysis.',
    blob: 'radial-gradient(circle at 40% 40%, rgba(248,113,113,0.75), rgba(251,146,60,0.4) 55%, transparent 75%)',
    accent: '#f87171',
    lightBg: 'rgba(248,113,113,0.08)',
  },
  {
    id: 'privacy',
    icon: <ShieldIcon />,
    tag: 'HIPAA Aligned',
    title: 'Data Secrecy',
    description:
      'No patient data is ever shared with third parties. Access is strictly governed and fully auditable.',
    blob: 'radial-gradient(circle at 40% 40%, rgba(129,140,248,0.75), rgba(167,139,250,0.4) 55%, transparent 75%)',
    accent: '#818cf8',
    lightBg: 'rgba(129,140,248,0.08)',
  },
  {
    id: 'insights',
    icon: <BrainIcon />,
    tag: 'AI-Powered',
    title: 'Intelligent Insights',
    description:
      'Signal-first insights help clinical teams spot patterns, refine diagnoses, and personalize treatment plans.',
    blob: 'radial-gradient(circle at 40% 40%, rgba(251,146,60,0.75), rgba(251,191,36,0.4) 55%, transparent 75%)',
    accent: '#fb923c',
    lightBg: 'rgba(251,146,60,0.08)',
  },
];

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

// ── InViewSection ─────────────────────────────────────────────────────────────

function InViewSection({ children, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Feature card ──────────────────────────────────────────────────────────────

function FeatureCard({ feature, index }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col overflow-hidden rounded-3xl p-7 cursor-default"
      style={{
        background: hovered ? feature.lightBg : 'rgba(255,255,255,0.85)',
        border: `1px solid ${hovered ? feature.accent + '40' : 'rgba(0,0,0,0.06)'}`,
        boxShadow: hovered
          ? `0 24px 48px -12px ${feature.accent}30`
          : '0 2px 16px rgba(0,0,0,0.04)',
        backdropFilter: 'blur(12px)',
        transition: 'background 0.4s ease, border 0.4s ease, box-shadow 0.4s ease',
      }}
    >
      {/* Blob */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{ background: feature.blob, filter: 'blur(32px)' }}
        animate={{ opacity: hovered ? 0.2 : 0 }}
        transition={{ duration: 0.4 }}
        aria-hidden="true"
      />

      {/* Top row: icon + tag */}
      <div className="relative z-10 flex items-start justify-between">
        <motion.div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: feature.lightBg, color: feature.accent }}
          animate={{ scale: hovered ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {feature.icon}
        </motion.div>

        <span
          className="rounded-full px-3 py-1 text-[11px] font-semibold"
          style={{ background: feature.lightBg, color: feature.accent }}
        >
          {feature.tag}
        </span>
      </div>

      {/* Text */}
      <div className="relative z-10 mt-5">
        <h3 className="text-[15px] font-bold text-gray-900 leading-snug">
          {feature.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          {feature.description}
        </p>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] rounded-full"
        style={{ background: feature.accent }}
        animate={{ width: hovered ? '100%' : '0%' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />
    </motion.div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export function FeaturesSection() {
  return (
    <section
    id="features"
      className="relative overflow-hidden py-24 px-4 sm:py-28"
      style={{ backgroundColor: '#fafafa' }}
    >
      {/* Background blobs */}
      <div
        className="pointer-events-none absolute -left-60 top-0 h-[500px] w-[500px] rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(248,113,113,0.5), transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-60 bottom-0 h-[500px] w-[500px] rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.5), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <InViewSection className="text-center mb-14">
          <motion.div
            variants={fadeIn}
            custom={0}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-500 shadow-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            Built for urology teams
          </motion.div>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Diagnostics management
            <br />
            <span className="text-gray-300">that feels human.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 text-sm sm:text-base text-gray-400 max-w-xl mx-auto"
          >
            UroFlow combines structured data and clinical insight to help teams
            manage studies, protect patient privacy, and surface the signals
            that actually matter.
          </motion.p>
        </InViewSection>

        {/* Cards */}
        <InViewSection className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.id} feature={feature} index={i} />
          ))}
        </InViewSection>
      </div>
    </section>
  );
}
