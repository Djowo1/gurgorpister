import { useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { testimonials } from '../../data/testimonials';
import styles from './Testimonials.module.css';

const Stars = ({ count }) => (
  <div className={styles.stars} aria-label={`${count} out of 5 stars`}>
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    breakpoints: { '(min-width: 768px)': { slidesToScroll: 1 } },
  });
  const { ref, isVisible } = useIntersectionObserver();

  // Auto-scroll every 4.5s
  const autoScroll = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const timer = setInterval(autoScroll, 5000);
    emblaApi.on('pointerDown', () => clearInterval(timer));
    return () => clearInterval(timer);
  }, [emblaApi, autoScroll]);

  return (
    <section className={styles.section} id="testimonials">
      <div className={styles.container}>
        <motion.div
          ref={ref}
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">What People Say</span>
          <h2 className="section-title" style={{ marginTop: '0.75rem' }}>Voices From the Other Side</h2>
        </motion.div>

        <div className={styles.embla} ref={emblaRef}>
          <div className={styles.emblaContainer}>
            {testimonials.map((t) => (
              <div key={t.id} className={styles.slide}>
                <div className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={styles.quoteGlyph}>"</span>
                    <div className={styles.badge}>
                      <span className={styles.badgeReader}>{t.reader}</span>
                      <span className={styles.badgeTier}>{t.tier}</span>
                    </div>
                  </div>
                  <blockquote className={styles.quote}>{t.quote}</blockquote>
                  <div className={styles.cardBottom}>
                    <Stars count={t.rating} />
                    <div className={styles.author}>
                      <span className={styles.authorName}>{t.name}</span>
                      <span className={styles.authorLocation}>{t.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
