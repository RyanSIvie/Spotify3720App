import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { Button, Row, Col, Space } from "antd";

const spotifyApi = new SpotifyWebApi();

function SongGuessingGame() {
  const [songs, setSongs] = useState([]);
  const [difficulty, setDifficulty] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [options, setOptions] = useState([]);
  const [guessesLeft, setGuessesLeft] = useState(3);
  const [guess, setGuess] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [audio, setAudio] = useState(null);
  const [originalTimeLimit, setOriginalTimeLimit] = useState(0);
  const [guessedCorrectly, setGuessedCorrectly] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      spotifyApi.setAccessToken(token);
      // Get the user's top 50 songs from Spotify
      spotifyApi
        .getMyTopTracks({ time_range: "long_term", limit: 50 })
        .then((response) => {
          setSongs(response.items);
        });
    }
  }, []);

  const handleDifficultySelect = (e) => {
    const level = e.target.value;
    const timeLimit = setOriginalTimeLimit(level);
    setOriginalTimeLimit(timeLimit);
    setTimeLeft(timeLimit);
  };

  const startGame = (level) => {
    // Select a random song from the user's top 50
    const randomIndex = Math.floor(Math.random() * songs.length);
    const song = songs[randomIndex];
    setSelectedSong(song);

    // Get a list of three other random songs as options
    const otherSongs = songs.filter((s) => s.id !== song.id);
    const randomOptions = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * otherSongs.length);
      randomOptions.push(otherSongs[randomIndex]);
      otherSongs.splice(randomIndex, 1);
    }
    setOptions([...randomOptions, song].sort(() => Math.random() - 0.5));

    // Set the audio source and start playing
    const audio = new Audio(song.preview_url);
    audio.onerror = (error) => {
      console.error(error);
      setIsPlaying(false);
    };
    setAudio(audio);
    setIsPlaying(true);
    audio.play();

    // Set the time limit based on the selected level
    let timeLimit = 0;
    if (level === "easy") {
      timeLimit = 30;
    } else if (level === "medium") {
      timeLimit = 20;
    } else if (level === "hard") {
      timeLimit = 10;
    }
    setTimeLeft(timeLimit);
    setOriginalTimeLimit(timeLimit);

    // Set a timer for the selected level
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    // When the timer ends, stop playing the song and prompt for guess
    setTimeout(() => {
      clearInterval(timer);
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setGuess(null);
      setTimeLeft(timeLimit); // Use timeLimit instead of originalTimeLimit
    }, timeLimit * 1000);
  };

  const handleOptionClick = (option) => {
    setGuess(option.id === selectedSong.id);
    // check if the guess is correct
    if (option.id === selectedSong.id) {
      // correct guess
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (guessesLeft === 0) {
      // Game over, reset state
      setSelectedSong(null);
      setOptions([]);
      setGuessesLeft(3);
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    } else if (guess !== null) {
      // A guess has been made, check if it's correct
      if (guess) {
        // Correct guess, reset state
        setGuessedCorrectly(true);
        setSelectedSong(null);
        setOptions([]);
        setGuessesLeft(3);
      } else {
        // Incorrect guess, decrement guessesLeft and reset state
        setGuessesLeft((prevGuessesLeft) => prevGuessesLeft - 1);
        setGuess(null);
      }
    }
  }, [guess, guessesLeft]);

  return (
    <>
      {!difficulty && (
        <div className="difficulty-level">
          <Button
            type="primary"
            size="large"
            onClick={() => {
              setDifficulty("easy");
              startGame("easy");
            }}
            style={{ background: "#18ac4d", padding: "0 8px" }}
          >
            Easy
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={() => {
              setDifficulty("medium");
              startGame("medium");
            }}
            style={{ background: "#eab308" }}
          >
            Medium
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={() => {
              setDifficulty("hard");
              startGame("hard");
            }}
            style={{ background: "#ef4444" }}
          >
            Hard
          </Button>
        </div>
      )}
      {difficulty && (
        <div>
          <h2>Guess the song!</h2>
          <p>{isPlaying && `${timeLeft} seconds left`}</p>
          <p>
            {selectedSong.artists[0].name} - {selectedSong.name}
          </p>
          <ul>
            {options.map((option) => (
              <li
                className="song-options"
                key={option.id}
                onClick={() => handleOptionClick(option)}
              >
                {option.artists[0].name} - {option.name}
              </li>
            ))}
          </ul>
          <p>Guesses left: {guessesLeft}</p>
        </div>
      )}

      <p>{guessedCorrectly}</p>
    </>
  );
}

export default SongGuessingGame;