import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../components/css/App.css';
import ScheduleSelector from 'react-schedule-selector';
import { createSchedule, fetchSchedule } from '../api/users';

const Scheduler = () => {
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [currentSchedule] = await Promise.all([
                    fetchSchedule() // Fetch the current schedule
                ]);
                console.log("Fetched Schedule:", currentSchedule);
                setSchedule(currentSchedule || []);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        loadData();
    }, []);

    const handleChange = (newSchedule) => {
        setSchedule(newSchedule || []);
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
            <nav style={{ marginBottom: '20px' }}>
                <NavLink to="/login" style={{ marginRight: '10px' }}>Login</NavLink>
                <NavLink to="/friends" style={{ marginRight: '10px' }}>Friends</NavLink>
                <NavLink to="/plan">Plan</NavLink>
            </nav>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}> 
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

                <div style={{ marginLeft: '20px' }}>
                    <h3>Schedule Timestamps</h3>
                    <ul>
                        {schedule.length > 0 ? schedule.map((time, index) => (
                            <li key={index}>{time.toString()}</li>
                        )) : <li>No schedule times selected.</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Scheduler;
