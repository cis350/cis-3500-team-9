import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {fetchFriends} from '../api/users';
import '../components/css/App.css';

const CreatePlan = () => {
    const [username, setUsername] = useState('');
    const [friends, setFriends] = useState(['a', 'b', 'c']);
    const [plan, setPlan] = useState({ planName: '', planTime: '', planFriends: fetchFriends()});

    const rootURL = 'http://localhost:3010'; // Define the root URL of your API

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          console.log('submitted');
          //handle POST here
        } catch (error) {
          console.error('Login failed:', error.response.data.error);
          alert('Login failed: ' + error.response.data.error);
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

    return (
        <div>
            <h2>Create a plan</h2>
            <div>
                <form onSubmit={handleSubmit}>
                    <div class='planForm'>
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
                                friends.map((x) => {
                                    return <div><input 
                                        type="checkbox" 
                                        name="planFriends"
                                        value={plan.planFriends}
                                        onChange={handleChange}
                                    /> {x}</div>
                                }) 
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
