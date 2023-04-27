# Guessify
Guessify was created for CPSC 3720 - Introduction to Software Development by Ryan Ivie, Elisa Lin, Duong Nguyen, and Yash Patel.

## Intro/User Guide

### What is Guessify?
Spotify can get boring at times and since it Heardle is ending soon, we wanted to create a fun user experience for avid music listeners to test their own music knowledge!

### How does Guessify work?
Guessify uses Spotify's API to get the top 50 tracks you have been listening to. Using our code, a game is made using those tracks.

### How do I use Guessify?
All you need to do is login with Spotify. You will then be able to play the two game modes provided, Song Guessing and Lyrics Guessing, with three difficulty modes. 

## Dev Quickstart Guide

### Installation
- Install node.js
- Install the dependencies in both the frontend and the backend folders, run:
`npm install` or `npm i`

### .env API Keys
For security reasons, none of the API keys are included. Visit the following sites to sign up for the API keys: 
- https://developer.spotify.com/
- https://developer.musixmatch.com/plans
- https://thecatapi.com/

To start both the frontend and the backend, copy the .env.sample files, rename them to .env, and fill in the blanks

### Start
Start the servers in both the frontend and backend folders, open two different terminals and for terminal 1 run:
`cd .\frontend\.`
`npm start`

For terminal 2:
`cd .\backend\.`
`npm start`

## Modifying Code
We used the JS framework React and Express.
