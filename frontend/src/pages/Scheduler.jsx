import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/css/App.css';
import ScheduleSelector from 'react-schedule-selector'
import { createSchedule } from '../api/users';

const Scheduler = () => {
    const [schedule, setSchedule] = useState([]);
    const navigate = useNavigate();

    // const handleChange = (e) => {
    //     console.log(e);
    //     setSchedule([...e]);
    // };

    const handleChange = (e) => {   // TODO: handle multiple array structure
        console.log("Original schedule data:", e);
        // Flatten the array using Array.prototype.flat()
        const flattenedSchedule = Array.isArray(e) ? e.flat() : e;
        console.log("Flattened schedule data:", flattenedSchedule);
        setSchedule([...flattenedSchedule]);
    };
    
    const handleSubmit = async () => {
        try {
            await createSchedule(schedule);
            alert('Schedule submitted successfully!');
        } catch (error) {
            alert('Failed to submit schedule: ' + error.message);
        }
    };

    return (
        <div>
            <ScheduleSelector
            selection={schedule}
            numDays={1}
            minTime={8}
            maxTime={22}
            hourlyChunks={1}
            onChange={handleChange}
            />
            <button type="submit" onClick={handleSubmit}>Submit Schedule</button>
        </div> 
    );
};

export default Scheduler;