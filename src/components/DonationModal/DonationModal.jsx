import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
import styles from "./DonationModal.module.css";
import DonationSuccessModal from "./DonationSuccessModal";

const CURRENCIES = [
    { code: 'USD', symbol: '$', label: 'USD — US Dollar', multiplier: 1 },
    { code: 'NGN', symbol: '₦', label: 'NGN — Nigerian Naira', multiplier: 1600 },
    { code: 'GBP', symbol: '£', label: 'GBP — British Pound', multiplier: 0.78 },
    { code: 'EUR', symbol: '€', label: 'EUR — Euro', multiplier: 0.92 },
    { code: 'CAD', symbol: 'C$', label: 'CAD — Canadian Dollar', multiplier: 1.36 },
    { code: 'AUD', symbol: 'A$', label: 'AUD — Australian Dollar', multiplier: 1.50 },
    { code: 'JPY', symbol: '¥', label: 'JPY — Japanese Yen', multiplier: 155 },
    { code: 'ZAR', symbol: 'R', label: 'ZAR — South African Rand', multiplier: 18.5 },
    { code: 'KES', symbol: 'KSh', label: 'KES — Kenyan Shilling', multiplier: 130 },
    { code: 'GHS', symbol: 'GH₵', label: 'GHS — Ghanaian Cedi', multiplier: 14.5 },
    { code: 'INR', symbol: '₹', label: 'INR — Indian Rupee', multiplier: 83.5 },
    { code: 'BRL', symbol: 'R$', label: 'BRL — Brazilian Real', multiplier: 5.1 },
    { code: 'MXN', symbol: '$', label: 'MXN — Mexican Peso', multiplier: 16.8 },
    { code: 'SGD', symbol: 'S$', label: 'SGD — Singapore Dollar', multiplier: 1.35 },
    { code: 'NZD', symbol: 'NZ$', label: 'NZD — New Zealand Dollar', multiplier: 1.66 },
];

export default function DonationModal({ onClose }) {
  const [amount, setAmount] = useState(10);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverError, setServerError] = useState('');
  const [step, setStep] = useState('details'); // details | payment | success

  const getAmount = () => {
    const m = currency.multiplier || 1;
    return parseFloat((amount * m).toFixed(2));
  };
  
  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Please enter your name';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Please enter a valid email';
    if (amount <= 0) e.amount = 'Please enter a valid amount';
    return e;
  };

  const handleProceedToPayment = async () => {
    setErrors({});
    setServerError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setStep('payment');
  };

  const flutterwaveConfig = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-YOUR_FLUTTERWAVE_PUBLIC_KEY',
    tx_ref: `EC-GIFT-${Date.now()}`,
    amount: getAmount(),
    currency: currency.code,
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: email,
      name: name,
    },
    customizations: {
      title: 'Echoes and Cards - Gift',
      description: 'A generous gift to support our work.',
    },
    meta: {
        type: 'donation'
    }
  };

  const handleFlutterwaveSuccessAction = (response) => {
      // Payment complete! 
      // You can add logic here to save the donation to your database
      setStep('success');
      closePaymentModal();
  };

  const handleFlutterwaveCloseAction = () => {
      console.log('Payment modal closed by user');
  };

  const componentProps = {
      ...flutterwaveConfig,
      text: `Pay with Flutterwave`,
      callback: handleFlutterwaveSuccessAction,
      onClose: handleFlutterwaveCloseAction,
  };

  if (step === 'success') {
    return <DonationSuccessModal onClose={onClose} name={name} />;
  }

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
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
          
          {step === 'details' && (
            <>
              <div className={styles.header}>
                <h2 className={styles.title}>Send a Gift</h2>
                <p className={styles.subtitle}>Your support is greatly appreciated!</p>
              </div>

              <div className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="amount" className={styles.label}>Amount</label>
                  <div className={styles.amountInput}>
                    <span>{currency.symbol}</span>
                    <input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setAmount(parseFloat(e.target.value));
                        setErrors(p => ({...p, amount: ''}));
                      }}
                      className={errors.amount ? styles.inputError : ''}
                    />
                     <select
                        value={currency.code}
                        onChange={e => setCurrency(CURRENCIES.find(c => c.code === e.target.value))}
                        className={styles.currencySelect}
                    >
                        {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                    </select>
                  </div>
                  {errors.amount && <span className={styles.errorMsg}>{errors.amount}</span>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="name" className={styles.label}>Name</label>
                  <input id="name" type="text" value={name} onChange={(e) => {setName(e.target.value); setErrors(p => ({...p, name: ''}))}}  className={errors.name ? styles.inputError : ''} />
                  {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="email" className={styles.label}>Email</label>
                  <input id="email" type="email" value={email} onChange={(e) => {setEmail(e.target.value); setErrors(p => ({...p, email: ''}))}} className={errors.email ? styles.inputError : ''} />
                  {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
                </div>

                {serverError && <div className={styles.serverErrorMsg}>{serverError}</div>}

                <div className={styles.actions}>
                  <button className={styles.payBtn} onClick={handleProceedToPayment} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 'payment' && (
            <div className={styles.inner}>
              <div className={styles.modalHeader}>
                <span className={styles.modalLabel}>Complete Your Donation</span>
                <h2 className={styles.modalTitle}>Secure Payment</h2>
                <p className={styles.modalSub}>
                  You are donating {currency.symbol}{getAmount().toLocaleString()} {currency.code}
                </p>
              </div>

              <div className={styles.gatewayOptions}>
                <p className={styles.gatewayNote}>
                  Click below to securely complete your donation via Flutterwave.
                </p>
                <div className={styles.paystackWrapper}>
                    <FlutterWaveButton {...componentProps} className={styles.payBtn} />
                </div>
                <button className={styles.backBtn} onClick={() => setStep('details')}>← Back to Details</button>
              </div>
            </div>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

