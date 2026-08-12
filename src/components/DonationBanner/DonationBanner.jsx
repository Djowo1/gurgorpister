import React, { useState } from 'react';
import styles from './DonationBanner.module.css';
import DonationModal from '../DonationModal/DonationModal';

export default function DonationBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={styles.banner}>
        <div className={styles.content}>
          <h2 className={styles.title}>Support Our Work</h2>
          <p className={styles.text}>
            If you appreciate our work and want to contribute, you can send a gift. 
            Every contribution helps us continue our mission.
          </p>
          <button className={styles.ctaButton} onClick={() => setIsModalOpen(true)}>
            Send a Gift
          </button>
        </div>
      </div>
      {isModalOpen && <DonationModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
