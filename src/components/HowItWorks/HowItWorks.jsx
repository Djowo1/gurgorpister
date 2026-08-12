import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import styles from './HowItWorks.module.css';

const steps = [
  {
    number: '01',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <circle cx="12" cy="13" r="3"/>
        <path d="M9 7h6"/>
        <circle cx="9.5" cy="18.5" r="0.5" fill="currentColor"/>
        <circle cx="12" cy="18.5" r="0.5" fill="currentColor"/>
        <circle cx="14.5" cy="18.5" r="0.5" fill="currentColor"/>
      </svg>
    ),
    title: 'Choose Your Reader',
    description: 'Browse four gifted readers and find the one whose energy resonates. Each brings a different way of seeing. Trust your instinct, it is already telling you something.',
  },
  {
    number: '02',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        <line x1="9" y1="7" x2="15" y2="7"/>
        <line x1="9" y1="11" x2="15" y2="11"/>
        <line x1="9" y1="15" x2="12" y2="15"/>
      </svg>
    ),
    title: 'Select Your Reading',
    description: 'Pick the reading type and depth that fits where you are right now. From a focused single question to a full soul-level reading, four tiers, each with a clear purpose.',
  },
  {
    number: '03',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/>
        <line x1="10" y1="1" x2="10" y2="4"/>
        <line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
    title: 'Pay & Receive Your Truth',
    description: 'Complete your secure payment in your preferred currency. Your reader prepares your reading by hand and delivers it within the agreed time. No algorithms. No automation.',
  },
];

function Step({ step, index }) {
  const { ref, isVisible } = useIntersectionObserver();
  return (
    <motion.div
      ref={ref}
      className={styles.step}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 0.1, 0.36, 1] }}
    >
      <span className={styles.number}>{step.number}</span>
      <div className={styles.iconWrap}>{step.icon}</div>
      <h3 className={styles.stepTitle}>{step.title}</h3>
      <p className={styles.stepDesc}>{step.description}</p>
    </motion.div>
  );
}

export default function HowItWorks() {
  const { ref: titleRef, isVisible: titleVisible } = useIntersectionObserver();

  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.container}>
        <motion.div
          ref={titleRef}
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">The Process</span>
          <h2 className="section-title" style={{ marginTop: '0.75rem' }}>How It Works</h2>
          <p className="section-subtitle" style={{ marginTop: '0.75rem' }}>
            Three steps. One honest reading. Delivered to your inbox.
          </p>
        </motion.div>

        <div className={styles.steps}>
          {steps.map((step, i) => (
            <Step key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
