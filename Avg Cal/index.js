// We need these to make our server work
const express = require('express');
const axios = require('axios');

// Setting up the server
const app = express();
const PORT = 9876; // This is the port number where the server will run
const WINDOW_SIZE = 10; // We only keep track of the last 10 numbers we get
const TIMEOUT = 50000; // If it takes too long (more than 50 seconds), we stop trying
let STORAGE = []; // This is where we store our numbers

// These are like the login details to use the API
const CREDENTIALS = {
    companyName: "omMart",
    clientID: "72fc5c56-3750-450d-9ea5-c8a7b15c95de",
    clientSecret: "EQrWLkNmKPBaUxgr",
    ownerName: "Omsri Dabbeeru",
    ownerEmail: "omsridabberu@gmail.com",
    rollNo: "vu21csen0300129"
};

// We need this token to prove we are allowed to use the API
let accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzI0NzM2NjgzLCJpYXQiOjE3MjQ3MzYzODMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjcyZmM1YzU2LTM3NTAtNDUwZC05ZWE1LWM4YTdiMTVjOTVkZSIsInN1YiI6Im9tc3JpZGFiYmVydUBnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJvbU1hcnQiLCJjbGllbnRJRCI6IjcyZmM1YzU2LTM3NTAtNDUwZC05ZWE1LWM4YTdiMTVjOTVkZSIsImNsaWVudFNlY3JldCI6IkVRcldMa05tS1BCYVV4Z3IiLCJvd25lck5hbWUiOiJPbXNyaSBEYWJiZWVydSIsIm93bmVyRW1haWwiOiJvbXNyaWRhYmJlcnVAZ21haWwuY29tIiwicm9sbE5vIjoidnUyMWNzZW4wMzAwMTI5In0.FGMFiPMd7dkyprphRXbIl13rBUAMvmW9nqLG99LDA0U";

// These are the addresses (URLs) where we can ask for different types of numbers
const API_ENDPOINTS = {
    p: 'http://20.244.56.144/test/primes', // For prime numbers
    f: 'http://20.244.56.144/test/fibo',   // For Fibonacci numbers
    e: 'http://20.244.56.144/test/even',   // For even numbers
    r: 'http://20.244.56.144/test/rand'    // For random numbers
};

// This function gets us a new access token so we can keep using the API
const getAccessToken = async () => {
    try {
        const response = await axios.post('http://20.244.56.144/test/auth', {
            companyName: CREDENTIALS.companyName,
            clientID: CREDENTIALS.clientID,
            clientSecret: CREDENTIALS.clientSecret,
            ownerName: CREDENTIALS.ownerName,
            ownerEmail: CREDENTIALS.ownerEmail,
            rollNo: CREDENTIALS.rollNo
        });
        accessToken = response.data.access_token; // Store the new access token
    } catch (error) {
        console.error('Error fetching access token:', error.message); // Print error if something goes wrong
    }
};

// This function gets the numbers from the API
const fetchNumbers = async (type) => {
    try {
        const response = await axios.get(API_ENDPOINTS[type], {
            headers: { 'Authorization': `Bearer ${accessToken}` }, // We need to show our token here
            timeout: TIMEOUT // Stop trying if it takes too long
        });
        return response.data.numbers; // Return the numbers we got from the API
    } catch (error) {
        console.error(`Error fetching ${type} numbers:`, error.message); // Print error if something goes wrong
        return []; // Return an empty list if there’s an error
    }
};

// When someone visits our server at /numbers/:numberid, we handle their request here
app.get('/numbers/:numberid', async (req, res) => {
    const numberid = req.params.numberid; // Get the type of number they want

    // Check if they asked for a valid type (prime, Fibonacci, even, or random)
    if (!['p', 'f', 'e', 'r'].includes(numberid)) {
        return res.status(400).json({ error: 'Invalid number type' }); // Send an error if the type is wrong
    }

    const start = Date.now(); // Note the start time
    const newNumbers = await fetchNumbers(numberid); // Get the numbers from the API
    const end = Date.now(); // Note the end time

    // If it took too long, we tell them
    if (end - start > TIMEOUT) {
        return res.status(504).json({ error: 'Timeout exceeded while fetching numbers' });
    }

    // Make sure there are no duplicates in the numbers we got
    const uniqueNewNumbers = [...new Set(newNumbers)];
    const windowPrevState = [...STORAGE]; // Save the previous state of STORAGE

    // Add the new numbers to our sliding window (STORAGE)
    uniqueNewNumbers.forEach(number => {
        if (!STORAGE.includes(number)) {
            if (STORAGE.length >= WINDOW_SIZE) {
                STORAGE.shift(); // Remove the oldest number if STORAGE is full
            }
            STORAGE.push(number); // Add the new number to STORAGE
        }
    });

    const windowCurrState = [...STORAGE]; // Save the current state of STORAGE
    const avg = (STORAGE.length === 0) ? 0 : STORAGE.reduce((a, b) => a + b, 0) / STORAGE.length; // Calculate the average of the numbers in STORAGE

    // Send back the previous and current states of STORAGE, the unique numbers, and the average
    res.json({
        windowPrevState,
        windowCurrState,
        numbers: uniqueNewNumbers,
        avg: avg.toFixed(2) // Round the average to 2 decimal places
    });
});

// Start the server and get the first access token
app.listen(PORT, async () => {
    await getAccessToken();
    console.log(`Server is running on http://localhost:${PORT}`); // Let us know the server is ready
});
