import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import '../components/css/App.css';
import ScheduleSelector from 'react-schedule-selector';
import { createSchedule, fetchFriends, fetchFriendSchedule, fetchSchedule } from '../api/users';

const Scheduler = () => {
    const [schedule, setSchedule] = useState([]);
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [friends, currentSchedule] = await Promise.all([
                    fetchFriends(),
                    fetchSchedule() // Fetch the current schedule
                ]);
                console.log("Fetched Friends:", friends);
                console.log("Fetched Schedule:", currentSchedule);
                setFriends(friends || []);
                setSchedule(currentSchedule || []);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        loadData();
    }, []);

    const handleFriendSelection = (friendId) => {
        const newSelectedFriends = selectedFriends.includes(friendId)
            ? selectedFriends.filter(id => id !== friendId)
            : [...selectedFriends, friendId];
        setSelectedFriends(newSelectedFriends);
        updateScheduleWithFriends(newSelectedFriends);
    };

    const updateScheduleWithFriends = async (friendIds) => {
        if (friendIds.length > 0) {
            const friendsSchedules = await Promise.all(
                friendIds.map(id => fetchFriendSchedule(id))
            );
            const combinedSchedules = [].concat.apply([], friendsSchedules);
            setSchedule([...new Set([...schedule, ...combinedSchedules])]);
        } else {
            setSchedule([]);
        }
    }

    const handleChange = (newSchedule) => {
        setSchedule(newSchedule || []);
    };
  
    const handleSubmit = async () => {
        try {
            await createSchedule(schedule);
            alert('Schedule submitted successfully!');
            navigate('/friends'); // Redirect after submission, adjust as needed
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
