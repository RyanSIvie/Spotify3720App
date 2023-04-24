import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import { Button, Modal, Image } from "antd";
import axios from "axios";

const spotifyApi = new SpotifyWebApi();
function useInterval(callback, delay) {
    const savedCallback = useRef(callback)

    // Remember the latest callback if it changes.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        if (!delay && delay !== 0) {
            return;
        }
        const interval = setInterval(() => savedCallback.current(), delay);
        return () => clearInterval(interval);
    }, [delay])
}

function useCounter(initialValue) {
    const [count, setCount] = useState(initialValue || 0)

    const increment = () => setCount(x => x + 1)
    const decrement = () => setCount(x => x - 1)
    const reset = () => setCount(initialValue || 0)

    return {
        count,
        increment,
        decrement,
        reset,
        setCount,
    }
}

function useBoolean(defaultValue) {
    const [value, setValue] = useState(!!defaultValue)

    const setTrue = useCallback(() => setValue(true), [])
    const setFalse = useCallback(() => setValue(false), [])
    const toggle = useCallback(() => setValue(x => !x), [])

    return { value, setValue, setTrue, setFalse, toggle }
}

function useCountdown(countStart, intervalMs) {
    const {
        count,
        decrement,
        reset: resetCounter,
    } = useCounter(countStart)

    const {
        value: isCountdownRunning,
        setTrue: startCountdown,
        setFalse: stopCountdown,
    } = useBoolean(false)

    const resetCountdown = () => {
        stopCountdown()
        resetCounter()
    }

    const countdownCallback = useCallback(() => {
        if (count === 0) {
            stopCountdown()
            return
        }
        decrement()
    }, [count, decrement, stopCountdown])

    useInterval(countdownCallback, isCountdownRunning ? intervalMs : null)

    return [count, { startCountdown, stopCountdown, resetCountdown }]
}

function SongGuessingGame() {
    const [songs, setSongs] = useState([]);
    const [difficulty, setDifficulty] = useState(null);
    const [selectedSong, setSelectedSong] = useState(0);
    const [options, setOptions] = useState([]);
    const [guessesLeft, setGuessesLeft] = useState(3);
    const [score, setScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);
    const [originalTimeLimit, setOriginalTimeLimit] = useState(0);
    const [showWin, setShowWin] = useState(false);
    const [showLose, setShowLose] = useState(false);
    const [showCorrectGuess, setShowCorrectGuess] = useState(false);
    const navigate = useNavigate();
    const [timeLeft, { startCountdown, resetCountdown }] = useCountdown(originalTimeLimit, 1000);
    const catAPI = `https://api.thecatapi.com/v1/images/search?api_key=${process.env.REACT_APP_CAT_API_KEY}`;
    const [catUrl, setCatUrl] = useState(null);

    useEffect(() => {
        const token = window.localStorage.getItem("token");
        if (token) {
            spotifyApi.setAccessToken(token);
            // Get the user's top 50 songs from Spotify
            spotifyApi
                .getMyTopTracks({ time_range: "long_term", limit: 10 })
                .then((response) => {
                    setSongs(response.items);
                });
        }
    }, []);

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex !== 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    const getCatPic = async () => {
        const response = await axios.get(catAPI);
        return response.data[0].url;
    }

    const startGame = (level) => {
        setScore(0);
        setSongs(shuffle(songs));
        // Set the time limit based on the selected level
        let timeLimit = 0;
        if (level === "easy") {
            timeLimit = 30;
        } else if (level === "medium") {
            timeLimit = 20;
        } else if (level === "hard") {
            timeLimit = 10;
        }
        setOriginalTimeLimit(timeLimit);

    };

    const handleOptionClick = (option) => {
        // A guess has been made, check if it's correct
        if (option.id === songs[selectedSong].id) {
            // Correct guess, reset state
            setOptions([]);
            setGuessesLeft(3);
            audio.pause();
            setIsPlaying(false);
            setScore((prevScore) => prevScore + 1);
            setShowCorrectGuess(score + 1 !== songs.length); // only show if not the last song
        } else {
            // Incorrect guess, decrement guessesLeft and reset state
            setGuessesLeft((prevGuessesLeft) => prevGuessesLeft - 1);
        }
    };

    useEffect(() => {
        if (songs.length > 0 && score === songs.length) {
            // Game win, reset state
            setOptions([]);
            setGuessesLeft(3);
            audio.pause();
            setIsPlaying(false);
            setShowWin(true);
        }
    }, [score, songs]);

    useEffect(() => {
        if (guessesLeft === 0) {
            // Game over, reset state
            setOptions([]);
            setGuessesLeft(3);
            audio.pause();
            setIsPlaying(false);
            setShowLose(true);
        }
    }, [guessesLeft, audio]);

    const handleNextSong = async (nextSong) => {
        setShowCorrectGuess(false);
        setSelectedSong(nextSong);
        const song = songs[nextSong];
        setCatUrl(await getCatPic());

        console.info(`${song.artists[0].name} - ${song.name}`);
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
        resetCountdown();
        startCountdown();
    }

    useEffect(() => {
        if (difficulty) {
            handleNextSong(0);
        }
    }, [originalTimeLimit, difficulty])

    useEffect(() => {
        if (isPlaying && timeLeft === 0) {
            audio.pause();
            setIsPlaying(false);
        }
    }, [timeLeft, isPlaying, audio])

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
                    <p>{timeLeft} seconds left</p>
                    {/* <p>
                        {selectedSong.artists[0].name} - {selectedSong.name}
                    </p> */}
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
                    <p>Score: {score}</p>
                    <Modal open={showLose}
                        title="You've Lost"
                        closable={false}
                        footer={[
                            <Button key="home" onClick={() => navigate("/")}>
                                Home
                            </Button>
                        ]}
                    >
                        <p>You've lost the game!</p>
                        <Image
                            height="70vh"
                            src="/VerySadCat.png"
                        />
                    </Modal>
                    <Modal open={showWin}
                        title="Congrats!"
                        closable={false}
                        footer={[
                            <Button key="home" onClick={() => navigate("/")}>
                                Home
                            </Button>
                        ]}
                    >
                        <p>You've beat the game!</p>
                        <Image
                            height="70vh"
                            src="/logocat.png"
                        />
                    </Modal>
                    <Modal open={showCorrectGuess}
                        title="Yay!"
                        closable={false}
                        footer={[
                            <Button key="home" onClick={() => navigate("/")}>
                                Home
                            </Button>,
                            <Button key="next" onClick={() => handleNextSong(selectedSong + 1)}>
                                Next
                            </Button>
                        ]}
                    >
                        <Image
                            height="70vh"
                            src={catUrl}
                        />
                    </Modal>
                </div>

            )
            }

        </>
    );
}

export default SongGuessingGame;