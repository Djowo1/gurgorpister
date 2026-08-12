import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { faqs } from '../../data/faq';
import FAQItem from './FAQItem';
import styles from './FAQ.module.css';

export default function FAQ() {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <section className={styles.section} id="faq">
      <div className={styles.container}>
        <motion.div
          ref={ref}
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Questions</span>
          <h2 className="section-title" style={{ marginTop: '0.75rem' }}>What People Ask</h2>
        </motion.div>

        <div className={styles.list}>
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <FAQItem faq={faq} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
