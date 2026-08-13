import { motion } from 'framer-motion';
import { useFlutterwave } from 'flutterwave-react-v3';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import styles from './ReadingTiers.module.css';

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function TierCard({ tier, reader, index, onBook }) {
  const { ref, isVisible } = useIntersectionObserver();

  const handleFlutterwavePayment = useFlutterwave({
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: `${reader.name.split(' ')[0]}-${tier.id}-${Date.now()}`,
    amount: Number(tier.price.replace('$', '')),
    currency: 'USD',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: 'customer@example.com',
      phone_number: '07000000000',
      name: 'John Doe',
    },
    customizations: {
      title: `Echoes & Cards - ${tier.name}`,
      description: `Payment for a ${tier.duration} reading with ${reader.name}`,
      logo: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', // Replace with your logo
    },
  });

  const handlePayment = () => {
    handleFlutterwavePayment({
      callback: (response) => {
        console.log('Flutterwave payment successful', response);
        // Here is where we will call our backend for verification
        // For now, we'll just log the response.
        closePaymentModal(); // this will close the modal programmatically
      },
      onClose: () => {
        console.log('Flutterwave payment modal closed.');
      },
    });
  }

  return (
    <motion.div
      ref={ref}
      className={`${styles.tierCard} ${tier.popular ? styles.popular : ''}`}
      initial={{ opacity: 0, y: 36 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1 }}
    >
      {tier.popular && (
        <span className={styles.popularBadge}>Most Popular</span>
      )}

      <div className={styles.tierTop}>
        <div>
          <span className={styles.tierName}>{tier.name}</span>
          <span className={styles.tierTagline}>{tier.tagline}</span>
        </div>
        <span className={styles.tierPrice}>{tier.price}</span>
      </div>

      <p className={styles.tierDesc}>{tier.description}</p>

      <ul className={styles.features}>
        {tier.features.map(f => (
          <li key={f} className={styles.feature}>
            <span className={styles.check}><CheckIcon /></span>
            {f}
          </li>
        ))}
      </ul>

      <p className={styles.duration}>{tier.duration}</p>

      <button
        className={`${styles.bookBtn} ${tier.popular ? styles.bookBtnPopular : ''}`}
        onClick={onBook}
      >
        Book with {reader?.name?.split(' ')[0]??'Reader'}
      </button>
    </motion.div>
  );
}
