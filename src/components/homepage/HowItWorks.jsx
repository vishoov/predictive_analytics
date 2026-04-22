import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ── Icons ─────────────────────────────────────────────────────────────────────

function DashboardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function ReviewIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
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

function LoginIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="19" r="3" />
      <circle cx="18" cy="5" r="3" />
      <path d="M12 19h4.5a3.5 3.5 0 000-7h-8a3.5 3.5 0 010-7H12" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

// ── Use Case Icons (proper JSX — NOT strings) ─────────────────────────────────

function AdminBuildingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22h20" />
      <path d="M17 2H7C4 2 3 3.79 3 6v16h18V6c0-2.21-1-4-4-4z" />
      <path d="M14 15H9.93a.94.94 0 00-.94.94V22H15v-6.06A.94.94 0 0014.06 15z" />
      <line x1="12" y1="6" x2="12" y2="11" />
      <line x1="9.5" y1="8.5" x2="14.5" y2="8.5" />
    </svg>
  );
}

function TechnicianLabIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3v8.5L5.5 18A2 2 0 007.36 21h9.28A2 2 0 0018.5 18L15 11.5V3" />
      <line x1="9" y1="3" x2="15" y2="3" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <circle cx="10.5" cy="16" r="1" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="14" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function UrologistIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="6" r="3" />
      <path d="M9 12c-3 0-6 1.5-6 4.5V21h18v-4.5C21 13.5 18 12 15 12" />
      <path d="M9 12h6" />
      <path d="M14 17l2 2 4-4" />
    </svg>
  );
}

function DirectorChartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <rect x="2" y="20" width="20" height="2" rx="1" />
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    id: 'dashboard',
    icon: <DashboardIcon />,
    tag: 'Live Metrics',
    title: 'Real-Time Clinical Dashboard',
    desc: 'Get an instant pulse on your diagnostic center. Surfaces total patients, tests completed, pending review counts, and study completion rates — the moment you log in.',
    blob: 'radial-gradient(circle at 40% 40%, rgba(248,113,113,0.75), rgba(251,146,60,0.4) 55%, transparent 75%)',
    accent: '#f87171',
    lightBg: 'rgba(248,113,113,0.08)',
  },
  {
    id: 'analytics',
    icon: <AnalyticsIcon />,
    tag: 'Disease Tracking',
    title: 'Diagnostic Statistics & Disease Analytics',
    desc: 'Track per-condition study counts and percentages across your full patient cohort — visualised in real-time charts. Identify trends in bladder outlet obstruction, detrusor overactivity, and more.',
    blob: 'radial-gradient(circle at 40% 40%, rgba(129,140,248,0.75), rgba(167,139,250,0.4) 55%, transparent 75%)',
    accent: '#818cf8',
    lightBg: 'rgba(129,140,248,0.08)',
  },
  {
    id: 'reports',
    icon: <ReportIcon />,
    tag: 'Smart Search',
    title: 'Searchable Report Library',
    desc: 'Every urodynamic study report in one place. Filter by patient, date range, study type, or diagnosis status. From search to full patient report view in under three clicks.',
    blob: 'radial-gradient(circle at 40% 40%, rgba(52,211,153,0.75), rgba(16,185,129,0.4) 55%, transparent 75%)',
    accent: '#34d399',
    lightBg: 'rgba(52,211,153,0.08)',
  },
  {
    id: 'review',
    icon: <ReviewIcon />,
    tag: 'Verification',
    title: 'Structured Review & Verification Workflows',
    desc: 'Never lose a report in review limbo. Organises every pending study by verification status, assignee, and urgency — with full audit trail for radiologists and senior clinicians.',
    blob: 'radial-gradient(circle at 40% 40%, rgba(251,191,36,0.75), rgba(245,158,11,0.4) 55%, transparent 75%)',
    accent: '#fbbf24',
    lightBg: 'rgba(251,191,36,0.08)',
  },
  {
    id: 'access',
    icon: <ShieldIcon />,
    tag: 'Role Control',
    title: 'Secure, Role-Based Access',
    desc: 'Admin users manage the full system while clinical users access only what is relevant to their scope. Protected routes, session-managed auth, and centrally governed access — built in from day one.',
    blob: 'radial-gradient(circle at 40% 40%, rgba(99,102,241,0.75), rgba(139,92,246,0.4) 55%, transparent 75%)',
    accent: '#6366f1',
    lightBg: 'rgba(99,102,241,0.08)',
  },
];

const HOW_IT_WORKS = [
  {
    n: '01',
    icon: <LoginIcon />,
    title: 'Log In & Access Your Role-Specific View',
    desc: "Admins land on the full dashboard. Clinical reviewers go directly to their queue. Every user sees only what they're authorised to act on.",
    blob: 'radial-gradient(circle, rgba(248,113,113,0.5), transparent 70%)',
    accent: '#f87171',
  },
  {
    n: '02',
    icon: <UploadIcon />,
    title: 'Add Patient Studies & Diagnostic Data',
    desc: 'Enter or import urodynamic study results. Attach diagnosis codes, test metadata, and patient demographics — structured and searchable.',
    blob: 'radial-gradient(circle, rgba(129,140,248,0.5), transparent 70%)',
    accent: '#818cf8',
  },
  {
    n: '03',
    icon: <RouteIcon />,
    title: 'Route Reports Through the Review Queue',
    desc: 'Studies flow automatically into the verification pipeline. Reviewers pick up, assess, and approve reports with one click.',
    blob: 'radial-gradient(circle, rgba(52,211,153,0.5), transparent 70%)',
    accent: '#34d399',
  },
  {
    n: '04',
    icon: <TrendIcon />,
    title: 'Analyse Your Diagnostic Performance',
    desc: 'Track disease-level statistics, review completion rates, and patient throughput — all updated live as your team works.',
    blob: 'radial-gradient(circle, rgba(251,191,36,0.5), transparent 70%)',
    accent: '#fbbf24',
  },
];

// ── FIX: icons are now JSX components, not SVG strings ───────────────────────
const USE_CASES = [
  {
    id: 'admins',
    icon: <AdminBuildingIcon />,
    role: 'Diagnostic Center Admins',
    solve: 'Unified patient records, live performance metrics, and full team access management from one dashboard.',
    accent: '#f87171',
    lightBg: 'rgba(248,113,113,0.08)',
    borderColor: 'rgba(248,113,113,0.18)',
    blob: 'radial-gradient(circle at 0% 0%, rgba(248,113,113,0.15), transparent 65%)',
    tags: ['Patient Records', 'Live Metrics', 'Team Access'],
  },
  {
    id: 'technicians',
    icon: <TechnicianLabIcon />,
    role: 'Urodynamics Technicians',
    solve: 'Structured data entry forms, study metadata tracking, and one-click report generation without manual overhead.',
    accent: '#818cf8',
    lightBg: 'rgba(129,140,248,0.08)',
    borderColor: 'rgba(129,140,248,0.18)',
    blob: 'radial-gradient(circle at 0% 0%, rgba(129,140,248,0.15), transparent 65%)',
    tags: ['Data Entry', 'Study Tracking', 'Report Gen'],
  },
  {
    id: 'urologists',
    icon: <UrologistIcon />,
    role: 'Reviewing Urologists',
    solve: 'A clean review queue with full per-study context. Approve, flag, or return reports in seconds with complete audit trail.',
    accent: '#34d399',
    lightBg: 'rgba(52,211,153,0.08)',
    borderColor: 'rgba(52,211,153,0.18)',
    blob: 'radial-gradient(circle at 0% 0%, rgba(52,211,153,0.15), transparent 65%)',
    tags: ['Review Queue', 'Audit Trail', 'Fast Approval'],
  },
  {
    id: 'directors',
    icon: <DirectorChartIcon />,
    role: 'Clinical Directors',
    solve: 'Disease trend analytics, real-time completion rates, and exportable diagnostic statistics to drive informed decisions.',
    accent: '#fbbf24',
    lightBg: 'rgba(251,191,36,0.08)',
    borderColor: 'rgba(251,191,36,0.18)',
    blob: 'radial-gradient(circle at 0% 0%, rgba(251,191,36,0.15), transparent 65%)',
    tags: ['Trend Analytics', 'Completion Rate', 'Export Data'],
  },
];

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
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

function InViewSection({ children, className, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ── Feature card ──────────────────────────────────────────────────────────────

function FeatureCard({ feature, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col rounded-3xl p-7 cursor-default"
      style={{
        background: hovered ? '#ffffff' : 'rgba(255,255,255,0.6)',
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

      {/* Top row */}
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
          {feature.desc}
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

// ── Step row ──────────────────────────────────────────────────────────────────

function StepRow({ step, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      custom={0}
      className={`flex flex-col gap-8 items-center md:gap-16 ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Text */}
      <div className="flex-1 w-full text-left">
        <div className="mb-4 flex items-center gap-3">
          <span
            className="text-xs font-black tracking-widest"
            style={{ color: step.accent }}
          >
            {step.n}
          </span>
          <div className="h-px flex-1 bg-gray-200" aria-hidden="true" />
        </div>
        <h3
          className="text-xl font-bold text-gray-900 leading-snug"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {step.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">{step.desc}</p>
      </div>

      {/* Visual */}
      <div className="flex-1 w-full">
        <motion.div
          className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-3xl"
          style={{ backgroundColor: '#ede8de' }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 250, damping: 22 }}
        >
          <div
            className="absolute inset-0"
            style={{ background: step.blob, filter: 'blur(24px)' }}
            aria-hidden="true"
          />
          <motion.div
            className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md"
            style={{ color: step.accent }}
            whileHover={{ rotate: 6, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {step.icon}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Use case card ─────────────────────────────────────────────────────────────

function UseCaseCard({ uc, index }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
      className="group relative overflow-hidden rounded-3xl p-7"
      style={{
        background: '#ffffff',
        border: `1px solid ${uc.borderColor}`,
        boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 20px 48px -12px ${uc.accent}28`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.04)';
      }}
    >
      {/* Corner blob on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-3xl"
        style={{ background: uc.blob }}
        aria-hidden="true"
      />

      {/* Top row */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: uc.lightBg, color: uc.accent }}
            whileHover={{ rotate: 8, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            {uc.icon}
          </motion.div>
          <h3 className="text-[15px] font-bold text-gray-900 leading-snug">
            {uc.role}
          </h3>
        </div>

        {/* Arrow */}
        <div
          className="mt-1 shrink-0 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1"
          style={{ color: uc.accent }}
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>

      {/* Divider */}
      <div
        className="relative z-10 my-4 h-px w-full"
        style={{ background: `linear-gradient(to right, ${uc.borderColor}, transparent)` }}
        aria-hidden="true"
      />

      {/* Description */}
      <p className="relative z-10 text-sm leading-relaxed text-gray-500">
        {uc.solve}
      </p>

      {/* Tags */}
      <div className="relative z-10 mt-5 flex flex-wrap gap-2">
        {uc.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide"
            style={{ background: uc.lightBg, color: uc.accent }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bottom accent bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] rounded-full"
        style={{ background: `linear-gradient(to right, ${uc.accent}, transparent)` }}
        initial={{ width: '0%' }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function HowItWorksSection() {
  return (
    <>
      {/* ══ FEATURES ══════════════════════════════════════════════════ */}
      <section
      id='how-it-works'
        className="relative overflow-hidden py-24 px-4 sm:py-28"
        style={{ backgroundColor: '#fafafa' }}
      >
        <div
          className="pointer-events-none absolute -left-60 top-0 h-[500px] w-[500px] rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(248,113,113,0.5), transparent 70%)' }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-60 bottom-0 h-[500px] w-[500px] rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.5), transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl">
          <InViewSection className="text-center mb-14">
            <motion.div
              variants={fadeIn}
              custom={0}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-500 shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              Platform capabilities
            </motion.div>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Every tool your urodynamics
              <br />
              <span className="text-gray-300">team needs. One platform.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-5 text-sm sm:text-base text-gray-400 max-w-xl mx-auto"
            >
              Purpose-built for diagnostic centers. Not a generic EHR workaround.
            </motion.p>
          </InViewSection>

          <InViewSection className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={feature.id} feature={feature} index={i} />
            ))}
          </InViewSection>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════════════ */}
      <section
        className="py-24 px-4 sm:py-28"
        style={{ backgroundColor: '#F3F6F7' }}
      >
        <div className="mx-auto max-w-4xl">
          <InViewSection className="text-center mb-20">
            <motion.div
              variants={fadeIn}
              custom={0}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-300/50 bg-white/70 px-4 py-1.5 text-xs font-semibold text-gray-500 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              How it works
            </motion.div>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              From patient intake
              <br />
              to verified report.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-4 text-sm sm:text-base text-gray-500 max-w-md mx-auto"
            >
              UroFlow guides your clinical team through every stage of the
              urodynamic study lifecycle — fully managed.
            </motion.p>
          </InViewSection>

          <div className="flex flex-col gap-20">
            {HOW_IT_WORKS.map((step, i) => (
              <StepRow key={step.n} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ USE CASES ═════════════════════════════════════════════════ */}
      <section
        className="relative py-24 px-4 sm:py-28"
        style={{ backgroundColor: '#fafafa' }}
      >
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-96 opacity-40"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(129,140,248,0.15), transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl">
          <InViewSection className="text-center mb-14">
            <motion.div
              variants={fadeUp}
              custom={0}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-400 shadow-sm"
            >
              <span
                className="h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ background: '#818cf8' }}
              />
              Who it&apos;s for
            </motion.div>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Built for the full
              <br />
              <span style={{ color: '#d1d5db' }}>urodynamics care team.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-4 text-sm sm:text-base text-gray-400 max-w-md mx-auto"
            >
              Every role on your team gets exactly what they need —
              nothing more, nothing less.
            </motion.p>
          </InViewSection>

          <InViewSection className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {USE_CASES.map((uc, i) => (
              <UseCaseCard key={uc.id} uc={uc} index={i} />
            ))}
          </InViewSection>

          {/* CTA Strip */}
          {/* <InViewSection className="mt-12">
            <motion.div
              variants={fadeUp}
              custom={0}
              className="flex flex-col items-center justify-between gap-5 rounded-3xl px-7 py-7 sm:flex-row sm:px-10"
              style={{
                background: 'linear-gradient(135deg, rgba(129,140,248,0.08), rgba(248,113,113,0.06))',
                border: '1px solid rgba(129,140,248,0.15)',
              }}
            >
              <div className="text-left">
                <p
                  className="text-base font-bold text-gray-900"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Not sure which plan fits your team?
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Talk to us — we&apos;ll map UroFlow to your exact clinical workflow.
                </p>
              </div>
              <motion.a
                href="/contact"
                className="shrink-0 rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-md whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #818cf8, #6366f1)' }}
                whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Talk to us →
              </motion.a>
            </motion.div>
          </InViewSection> */}
        </div>
      </section>
    </>
  );
}
