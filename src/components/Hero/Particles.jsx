import React, { useMemo } from 'react';
import styles from './Hero.module.css';

const Particles = ({ count = 20 }) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 3 + 1;
      const style = {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDuration: `${Math.random() * 10 + 5}s`,
        animationDelay: `${Math.random() * 5}s`,
      };
      return <div key={i} className={styles.particle} style={style} />;
    });
  }, [count]);

  return <div className={styles.particles}>{particles}</div>;
};

export default Particles;