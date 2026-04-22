import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features',     href: '#features'     },
  { label: 'FAQ',          href: '#faq'           },
];

export function PublicNav() {
  const [open,      setOpen]      = useState(false);
  const [scrolled,  setScrolled]  = useState(false);

  // Detect scroll to apply blur/shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav
        className="sticky top-0 z-50 w-full px-5 py-3 transition-all duration-300"
        style={{
          backgroundColor: '#ffffff',
          backdropFilter:  'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled
            ? '1px solid rgba(0,0,0,0.07)'
            : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">

          {/* ── Logo ──────────────────────────────────────────── */}
          <a
            href="/"
            className="flex items-center gap-2 select-none"
            aria-label="UroFlow home"
          >
            {/* Logo mark */}
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C18.25 22.15 22 17.25 22 12V7L12 2z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <span
              className="text-base font-extrabold tracking-tight text-gray-900"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              UroFlow
            </span>
          </a>

          {/* ── Desktop nav links ──────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-500 transition-colors duration-150 hover:bg-white/60 hover:text-gray-900"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* ── Desktop actions ────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              Log in
            </a>

            <motion.a
              href="#request-access"
              className="inline-flex items-center gap-1.5 rounded-2xl px-5 py-2 text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 24px rgba(26,26,46,0.30)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              Request access
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </motion.a>
          </div>

          {/* ── Mobile hamburger ───────────────────────────────── */}
          <motion.button
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl text-gray-600"
            style={{

              border: '1px solid rgba(0,0,0,0.07)',
            }}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            whileTap={{ scale: 0.92 }}
          >
            <motion.div
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              {open ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6"  x2="21" y2="6"  />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </motion.div>
          </motion.button>
        </div>
      </nav>

      {/* ══ MOBILE DRAWER ══════════════════════════════════════════ */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 md:hidden"
              style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.div
              className="fixed left-3 right-3 top-[68px] z-50 overflow-hidden rounded-3xl md:hidden"
              style={{
                background: 'rgba(245,240,232,0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
              }}
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,   scale: 1    }}
              exit={{    opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Nav links */}
              <div className="flex flex-col px-4 pt-4 pb-2">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-700 transition-colors hover:bg-white/60 hover:text-gray-900"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </motion.a>
                ))}
              </div>

              {/* Divider */}
              <div className="mx-4 h-px bg-gray-200/70" aria-hidden="true" />

              {/* Auth actions */}
              <div className="flex flex-col gap-2 px-4 py-4">
                <motion.a
                  href="/login"
                  className="flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-white/60 hover:text-gray-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: NAV_LINKS.length * 0.06 + 0.05 }}
                  onClick={() => setOpen(false)}
                >
                  Log in
                </motion.a>

                <motion.a
                  href="/request-access"
                  className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: NAV_LINKS.length * 0.06 + 0.1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setOpen(false)}
                >
                  Request access
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
