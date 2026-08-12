import { motion, useReducedMotion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import styles from './Hero.module.css';
import { heroContent } from '../../data/heroContent';

const particles = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 90 + 5}%`,
  top: `${Math.random() * 80 + 10}%`,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 6,
  duration: Math.random() * 4 + 5,
}));

export default function Hero({ onBookClick }) {
  const reduce = useReducedMotion();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const cardY = useTransform(scrollYProgress, [0, 1], ['0%', '200%']);

  const [contentIndex, setContentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setContentIndex(prevIndex => (prevIndex + 1) % heroContent.length);
    }, 7000); // Change content every 7 seconds
    return () => clearInterval(interval);
  }, []);

  const currentContent = heroContent[contentIndex];

  const fadeUp = (delay) => reduce ? {} : {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 0.1, 0.36, 1] },
  };

  const textVariant = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.hero} id="home" ref={heroRef}>
      {/* Animated background */}
      <div className={styles.bgLayer} aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          className={styles.videoBackground}
          src="/images/placeholder-video.mp4"
        />
        <div className={styles.videoOverlay} />
        <div className={styles.glow1} />
        <div className={styles.glow2} />
        <div className={styles.glow3} />
        <div className={styles.gridLines} />
      </div>

      {/* Particles */}
      <div className={styles.particles} aria-hidden="true">
        {particles.map(p => (
          <span
            key={p.id}
            className={styles.particle}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Floating tarot card */}
      <motion.div className={styles.floatingCard} style={{ y: cardY }} aria-hidden="true">
        <svg width="64" height="96" viewBox="0 0 64 96" fill="none">
          <rect x="2" y="2" width="60" height="92" rx="6" stroke="#C9A84C" strokeWidth="1.2" fill="rgba(201,168,76,0.03)" />
          <rect x="6" y="6" width="52" height="84" rx="4" stroke="#C9A84C" strokeWidth="0.5" fill="none" opacity="0.4" />
          <ellipse cx="32" cy="44" rx="12" ry="8" stroke="#C9A84C" strokeWidth="1" fill="none" />
          <circle cx="32" cy="44" r="4" fill="#C9A84C" opacity="0.7" />
          <circle cx="32" cy="44" r="1.8" fill="#0A0608" />
          <circle cx="20" cy="18" r="1.5" fill="#C9A84C" opacity="0.5" />
          <circle cx="32" cy="14" r="2" fill="#C9A84C" opacity="0.4" />
          <circle cx="44" cy="18" r="1.5" fill="#C9A84C" opacity="0.5" />
          <circle cx="26" cy="74" r="1.2" fill="#C9A84C" opacity="0.4" />
          <circle cx="32" cy="76" r="1.5" fill="#C9A84C" opacity="0.6" />
          <circle cx="38" cy="74" r="1.2" fill="#C9A84C" opacity="0.4" />
        </svg>
      </motion.div>

      {/* Hero content */}
      <div className={styles.content}>
        <motion.div className={styles.pill} {...fadeUp(0.2)}>
          <span className={styles.pillDot}>✦</span>
          <span>Tarot Reading Service</span>
          <span className={styles.pillDot}>✦</span>
        </motion.div>

        <div className={styles.headline}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentContent.id}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={{
                animate: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              <motion.span
                key={currentContent.id + 'h1'}
                className={styles.headLine1}
                variants={textVariant}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                {currentContent.headline1}
              </motion.span>
              <motion.span
                key={currentContent.id + 'h2'}
                className={styles.headLine2}
                variants={textVariant}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {currentContent.headline2}
              </motion.span>
              <motion.span
                key={currentContent.id + 'h3'}
                className={styles.headLine3}
                variants={textVariant}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {currentContent.headline3}
              </motion.span>
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={currentContent.id + 'sub'}
            className={styles.sub}
            variants={textVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {currentContent.sub.split('\n').map((line, i) => (
              <span key={i} style={{ display: 'block' }}>{line}</span>
            ))}
          </motion.p>
        </AnimatePresence>

        <motion.div className={styles.ctas} {...fadeUp(1.0)}>
          <button className={styles.ctaPrimary} onClick={() => scrollToSection('readers')}>
            Choose Your Reader
          </button>
          <button className={styles.ctaSecondary} onClick={() => scrollToSection('how-it-works')}>
            How It Works
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollIndicator}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      {/* Bottom fade */}
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  );
}
