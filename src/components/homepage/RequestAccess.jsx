import { useState, useRef, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";


function isUnsupportedBrowser() {
  const ua = navigator.userAgent;
  return /^((?!chrome|android).)*safari/i.test(ua) || /firefox/i.test(ua);
}

const buttonVariants = {
  initial: { width: 148 },
  expanded: { width: 320 },
};

const iconVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 16, opacity: 1 },
};

export default function RequestDemoButton() {
  const inputRef = useRef(null);
  const isUnsupported = useMemo(() => isUnsupportedBrowser(), []);

  const [expanded, setExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleExpand = () => {
    setExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSubmit = () => {
    if (!email.includes("@")) return;
    setSubmitted(true);
    // TODO: wire up your API call here
    setTimeout(() => {
      setExpanded(false);
      setEmail("");
      setSubmitted(false);
    }, 2500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") {
      setExpanded(false);
      setEmail("");
    }
  };

  return (
    <>
      {/* SVG Gooey Filter — hidden, just needs to exist in DOM */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="goo-demo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          filter: isUnsupported ? "none" : "url(#goo-demo)",
        }}
      >
        {/* Main pill button */}
        <motion.div
          variants={buttonVariants}
          initial="initial"
          animate={expanded ? "expanded" : "initial"}
          transition={{ duration: 0.65, type: "spring", bounce: 0.2 }}
          onClick={!expanded ? handleExpand : undefined}
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            height: 48,
            backgroundColor: "#111827",
            borderRadius: 999,
            cursor: expanded ? "default" : "pointer",
            overflow: "hidden",
            paddingLeft: 20,
            paddingRight: 20,
          }}
          whileHover={!expanded ? { scale: 1.04 } : {}}
          whileTap={!expanded ? { scale: 0.97 } : {}}
        >
          <AnimatePresence mode="wait">
            {!expanded ? (
              /* Label */
              <motion.span
                key="label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Request a Demo
              </motion.span>
            ) : (
              /* Email input */
              <motion.input
                key="input"
                ref={inputRef}
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.25, duration: 0.2 }}
                style={{
                  background: "#161626",
                  border: "none",
                  outline: "none",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 500,
                  width: "100%",
                  caretColor: "white",
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Send button — appears as a separate circle (gooey merges it) */}
        <AnimatePresence>
          {expanded && (
            <motion.button
              key="send"
              onClick={handleSubmit}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={iconVariants}
              transition={{
                delay: 0.1,
                duration: 0.75,
                type: "spring",
                bounce: 0.15,
              }}
              style={{
                position: "relative",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: "50%",
                backgroundColor: submitted ? "#10b981" : "#111827",
                border: "none",
                cursor: "pointer",
                flexShrink: 0,
                transition: "background-color 0.3s ease",
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
            >
              <AnimatePresence mode="wait">
                {!submitted ? (
                  /* Arrow icon */
                  <motion.svg
                    key="arrow"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </motion.svg>
                ) : (
                  /* Checkmark on success */
                  <motion.svg
                    key="check"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
