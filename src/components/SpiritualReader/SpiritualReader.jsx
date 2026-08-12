import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { spiritualReader } from '../../data/spiritualReader';
import ReaderCard from '../Readers/ReaderCard';
import styles from './SpiritualReader.module.css';

export default function SpiritualReader({ onBooking }) {
  const { ref, isVisible } = useIntersectionObserver();

  const handleSelect = (reader) => {
    const spiritualTier = {
      id: 'spiritual-consultation',
      name: 'Spiritual Consultation',
      priceNumber: reader.price,
    };
    onBooking(reader, spiritualTier);
  };

  return (
    <section className={styles.section} id="spiritual-reader">
      <div className={styles.container}>
        <motion.div
          ref={ref}
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">A Deeper Connection</span>
          <h2 className="section-title" style={{ marginTop: '0.75rem' }}>
            Spiritual Guidance
          </h2>
          <p className="section-subtitle" style={{ marginTop: '0.75rem' }}>
            For when the path is clouded and you need more than just a reading.
          </p>
        </motion.div>

        <div className={styles.grid}>
          <ReaderCard
            key={spiritualReader.id}
            reader={spiritualReader}
            index={0}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </section>
  );
}
