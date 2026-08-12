import { motion } from 'framer-motion';
import styles from './Loader.module.css';

const containerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const dotVariants = {
  start: {
    y: '0%',
  },
  end: {
    y: '100%',
  },
};

const dotTransition = {
  duration: 0.5,
  repeat: Infinity,
  repeatType: 'reverse',
  ease: 'easeInOut',
};

export default function Loader() {
  return (
    <div className={styles.loader}>
      <motion.div
        className={styles.dots}
        variants={containerVariants}
        initial="start"
        animate="end"
      >
        <motion.span
          className={styles.dot}
          variants={dotVariants}
          transition={dotTransition}
        />
        <motion.span
          className={styles.dot}
          variants={dotVariants}
          transition={dotTransition}
        />
        <motion.span
          className={styles.dot}
          variants={dotVariants}
          transition={dotTransition}
        />
      </motion.div>
    </div>
  );
}
