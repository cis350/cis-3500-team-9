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
        return response.data;
    } catch (error) {
        console.error('Error updating schedule:', error.response ? error.response.data : error.message);
        throw error;
    }
}
 
 export const fetchSchedule = async () => {
    const token = localStorage.getItem('app-token');
    try {
        const response = await axios.get(`${rootURL}/user/schedule`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data.data || [];  // Ensure you always return an array
    } catch (error) {
        return [];  // Return an empty array on error to maintain consistency in your component state
    }
}

/**
 * Fetch the friends list of a user
 */
export const fetchFriends = async () => {
    const token = localStorage.getItem('app-token'); // Retrieve the token from localStorage
    try {
        const response = await axios.get(`${rootURL}/friends`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.friends;  // Assuming the data is structured { data: friendsList }
    } catch (error) {
        throw error;
    }
}