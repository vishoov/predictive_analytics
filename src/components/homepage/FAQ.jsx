import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

// ── Data ──────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    id: 1,
    q: 'What is urodynamics study management software?',
    a: 'Urodynamics study management software helps diagnostic centers organise patient records, track study outcomes, route reports through clinical review workflows, and analyse diagnostic trends — replacing manual spreadsheet processes with a structured, role-aware platform.',
  },
  {
    id: 2,
    q: 'Is UroFlow compatible with existing urodynamic equipment?',
    a: 'UroFlow is equipment-agnostic. It manages the data and workflow layer downstream of your urodynamic hardware — whether you use Laborie, Medtronic, Laborie Goby, or any other system. Data can be entered manually or imported via structured file upload.',
  },
  {
    id: 3,
    q: 'How does role-based access work?',
    a: 'UroFlow separates admin and clinical user roles at the routing level. Admins have full access to patient management, analytics, and system settings. Clinical reviewers access only the review queue and relevant patient reports. Access is governed centrally and cannot be overridden client-side.',
  },
  {
    id: 4,
    q: 'Is patient data stored securely?',
    a: 'UroFlow is architected with HIPAA-aligned data handling practices. All API requests are authenticated, session tokens are managed securely, and access control is enforced at both the route and API layer.',
  },
  {
    id: 5,
    q: 'Can I track disease-specific diagnostic trends?',
    a: "Yes. The diagnostics analytics module tracks per-condition study counts and percentage breakdowns across your full patient cohort — updated in real time as new studies are entered and verified.",
  },
  {
    id: 6,
    q: 'Does UroFlow support multiple reviewers and clinics?',
    a: 'Absolutely. The review queue supports multi-user concurrent access, and the role system can be scoped per clinic location. Enterprise plans support unlimited users and multi-site deployments.',
  },
];

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

const answerVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
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

// ── FAQ item ──────────────────────────────────────────────────────────────────

function FAQItem({ faq, index, isOpen, onToggle }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="group"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        {/* Question */}
        <span
          className="text-sm font-semibold leading-snug transition-colors duration-200"
          style={{ color: isOpen ? '#1a1a2e' : '#374151' }}
        >
          {faq.q}
        </span>

        {/* Toggle icon */}
        <motion.div
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
          style={{ background: isOpen ? '#1a1a2e' : 'rgba(0,0,0,0.06)' }}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isOpen ? '#ffffff' : '#6b7280'}
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </motion.div>
      </button>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            variants={answerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <p className="pb-5 pr-10 text-sm leading-relaxed text-gray-500">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider */}
      <div className="h-px w-full bg-gray-200" aria-hidden="true" />
    </motion.div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export function FAQSection() {
  const [openId, setOpenId] = useState(1);

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
    id="faq"
      className="relative overflow-hidden py-24 px-4 sm:py-28"
      style={{ backgroundColor: 'rgb(245, 246, 247)' }}
    >
      {/* Background blobs */}
      <div
        className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.5), transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-40 bottom-20 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(248,113,113,0.4), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">

          {/* ── Left: sticky heading ─────────────────────────────── */}
          <InViewSection className="md:sticky md:top-24 md:self-start">
            <motion.div
              variants={fadeIn}
              custom={0}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-300/50 bg-white/70 px-4 py-1.5 text-xs font-semibold text-gray-500 backdrop-blur-sm"
            >
              <span
                className="h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ background: '#818cf8' }}
              />
              FAQ
            </motion.div>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Frequently
              <br />
              <span className="text-gray-300">asked questions.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-4 text-sm leading-relaxed text-gray-500"
            >
              Can&apos;t find what you&apos;re looking for?{' '}
              <a
                href="/contact"
                className="font-semibold underline underline-offset-2 transition-colors hover:text-gray-900"
                style={{ color: '#818cf8' }}
              >
                Talk to us.
              </a>
            </motion.p>

            {/* Stat pills */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-8 flex flex-col gap-3"
            >
              {[
                { label: 'Avg. setup time', value: '< 1 day' },
                { label: 'Roles supported', value: '4 user types' },
                { label: 'Data residency', value: 'HIPAA-aligned' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between rounded-2xl px-4 py-3"
                  style={{
                    background: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span className="text-xs text-gray-400">{stat.label}</span>
                  <span className="text-xs font-bold text-gray-900">{stat.value}</span>
                </div>
              ))}
            </motion.div>
          </InViewSection>

          {/* ── Right: FAQ list ──────────────────────────────────── */}
          <InViewSection className="md:col-span-2">
            {/* Top divider */}
            <div className="h-px w-full bg-gray-200 mb-0" aria-hidden="true" />

            {FAQS.map((faq, i) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                index={i}
                isOpen={openId === faq.id}
                onToggle={() => handleToggle(faq.id)}
              />
            ))}

            {/* Bottom CTA */}
            <motion.div
              variants={fadeUp}
              custom={FAQS.length}
              className="mt-8 flex flex-col items-start gap-3 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between"
              style={{
                background: 'linear-gradient(135deg, rgba(129,140,248,0.08), rgba(248,113,113,0.06))',
                border: '1px solid rgba(129,140,248,0.15)',
              }}
            >
              <div>
                <p
                  className="text-sm font-bold text-gray-900"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Still have questions?
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  Our team typically responds within one business day.
                </p>
              </div>
              <motion.a
                href="/contact"
                className="shrink-0 rounded-2xl px-5 py-2.5 text-xs font-semibold text-white shadow-sm whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #818cf8, #6366f1)' }}
                whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Contact us →
              </motion.a>
            </motion.div>
          </InViewSection>

        </div>
      </div>
    </section>
  );
}
