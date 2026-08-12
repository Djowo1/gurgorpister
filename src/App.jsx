import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Loader from './components/Loader/Loader';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import HowItWorks from './components/HowItWorks/HowItWorks';
import Readers from './components/Readers/Readers';
import SpiritualReader from './components/SpiritualReader/SpiritualReader';
import ReadingTiers from './components/ReadingTiers/ReadingTiers';
import Testimonials from './components/Testimonials/Testimonials';
import About from './components/About/About';
import FAQ from './components/FAQ/FAQ';
import Footer from './components/Footer/Footer';
import PaymentModal from './components/PaymentModal/PaymentModal';
import BookingConfirmation from './components/BookingConfirmation/BookingConfirmation';
import DonationBanner from './components/DonationBanner/DonationBanner';
import DonationSuccessModal from './components/DonationModal/DonationSuccessModal';

const HomePage = () => {
  const [selectedReader, setSelectedReader] = useState(null);
  const [booking, setBooking] = useState(null);
  const [showDonationSuccess, setShowDonationSuccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('donation') === 'success') {
      setShowDonationSuccess(true);
      // Clean up the URL
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Readers onSelectReader={setSelectedReader} />
        <SpiritualReader onBooking={(reader, tier) => setBooking({ reader, tier })} />
        <ReadingTiers
          selectedReader={selectedReader}
          onBooking={(reader, tier) => setBooking({ reader, tier })}
        />
        <Testimonials />
        <About />
        <DonationBanner />
        <FAQ />
      </main>
      <Footer />
      {booking && (
        <PaymentModal
          reader={booking.reader}
          tier={booking.tier}
          onClose={() => setBooking(null)}
        />
      )}
      {showDonationSuccess && <DonationSuccessModal onClose={() => setShowDonationSuccess(false)} />}
    </>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
    </Routes>
  );
}