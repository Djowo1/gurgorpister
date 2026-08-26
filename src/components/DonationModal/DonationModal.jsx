import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
import styles from "./DonationModal.module.css";
import DonationSuccessModal from "./DonationSuccessModal.jsx";

const CURRENCIES = [
    { code: 'USD', symbol: '$', label: 'USD — US Dollar' },
    { code: 'NGN', symbol: '₦', label: 'NGN — Nigerian Naira' },
    { code: 'GBP', symbol: '£', label: 'GBP — British Pound' },
    { code: 'EUR', symbol: '€', label: 'EUR — Euro' },
    { code: 'CAD', symbol: 'C$', label: 'CAD — Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', label: 'AUD — Australian Dollar' },
    { code: 'JPY', symbol: '¥', label: 'JPY — Japanese Yen' },
    { code: 'ZAR', symbol: 'R', label: 'ZAR — South African Rand' },
    { code: 'KES', symbol: 'KSh', label: 'KES — Kenyan Shilling' },
    { code: 'GHS', symbol: 'GH₵', label: 'GHS — Ghanaian Cedi' },
    { code: 'INR', symbol: '₹', label: 'INR — Indian Rupee' },
    { code: 'BRL', symbol: 'R$', label: 'BRL — Brazilian Real' },
    { code: 'MXN', symbol: '$', label: 'MXN — Mexican Peso' },
    { code: 'SGD', symbol: 'S$', label: 'SGD — Singapore Dollar' },
    { code: 'NZD', symbol: 'NZ$', label: 'NZD — New Zealand Dollar' },
];

export default function DonationModal({ onClose }) {
  const [amount, setAmount] = useState(10);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [contactMethod, setContactMethod] = useState('email');
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverError, setServerError] = useState('');
  const [step, setStep] = useState('details'); // details | payment | success

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
    amount: amount,
    currency: currency.code,
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: email,
      name: name,
      phonenumber: phone,
    },
    customizations: {
      title: 'Echoes and Cards - Gift',
      description: 'A generous gift to support our work.',
    },
    meta: {
        type: 'donation',
        message: message,
        contactMethod: contactMethod,
    }
  };

  const handleFlutterwaveSuccessAction = (response) => {
      // Payment complete! 
      // You can add logic here to save the transaction to your database
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
                <h2 className={styles.title}>Send Money Securely</h2>
                <p className={styles.subtitle}>Fast and secure payment processing via Flutterwave</p>
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

                <div className={styles.field}>
                  <label htmlFor="phone" className={styles.label}>Phone Number (Optional)</label>
                  <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g., +1 234 567 890" />
                </div>

                <div className={styles.field}>
                  <label htmlFor="message" className={styles.label}>Short Message (Optional)</label>
                  <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} className={styles.textarea} rows="3" placeholder="Leave a kind word..."></textarea>
                </div>

                <div className={styles.field}>
                  <label htmlFor="contactMethod" className={styles.label}>Preferred Contact Method</label>
                  <select id="contactMethod" value={contactMethod} onChange={(e) => setContactMethod(e.target.value)} className={styles.select}>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </select>
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
                <span className={styles.modalLabel}>Complete Your Payment</span>
                <h2 className={styles.modalTitle}>Secure Payment</h2>
                <p className={styles.modalSub}>
                  You are sending {currency.symbol}{amount.toLocaleString()} {currency.code}
                </p>
              </div>

              <div className={styles.gatewayOptions}>
                <p className={styles.gatewayNote}>
                  Click below to securely complete your payment via Flutterwave.
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
