import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/css/App.css';
import {fetchFriends} from '../api/users';
import { NavLink } from 'react-router-dom';

const CreatePlan = () => {
    const [friends, setFriends] = useState([]);
    const [plan, setPlan] = useState({ planName: '', planTime: '', planFriends: [] });

    const rootURL = 'http://localhost:3010'; // Define the root URL of your API

    useEffect(() => {
        const loadFriends = async () => {
            try {
                const friends = await fetchFriends();  // Fetch current friends list
                setFriends(friends || []);  // Set directly as fetchedFriends should already be an array
            } catch (error) {
                console.error('Failed to fetch friends:', error);
            }
        };

        loadFriends();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('app-token');
            const response = await axios.post(`${rootURL}/addPlan`, {
                name: plan.planName,
                time: plan.planTime,
                friendUsernames: plan.planFriends
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.plan) {
                alert('Plan created successfully!');
            } else {
                alert('Unexpected response from the server, please try again.');
            }
        } catch (error) {
            console.error('Failed to create plan:', error);
            alert('Failed to create plan.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlan((prevPlan) => ({
            ...prevPlan,
            [name]: value,
        }));
        console.log(plan);
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setPlan((prevPlan) => {
            const newPlanFriends = checked
                ? [...prevPlan.planFriends, value]
                : prevPlan.planFriends.filter((friend) => friend !== value);
            return { ...prevPlan, planFriends: newPlanFriends };
        });
    };

    return (
        <div>
            <nav style={{ marginBottom: '20px' }}>
                <NavLink to="/login" style={{ marginRight: '10px' }}>Login</NavLink>
                <NavLink to="/schedule" style={{ marginRight: '10px' }}>Schedule</NavLink>
                <NavLink to="/friends">Plan</NavLink>
            </nav>
            <h2>Create a plan</h2>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="planForm">
                        <input
                            type="text"
                            name="planName"
                            placeholder="Name of plan"
                            value={plan.planName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="planTime"
                            placeholder="Plan start time"
                            value={plan.planTime}
                            onChange={handleChange}
                            required
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h3>Your Friends:</h3>
                            {friends.length > 0 ? (
                                friends.map((friend) => (
                                    <div key={friend}>
                                        <input
                                            type="checkbox"
                                            name="planFriends"
                                            value={friend}
                                            onChange={handleCheckboxChange}
                                        /> {friend}
                                    </div>
                                ))
                            ) : (
                                <p>No friends available. <a href='/friends'>Try adding friends!</a></p>
                            )}
                        </div>
                        <button type="submit">Create Plan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePlan;