# Guessify
Guessify was created for CPSC 3720 - Introduction to Software Development by Ryan Ivie, Elisa Lin, Duong Nguyen, and Yash Patel.

NOTE: We currently have basic access to the Spotify API, so you must be added to the beta tester allow list before being able to login with our Spotify OAuth. If you want to use the app, feel free to email us your Spotify account email to be added. 

## Intro/User Guide
### What is Guessify?
web based app made w react. purpose is a game on how well you know your music history

### How does Guessify work?
Guessify uses Spotify's API to get the top 50 tracks you have been listening to and 50 playlists. Using our code, a game is made using those tracks and playlists.

### How do I use Guessify?
All you need to do is login with Spotify. You will then be able to play the two game modes provided, Song Guessing and Playlist Guessing, with three difficulty modes. 

## Dev Quickstart Guide
### Installation
- Install node.js
+ Install react
* To install the  dependencies of the app.js, run:
`npm install` or `npm i`
### .env API Keys
For security reasons, none of the API keys are included. To start the `apps.js` server, first create a `.env` file and add your keys:
```
REACT_APP_SPOTIFY_CLIENT_ID='<client_id>'
REACT_APP_REDIRECT_URI='http://localhost:3000/callback'
```
### Start
To start the server locally, run:
`npm start`

## Modifying Code
We used the JS framework React.

Work in Progress

Install nodejs, react then run "npm install", "npm start".
