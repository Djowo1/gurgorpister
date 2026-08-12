import React, { useState } from 'react';
import styles from './Calendar.module.css';

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
];

export default function Calendar({ onDateTimeSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (date < new Date().setHours(0,0,0,0)) {
        return;
    }
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when a new date is selected
  };
  
  const handleTimeClick = (time) => {
      setSelectedTime(time);
      if (onDateTimeSelect && selectedDate) {
          onDateTimeSelect({ date: selectedDate, time });
      }
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  }

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className={`${styles.day} ${styles.disabled}`}></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const disabled = date < new Date().setHours(0,0,0,0);
        days.push(
            <div
            key={i}
            className={`
                ${styles.day} 
                ${disabled ? styles.disabled : ''}
                ${selectedDate && i === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth() ? styles.selected : ''}
                ${isToday(i) ? styles.today : ''}
            `}
            onClick={() => !disabled && handleDateClick(i)}
            >
            {i}
            </div>
        );
    }
    return days;
  };

  return (
    <div className={styles.calendarContainer}>
        <div className={styles.calendar}>
            <div className={styles.header}>
                <button onClick={handlePrevMonth}>&lt;</button>
                <div className={styles.monthYear}>
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </div>
                <button onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className={styles.daysGrid}>
                {daysOfWeek.map((day, i) => (
                <div key={i} className={styles.dayName}>{day}</div>
                ))}
                {renderDays()}
            </div>
        </div>
        
        {selectedDate && (
            <div className={styles.timeSlotsWrapper}>
                <h4 className={styles.timeTitle}>Available Times</h4>
                <div className={styles.timeGrid}>
                    {TIME_SLOTS.map((time, idx) => (
                        <button 
                            key={idx} 
                            className={`${styles.timeSlot} ${selectedTime === time ? styles.timeSelected : ''}`}
                            onClick={() => handleTimeClick(time)}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
}