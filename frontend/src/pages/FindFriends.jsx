import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { fetchFriends } from '../api/users';

const FindFriends = () => {
    const [username, setUsername] = useState('');
    const [friends, setFriends] = useState([]);
    const [message, setMessage] = useState('');

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
    }, []); // Empty dependency array to run only once on mount    

    const handleAddFriend = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('app-token');
            const response = await axios.post(`${rootURL}/addFriend`, { friendUsername: username }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setFriends(response.data.friends);  // Update the friends list with the new array
            setUsername('');  // Clear the input field
            setMessage('Friend added successfully!');
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.error);
            } else {
                setMessage('Failed to add friend.');
            }
        }
    };

    return (
        <div>
            <nav style={{ marginBottom: '20px' }}>
                <NavLink to="/login" style={{ marginRight: '10px' }}>Login</NavLink>
                <NavLink to="/schedule" style={{ marginRight: '10px' }}>Schedule</NavLink>
                <NavLink to="/plan">Plan</NavLink>
            </nav>

            <form onSubmit={handleAddFriend}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter a friend's username"
                    required
                />
                <button type="submit">Add Friend</button>
            </form>
            
            {message && <p>{message}</p>}

            <div>
                <h3>Your Friends:</h3>
                {friends.length > 0 ? (
                    friends.map((friend, index) => <p key={index}>{friend}</p>)
                ) : (
                    <p>No friends added yet.</p>
                )}
            </div>
        </div>
    );
};

export default FindFriends;