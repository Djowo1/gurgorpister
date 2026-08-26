import React, { useState } from 'react';
import styles from './DonationBanner.module.css';
import DonationModal from '../DonationModal/DonationModal';

export default function DonationBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleCopyLink = () => {
    const paymentUrl = `${window.location.origin}/pay`;
    navigator.clipboard.writeText(paymentUrl).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  return (
    <>
      <div className={styles.banner}>
        <div className={styles.content}>
          <h2 className={styles.title}>Send Money Securely</h2>
          <p className={styles.text}>
            Send money instantly and securely to our account. Fast, reliable, and easy personal transfers.
          </p>
          <div className={styles.buttonGroup}>
            <button className={styles.ctaButton} onClick={() => setIsModalOpen(true)}>
              Send Money
            </button>
            <button className={styles.copyButton} onClick={handleCopyLink} title="Copy payment link">
              {copyFeedback ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && <DonationModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
