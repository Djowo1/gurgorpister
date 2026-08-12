import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { readers } from '../../data/readers';
import { tiers } from '../../data/tiers';
import TierCard from './TierCard';
import styles from './ReadingTiers.module.css';

export default function ReadingTiers({ selectedReader, onBooking }) {
  const [activeReader, setActiveReader] = useState(
    selectedReader || readers[0]
  );
  const { ref, isVisible } = useIntersectionObserver();

  // Sync if parent updates selectedReader
  if (selectedReader && selectedReader.id !== activeReader.id) {
    setActiveReader(selectedReader);
  }

  return (
    <section className={styles.section} id="tiers">
      <div className={styles.container}>
        <motion.div
          ref={ref}
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Sessions & Pricing</span>
          <h2 className="section-title" style={{ marginTop: '0.75rem' }}>Choose Your Reading</h2>
          <p className="section-subtitle" style={{ marginTop: '0.75rem' }}>
            Select a reader, then pick the depth that fits what you need right now.
          </p>
        </motion.div>

        {/* Reader tabs */}
        <div className={styles.tabsWrap}>
          <div className={styles.tabs} role="tablist">
            {readers.map(r => (
              <button
                key={r.id}
                role="tab"
                aria-selected={activeReader.id === r.id}
                className={`${styles.tab} ${activeReader.id === r.id ? styles.activeTab : ''}`}
                onClick={() => setActiveReader(r)}
              >
                {r.name.split(' ')[0]}
                {activeReader.id === r.id && (
                  <motion.span className={styles.tabUnderline} layoutId="tabUnderline" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tier cards */}
        <AnimatePresence >
          <motion.div
            key={activeReader.id}
            className={styles.tiersGrid}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            {tiers.map((tier, i) => (
              <TierCard
                key={tier.id}
                tier={tier}
                reader={activeReader}
                index={i}
                onBook={() => onBooking(activeReader, tier)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
