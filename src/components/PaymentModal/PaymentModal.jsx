import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
import Calendar from '../Calendar/Calendar';
import { createPendingBooking, updateBookingStatus } from '../../services/bookingService';
import styles from './PaymentModal.module.css';

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

export default function PaymentModal({ reader, tier, onClose }) {
  const [step, setStep] = useState('schedule'); // 'schedule' | 'details' | 'payment' | 'success'
  
  // Schedule state
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  
  // Details state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Payment state
  const [bookingId, setBookingId] = useState(null);

  const getAmount = () => {
    const m = currency.multiplier || 1;
    return parseFloat((tier.priceNumber * m).toFixed(2));
  };

  const handleDateTimeSelect = (dateTime) => {
    setSelectedDateTime(dateTime);
  };

  const handleProceedToDetails = () => {
    if (!selectedDateTime) return;
    setStep('details');
  };

  const validateDetails = () => {
    const e = {};
    if (!name.trim()) e.name = 'Please enter your name';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Please enter a valid email';
    if (!phone.trim()) e.phone = 'Please enter your phone number';
    if (!country.trim()) e.country = 'Please enter your country';
    if (!address.trim()) e.address = 'Please enter your address';
    return e;
  };

  const handleProceedToPayment = async () => {
    const e = validateDetails();
    if (Object.keys(e).length) { setErrors(e); return; }
    
    setIsSaving(true);
    try {
        // Save pending booking to Firebase
        const id = await createPendingBooking({
            readerName: reader.name,
            tierName: tier.name,
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            customerCountry: country,
            customerAddress: address,
            message: message,
            scheduledDate: selectedDateTime.date.toISOString(),
            scheduledTime: selectedDateTime.time,
            amount: getAmount(),
            currency: currency.code
        });
        setBookingId(id);
        setStep('payment');
    } catch (err) {
        console.error("Firebase booking error:", err);
        alert("Failed to initiate booking. Please try again. Check console for details.");
    } finally {
        setIsSaving(false);
    }
  };

  const flutterwaveConfig = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-YOUR_FLUTTERWAVE_PUBLIC_KEY',
    tx_ref: `EC-${Date.now()}`,
    amount: getAmount(), 
    currency: currency.code, 
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: email,
      phone_number: phone,
      name: name,
    },
    customizations: {
      title: 'Echoes and Cards',
      description: `Payment for ${tier.name}`,
    },
    meta: {
      country: country,
      address: address,
      bookingDate: `${selectedDateTime?.date.toLocaleDateString()} at ${selectedDateTime?.time}`,
      tier: tier.name
    }
  };

  const handleFlutterwaveSuccessAction = (response) => {
      // Payment complete! Update firebase
      updateBookingStatus(bookingId, 'completed', response.transaction_id || response.tx_ref).then(() => {
          setStep('success');
          closePaymentModal();
      }).catch(err => {
          console.error("Failed to update status, but payment was successful.", err);
          setStep('success'); // Still show success to user
          closePaymentModal();
      });
  };

  const handleFlutterwaveCloseAction = () => {
      // User closed the modal without completing payment
      console.log('Payment modal closed');
  };

  const componentProps = {
      ...flutterwaveConfig,
      text: `Pay with Flutterwave`,
      callback: handleFlutterwaveSuccessAction,
      onClose: handleFlutterwaveCloseAction,
  };

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
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.22, 0.1, 0.36, 1] }}
        >
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {step === 'schedule' && (
              <div className={styles.inner}>
                <div className={styles.modalHeader}>
                    <span className={styles.modalLabel}>Step 1 of 3</span>
                    <h2 className={styles.modalTitle}>Choose Date & Time</h2>
                    <p className={styles.modalSub}>
                    {tier.name} with <strong>{reader.name}</strong>
                    </p>
                </div>
                
                <div className={styles.scheduleWrapper}>
                    <Calendar onDateTimeSelect={handleDateTimeSelect} />
                </div>

                <div className={styles.footerActions}>
                    <button 
                        className={styles.proceedBtn} 
                        onClick={handleProceedToDetails}
                        disabled={!selectedDateTime}
                        style={{ opacity: !selectedDateTime ? 0.5 : 1, cursor: !selectedDateTime ? 'not-allowed' : 'pointer' }}
                    >
                        Continue to Details
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>
              </div>
          )}

          {step === 'details' && (
            <div className={styles.inner}>
              <div className={styles.modalHeader}>
                <span className={styles.modalLabel}>Step 2 of 3</span>
                <h2 className={styles.modalTitle}>Your Details</h2>
                <p className={styles.modalSub}>
                  For {selectedDateTime?.date.toLocaleDateString()} at {selectedDateTime?.time}
                </p>
              </div>

              <div className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="customerName" className={styles.label}>Your Name</label>
                  <input
                    id="customerName"
                    name="customerName"
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                  />
                  {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="customerEmail" className={styles.label}>Email Address</label>
                  <input
                    id="customerEmail"
                    name="customerEmail"
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                  />
                  {errors.email && <span className={styles.errMsg}>{errors.email}</span>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="customerPhone" className={styles.label}>Phone Number</label>
                  <input
                    id="customerPhone"
                    name="customerPhone"
                    className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={phone}
                    onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: '' })); }}
                  />
                  {errors.phone && <span className={styles.errMsg}>{errors.phone}</span>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="customerCountry" className={styles.label}>Country</label>
                  <input
                    id="customerCountry"
                    name="customerCountry"
                    className={`${styles.input} ${errors.country ? styles.inputError : ''}`}
                    type="text"
                    placeholder="e.g. United States"
                    value={country}
                    onChange={e => { setCountry(e.target.value); setErrors(p => ({ ...p, country: '' })); }}
                  />
                  {errors.country && <span className={styles.errMsg}>{errors.country}</span>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="customerAddress" className={styles.label}>Full Address</label>
                  <input
                    id="customerAddress"
                    name="customerAddress"
                    className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
                    type="text"
                    placeholder="Street, City, Zip Code"
                    value={address}
                    onChange={e => { setAddress(e.target.value); setErrors(p => ({ ...p, address: '' })); }}
                  />
                  {errors.address && <span className={styles.errMsg}>{errors.address}</span>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="currencySelect" className={styles.label}>Currency</label>
                  <select
                    id="currencySelect"
                    name="currencySelect"
                    className={styles.select}
                    value={currency.code}
                    onChange={e => setCurrency(CURRENCIES.find(c => c.code === e.target.value))}
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                  <span className={styles.amountNote}>
                    You pay: {currency.symbol}{getAmount().toLocaleString()} {currency.code}
                    <br/>
                    <small style={{ fontWeight: 'normal', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block'}}>
                      (Processed natively in {currency.code})
                    </small>
                  </span>
                </div>

                <div className={styles.field}>
                  <label htmlFor="customerMessage" className={styles.label}>Message to {reader.name.split(' ')[0]} <span className={styles.optional}>(optional)</span></label>
                  <textarea
                    id="customerMessage"
                    name="customerMessage"
                    className={styles.textarea}
                    placeholder="Share your main question or any context you want them to know..."
                    value={message}
                    onChange={e => setMessage(e.target.value.slice(0, 300))}
                    rows={3}
                  />
                  <span className={styles.charCount}>{message.length}/300</span>
                </div>
              </div>

              <div className={styles.footerActionsDouble}>
                  <button className={styles.backBtn} onClick={() => setStep('schedule')}>← Back</button>
                  <button className={styles.proceedBtn} onClick={handleProceedToPayment} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Proceed to Payment'}
                  </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className={styles.inner}>
              <div className={styles.modalHeader}>
                <span className={styles.modalLabel}>Step 3 of 3</span>
                <h2 className={styles.modalTitle}>Complete Payment</h2>
                <p className={styles.modalSub}>
                  {tier.name} with {reader.name} — {currency.symbol}{getAmount().toLocaleString()} {currency.code}
                </p>
              </div>

              <div className={styles.gatewayOptions}>
                <div className={styles.gatewayInfo}>
                  <p className={styles.gatewayNote}>
                    Your booking details are safely saved. Click below to securely complete your payment via Flutterwave.
                  </p>
                </div>
                
                <div className={styles.paystackWrapper}>
                    <FlutterWaveButton {...componentProps} className={styles.payBtn} />
                </div>
                
                <button className={styles.backBtn} onClick={() => setStep('details')}>← Back to Details</button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <motion.div
              className={`${styles.inner} ${styles.success}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className={styles.successIcon}>✦</div>
              <h2 className={styles.successTitle}>Reading Confirmed</h2>
              <p className={styles.successText}>
                Your <strong>{tier.name}</strong> session with <strong>{reader.name}</strong> is booked for <strong>{selectedDateTime?.date.toLocaleDateString()} at {selectedDateTime?.time}</strong>.
              </p>
              <p className={styles.successText}>
                Check your inbox at <strong>{email}</strong> — we'll be in touch with further instructions.
              </p>
              <button className={styles.proceedBtn} onClick={onClose}>Done</button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
