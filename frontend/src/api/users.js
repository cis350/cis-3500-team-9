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

    }catch (err){
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

    }catch (err){
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
            availability: []
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

/**
 * Fetch the friends list of a user
 */
export const fetchFriends = async () => {

}

/**
 * Fetch the schedules of a user's friends
 */
export const fetchFriendSchedule = async () => {

}