import { useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import styles from './Readers.module.css';

export default function ReaderCard({ reader, index, onSelect }) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.15 });

  return (
    <motion.article
      ref={ref}
      className={`${styles.card} ${isVisible ? styles.visible : ''}`}
      initial={{ opacity: 0, y: 48 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 0.1, 0.36, 1] }}
    >
      <div className={styles.imageWrap}>
        {reader.video ? (
          <video
            src={reader.video}
            autoPlay
            loop
            muted
            playsInline
            className={styles.image}
          />
        ) : (
          <img
            src={reader.image}
            alt={reader.name}
            className={styles.image}
            loading="lazy"
          />
        )}
        <div className={styles.imageOverlay} />
        <span className={styles.specialty}>{reader.specialty}</span>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.name}>{reader.name}</h3>
        <p className={styles.tagline}>{reader.tagline}</p>

        {reader.isSpiritualReader && (
          <div className={styles.spiritualServices}>
            <h4 className={styles.spiritualServicesTitle}>{reader.consultationTitle}</h4>
            <p>{reader.bio}</p>
            <ul className={styles.servicesList}>
              {reader.services.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
            <p>{reader.closing}</p>
          </div>
        )}

        {reader.isSpiritualReader ? (
          <button
            className={styles.viewBtn}
            onClick={() => onSelect(reader)}
          >
            Book Spiritual Session
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        ) : (
          <button
            className={styles.viewBtn}
            onClick={() => onSelect(reader)}
          >
            View Sessions
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        )}
      </div>
    </motion.article>
  );
}