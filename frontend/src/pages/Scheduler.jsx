import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/css/App.css';
import ScheduleSelector from 'react-schedule-selector'
import { createSchedule } from '../api/users';

const Scheduler = () => {
    const [schedule, setSchedule] = useState([]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        console.log("Original schedule data:", e);
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
        <div style={{ display: 'flex' }}> 
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
            {(  // Conditionally render this div only if isSubmitted is true
                <div style={{ marginLeft: '20px' }}>
                    <h3>Schedule Timestamps</h3>
                    <ul>
                        {schedule.map((time, index) => (
                            <li key={index}>{time.toString()}</li>  // Display each timestamp
                        ))}
                    </ul>
                </div>
            )}
        </div> 
    );
};

export default Scheduler;
