import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import styles from './BookingConfirmation.module.css';
import { motion } from 'framer-motion';

// A simple component to show a loading spinner
const Spinner = () => (
  <div className={styles.spinner}></div>
);

// A component to show a success message
const SuccessDisplay = ({ txRef }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={styles.content}
  >
    <div className={styles.iconSuccess}>✓</div>
    <h1 className={styles.title}>Booking Confirmed!</h1>
    <p className={styles.message}>
      Thank you! Your payment was successful and your reading has been booked.
      You will receive a confirmation email shortly with the next steps.
    </p>
    {txRef && <p className={styles.txRef}>Transaction Reference: {txRef}</p>}
    <Link to="/" className={styles.homeLink}>
      ← Back to Homepage
    </Link>
  </motion.div>
);

// A component to show a failure message
const FailureDisplay = ({ txRef }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={styles.content}
  >
    <div className={styles.iconFailure}>×</div>
    <h1 className={styles.title}>Payment Failed</h1>
    <p className={styles.message}>
      Unfortunately, we couldn't process your payment. Your booking has not been confirmed.
      Please try again, or use a different payment method.
    </p>
    {txRef && <p className={styles.txRef}>Transaction Reference: {txRef}</p>}
    <Link to="/" className={styles.homeLink}>
      ← Back to Homepage
    </Link>
  </motion.div>
);


export default function BookingConfirmation() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(null); // 'success', 'failed', null (pending)
  const [txRef, setTxRef] = useState(null);

  useEffect(() => {
    const paymentStatus = searchParams.get('status');
    const transactionRef = searchParams.get('tx_ref');

    setTxRef(transactionRef);

    // TODO: For production, you MUST verify the transaction status on your backend here
    // by sending the tx_ref to a new serverless function. Relying on the URL parameter
    // alone is not secure.

    if (paymentStatus === 'successful') {
      setStatus('success');
    } else if (paymentStatus === 'cancelled') {
        setStatus('failed');
    }
     else {
      setStatus('failed');
    }
  }, [searchParams]);

  return (
    <div className={styles.container}>
      {status === 'success' && <SuccessDisplay txRef={txRef} />}
      {status === 'failed' && <FailureDisplay txRef={txRef} />}
      {!status && <Spinner />}
    </div>
  );
}
