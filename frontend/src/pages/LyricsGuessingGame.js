import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import { Button, Modal, Image } from "antd";
import axios from "axios";

const spotifyApi = new SpotifyWebApi();

function LyricsGuessingGame() {
    const [songs, setSongs] = useState([]);
    const [difficulty, setDifficulty] = useState(null);
    const [selectedSong, setSelectedSong] = useState(0);
    const [options, setOptions] = useState([]);
    const [guessesLeft, setGuessesLeft] = useState(3);
    const [score, setScore] = useState(0);
    const [lyricPercent, setLyricPercent] = useState(1);
    const [songLyrics, setSongLyrics] = useState("");
    const [showWin, setShowWin] = useState(false);
    const [showLose, setShowLose] = useState(false);
    const [showCorrectGuess, setShowCorrectGuess] = useState(false);
    const navigate = useNavigate();
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

    const getSongLyrics = async (song) => {
        const isrc = song.external_ids.isrc;
        let response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/track?track_isrc=${isrc}`);
        const id = response.data.message.body.track.track_id;
        response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/track/lyrics?track_id=${id}`);
        const lyrics = response.data.message?.body?.lyrics?.lyrics_body || '';
        const words = lyrics.replace("******* This Lyrics is NOT for Commercial use", "").split(" ");
        const lastIndex = words.length * lyricPercent - 1;
        return words.slice(0, lastIndex).join(" ");
    }

    const startGame = (level) => {
        setScore(0);
        setSongs(shuffle(songs));
        // Set the percentage of lyrics shown based on the selected level
        let lyricPercentage = 0;
        if (level === "easy") {
            lyricPercentage = 1;
        } else if (level === "medium") {
            lyricPercentage = 0.5;
        } else if (level === "hard") {
            lyricPercentage = 0.3;
        }
        setLyricPercent(lyricPercentage);
    };

    const handleOptionClick = (option) => {
        // A guess has been made, check if it's correct
        console.log(`${selectedSong}: ${option.id} =?= ${songs[selectedSong].id} (${songs[selectedSong].name})`);
        if (option.id === songs[selectedSong].id) {
            // Correct guess, reset state
            setOptions([]);
            setGuessesLeft(3);
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
            setShowWin(true);
        }
    }, [score, songs]);

    useEffect(() => {
        if (guessesLeft === 0) {
            // Game over, reset state
            setOptions([]);
            setGuessesLeft(3);
            setShowLose(true);
        }
    }, [guessesLeft]);

    const handleNextSong = async (nextSong) => {
        const song = songs[nextSong];
        const newSongLyrics = await getSongLyrics(song);
        if (!newSongLyrics) {
            setScore((prevScore) => prevScore + 1);
            handleNextSong(nextSong + 1);
            return;
        }
        setSongLyrics(newSongLyrics);
        setShowCorrectGuess(false);
        setSelectedSong(nextSong);
        setCatUrl(await getCatPic());

        console.info(`correct answer: ${song.artists[0].name} - ${song.name}`);
        // Get a list of three other random songs as options
        const otherSongs = songs.filter((s) => s.id !== song.id);
        const randomOptions = [];
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * otherSongs.length);
            randomOptions.push(otherSongs[randomIndex]);
            otherSongs.splice(randomIndex, 1);
        }
        setOptions([...randomOptions, song].sort(() => Math.random() - 0.5));
    }

    useEffect(() => {
        if (difficulty) {
            handleNextSong(0);
        }
    }, [lyricPercent, difficulty])


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
                <div style={{width: "80%", margin: "auto"}}>
                    <h2 style={{textAlign: "center"}}>Guess the song!</h2>
                    <h1 style={{textAlign: "right"}}>Score: {score}</h1>
                    <pre>{songLyrics}</pre>
                    <ul>
                        {options.map((option) => (
                            <li
                                className="song-options"
                                style={{backgroundColor: "teal", margin: "15px", padding: "10px", maxWidth: "300px", borderRadius: "5px", cursor: "pointer", color: "#fff"}}
                                key={option.id}
                                onClick={() => handleOptionClick(option)}
                            >
                                {option.artists[0].name} - {option.name}
                            </li>
                        ))}
                    </ul>
                    <h2 style={{textAlign: "center"}}>Guesses left: {guessesLeft}</h2>

                    <Modal open={showLose}
                        
                        closable={false}
                        footer={[
                            <Button key="home" onClick={() => navigate("/")}>
                                Home
                            </Button>
                        ]}
                    >
                        <h1 style={{textAlign: "center", fontWeight: "bold"}}>You've Lost. Try again next time!</h1>
                        <Image
                            height="70vh"
                            src="/VerySadCat.png"
                        />
                    </Modal>
                    <Modal open={showWin}
                        
                        closable={false}
                        footer={[
                            <Button key="home" onClick={() => navigate("/")}>
                                Home
                            </Button>
                        ]}
                    >
                        <h1 style={{textAlign: "center", fontWeight: "bold"}}>Congrats! You've beat the game!!</h1>
                        <p style={{textAlign: "center"}}>Try the other modes!</p>
                        <Image
                            height="70vh"
                            src="/logocat.png"
                        />
                    </Modal>
                    <Modal open={showCorrectGuess}

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
                        <h1 style={{textAlign: "center", fontWeight: "bold"}}>Yay!</h1>
                        <Image
                            height="70vh"
                            src={catUrl}
                        />
                    </Modal>
                    <script type="text/javascript" src="http://tracking.musixmatch.com/t1.0/AMa6hJCIEzn1v8RuOP"></script>
                </div>

            )
            }

        </>
    );

}

export default LyricsGuessingGame;