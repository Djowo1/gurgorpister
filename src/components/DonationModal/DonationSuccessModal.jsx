import { motion, AnimatePresence } from 'framer-motion';
import styles from './DonationModal.module.css';

export default function DonationSuccessModal({ onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className={styles.modal}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className={styles.successState}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.title}>Payment Successful!</h2>
            <p className={styles.subtitle}>Your money has been transferred securely.</p>
            <button className={styles.closeSuccessBtn} onClick={onClose}>Done</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
