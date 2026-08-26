import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import DonationModal from '../DonationModal/DonationModal';
import styles from './DonationPage.module.css';

export default function DonationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Auto-open modal when page loads
    setIsModalOpen(true);
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>Send Money Securely</h1>
            <p className={styles.description}>
              Send money instantly to our account. Fast, secure, and reliable personal transfers powered by Flutterwave.
            </p>
          </div>
        </div>
      </main>
      {isModalOpen && <DonationModal onClose={() => setIsModalOpen(false)} />}
      <Footer />
    </>
  );
}
