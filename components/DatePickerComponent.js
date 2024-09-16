"use client"; // Mark as Client Component

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerComponent = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const router = useRouter();

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        router.push(`/pastOrders?date=${formattedDate}`); // Navigate to the new page with the selected date
    };

    return (
        <div className="flex justify-center items-center">
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className="border border-gray-300 p-2 rounded-md"
                placeholderText="Select a date"
            />
        </div>
    );
};

export default DatePickerComponent;
