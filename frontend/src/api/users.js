// HTTP client
import axios from "axios";
import { rootURL } from "./utils";
import { setHeaders } from "./utils";
/**
 * This module contains HTTP calls to API
 * users CRUD 
 */

/**
 * get all the users from the backend
 */
export const getAllUsers = async () =>{
    // always use try/catch in an async function
    try{
        const response = await axios.get(`${rootURL}/users`);
        console.log("all students", response.data);
        return response.data.data;

    } catch (err){
        console.error('error', err.message);
    }
}

/**
 * Get a user by their id
 */
export const getUserById = async (id) =>{
    // always use try/catch in an async function
    try{
        const response = await axios.get(`${rootURL}/user/${id}`);
        console.log("A user", response.data);
        return response.data.data;

    } catch (err){
        console.error('error', err.message);
    }
}

/**
 * Create a new user
 */
export const createNewUser = async (userObject) => {
    try {
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        setHeaders();

        const payload = {
            username: userObject.username,
            password: userObject.password,
            availability: [],
            friends: []
        };

        const response = await axios.post(`${rootURL}/user`, payload);
        console.log("A response", response.data);
        return response.data.data;

    } catch (err) {
        console.error('error', err.message);
        throw err;
    }
}

/**
 * Create a new schedule
 */
 export const createSchedule = async (schedule) => {
    setHeaders();
    const token = localStorage.getItem('app-token'); // Retrieve the token from localStorage
    try {
        const response = await axios.post(`${rootURL}/user/schedule`, { schedule }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Schedule update response:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating schedule:', error.response ? error.response.data : error.message);
        throw error;
    }
}
 
 export const fetchSchedule = async () => {
    setHeaders();
    const token = localStorage.getItem('app-token');
    try {
        const response = await axios.get(`${rootURL}/user/schedule`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("Schedule fetched successfully:", response.data);
        return response.data.data || [];  // Ensure you always return an array
    } catch (error) {
        console.error('Error fetching schedule:', error.response ? error.response.data : error.message);
        return [];  // Return an empty array on error to maintain consistency in your component state
    }
}

/**
 * Fetch the friends list of a user
 */
export const fetchFriends = async () => {
    // setHeaders();
    const token = localStorage.getItem('app-token'); // Retrieve the token from localStorage
    try {
        const response = await axios.get(`${rootURL}/user/friends`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("Friends list fetched successfully:", response.data);
        return response.data;  // Assuming the data is structured { data: friendsList }
    } catch (error) {
        console.error('Error fetching friends list:', error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * Fetch the schedules of a user's friends
 * @param {Array} friendIds - array of friend IDs
 */
export const fetchFriendSchedule = async (friendIds) => {
    const token = localStorage.getItem('app-token'); // Retrieve the token from localStorage
    try {
        const requests = friendIds.map(id =>
            axios.get(`${rootURL}/user/${id}/schedule`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        );
        const responses = await Promise.all(requests);
        const schedules = responses.map(response => response.data.data); // Assuming each response is structured correctly
        console.log("Schedules fetched successfully:", schedules);
        return schedules; // Returns an array of schedule arrays
    } catch (error) {
        console.error('Error fetching schedules:', error.response ? error.response.data : error.message);
        throw error;
    }
}
