import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { readers } from '../../data/readers';
import ReaderCard from './ReaderCard';
import styles from './Readers.module.css';

export default function Readers({ onSelectReader }) {
  const { ref, isVisible } = useIntersectionObserver();

  const handleSelect = (reader) => {
    onSelectReader(reader);
    setTimeout(() => {
      document.getElementById('tiers')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section className={styles.section} id="readers">
      <div className={styles.container}>
        <motion.div
          ref={ref}
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">The Readers</span>
          <h2 className="section-title" style={{ marginTop: '0.75rem' }}>
            Meet Your Readers
          </h2>
          <p className="section-subtitle" style={{ marginTop: '0.75rem' }}>
            Four voices. One truth. Choose who speaks to you.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {readers.map((reader, i) => (
            <ReaderCard
              key={reader.id}
              reader={reader}
              index={i}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}