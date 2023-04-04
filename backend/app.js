import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

function SongGuessingGame() {
    const [songs, setSongs] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);
    const [options, setOptions] = useState([]);
    const [guessesLeft, setGuessesLeft] = useState(3);
    const [guess, setGuess] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        // Get the user's top 50 songs from Spotify
        spotifyApi.getMyTopTracks({ limit: 50 }).then((response) => {
            setSongs(response.items);
        });
    }, []);

    const startGame = () => {
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

        // Start playing the selected song
        const audio = new Audio(song.preview_url);
        audio.play();
        setIsPlaying(true);

        // Set a timer for 30 seconds
        setTimeLeft(30);
        const timer = setInterval(() => {
            setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        }, 1000);

        // When the timer ends, stop playing the song and prompt for guess
        setTimeout(() => {
            clearInterval(timer);
            audio.pause();
            setIsPlaying(false);
            setGuess(null);
            setGuessesLeft((prevGuessesLeft) => prevGuessesLeft - 1);
        }, 30000);
    };

    const handleOptionClick = (option) => {
        setGuess(option.id === selectedSong.id);
    };

    useEffect(() => {
        if (guessesLeft === 0) {
            // Game over, reset state
            setSelectedSong(null);
            setOptions([]);
            setGuessesLeft(3);
        } else if (guess !== null) {
            // A guess has been made, check if it's correct
            if (guess) {
                // Correct guess, reset state
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
        <div>
            {selectedSong ? (
                <div>
                    <h2>Guess the song!</h2>
                    <p>{timeLeft} seconds left</p>
                    <p>{selectedSong.artists[0].name} - {selectedSong.name}</p>
                    <p>{isPlaying ? "Playing..." : "Paused"}</p>
                    <ul>
                        {options.map((option) => (
                            <li key={option.id} onClick={() => handleOptionClick(option)}>
                                {option.artists[0].name} - {option.name}
                            </li>
                        ))}
                    </ul>
                    {guess !== null && (
                        <p>{guess ? "Correct!" : "Incorrect"}</p>
                    )}
                    <button onClick={startGame}>Start game</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default SongGuessingGame;
