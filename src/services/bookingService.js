import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const BOOKINGS_COLLECTION = "bookings";

export const createPendingBooking = async (bookingData) => {
  try {
    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
      ...bookingData,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating pending booking: ", error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId, status, paymentDetails = {}) => {
  try {
    const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await updateDoc(bookingRef, {
      status,
      paymentDetails,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating booking status: ", error);
    throw error;
  }
};
