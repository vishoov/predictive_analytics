import React, { useState } from 'react';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════

const FOOTER_LINKS = [
  {
    heading: 'Product',
    links: [
      { label: 'How it works',  href: '#how-it-works' },
      { label: 'Features',      href: '#features'     },
      { label: 'FAQ',           href: '#faq'          },

    ],
  },
  // {
  //   heading: 'Company',
  //   links: [
  //     { label: 'About us',   href: '#about'   },
  //     { label: 'Contact',    href: '/contact' },
  //     { label: 'Privacy',    href: '/privacy' },
  //     { label: 'Terms',      href: '/terms'   },
  //   ],
  // },
];

const TRUST_BADGES = [
  'HIPAA-aligned',
  'Equipment-agnostic',
  'Role-based access',
];

// ═══════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════

export function Footer() {
  const [email,     setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: '#1a1a2e' }}
    >
      {/* ── Background blobs ─────────────────────────────────── */}
      <div
        className="pointer-events-none absolute -left-40 -top-20 h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.7), transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(248,113,113,0.6), transparent 70%)' }}
        aria-hidden="true"
      />

      {/* ── Main grid ────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">

          {/* ── Brand column ───────────────────────────────── */}
          <div className="md:col-span-2">
            {/* Logo */}
            <a href="/" className="inline-flex items-center gap-2" aria-label="UroFlow home">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C18.25 22.15 22 17.25 22 12V7L12 2z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <span
                className="text-base font-extrabold tracking-tight text-white"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                UroFlow
              </span>
            </a>

            {/* Tagline */}
            <p
              className="mt-5 text-2xl font-extrabold leading-snug tracking-tight text-white"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Diagnostics management
              <br />
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>that feels human.</span>
            </p>

            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Purpose-built for urodynamics centers. Manage patient records,
              verify reports, and surface clinical insights — all in one place.
            </p>

            {/* Contact */}
            <p className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              team@UroFlow.io
            </p>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {TRUST_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full px-3 py-1 text-[11px] font-semibold"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* ── Link columns ───────────────────────────────── */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <p
                className="mb-4 text-[11px] font-bold uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors duration-150"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Newsletter ───────────────────────────────────────── */}
        <div
          className="mt-14 rounded-3xl px-7 py-7 sm:px-10"
          style={{
            background: 'linear-gradient(135deg, rgba(129,140,248,0.1), rgba(248,113,113,0.07))',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p
                className="text-base font-bold text-white"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Stay updated on UroFlow
              </p>
              <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Clinical platform updates, workflow guides, and diagnostic insights.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
                style={{
                  background: 'rgba(52,211,153,0.15)',
                  border: '1px solid rgba(52,211,153,0.25)',
                  color: '#34d399',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                You&apos;re subscribed
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex w-full max-w-sm shrink-0 gap-2"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  aria-label="Email for newsletter"
                  className="flex-1 min-w-0 rounded-2xl px-4 py-2.5 text-sm outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#ffffff',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(129,140,248,0.6)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,140,248,0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <motion.button
                  type="submit"
                  className="shrink-0 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #818cf8, #6366f1)' }}
                  whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(99,102,241,0.4)' }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  aria-label="Subscribe"
                >
                  Subscribe →
                </motion.button>
              </form>
            )}
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────── */}
        <div
          className="mt-10 flex flex-col items-start gap-3 border-t pt-8 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} UroFlow. All rights reserved.
          </p>

          <div className="flex gap-5">
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Contact', href: '/contact' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs transition-colors duration-150"
                style={{ color: 'rgba(255,255,255,0.3)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
