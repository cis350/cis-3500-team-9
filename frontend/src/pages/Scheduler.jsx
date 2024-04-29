import React, { useState } from 'react';
import '../components/css/App.css';
import ScheduleSelector from 'react-schedule-selector'

const Scheduler = () => {
    const [schedule, setSchedule] = useState([]);

    const handleChange = (e) => {
        const newSchedule = e;
        console.log(e);
        setSchedule([...newSchedule]);
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
            <button type="submit">Submit Schedule</button>
        </div> 
    );
};

export default Scheduler;