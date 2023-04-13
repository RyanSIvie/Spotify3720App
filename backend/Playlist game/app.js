import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

function PlaylistGuessingGame() {
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [guessesLeft, setGuessesLeft] = useState(3);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    spotifyApi.getUserPlaylists().then((data) => {
      const userPlaylists = data.items.filter((item) => item.owner.id === data.owner.id);
      if (userPlaylists.length >= 4) {
        setPlaylists(userPlaylists.slice(0, 4));
        setCurrentPlaylistIndex(Math.floor(Math.random() * 4));
      }
    });
  }, []);

  useEffect(() => {
    if (playlists.length > 0) {
      const newOptions = [];
      newOptions.push(playlists[currentPlaylistIndex]);
      while (newOptions.length < 4) {
        const randomIndex = Math.floor(Math.random() * playlists.length);
        if (randomIndex !== currentPlaylistIndex) {
          newOptions.push(playlists[randomIndex]);
        }
      }
      setOptions(newOptions);
    }
  }, [playlists, currentPlaylistIndex]);

  function handleGuess(playlist) {
    if (playlist.id === playlists[currentPlaylistIndex].id) {
      setCurrentPlaylistIndex(Math.floor(Math.random() * 4));
      setGuessesLeft(3);
      setShowAnswer(false);
    } else {
      setGuessesLeft(guessesLeft - 1);
    }
  }

  function handleShowAnswer() {
    setShowAnswer(true);
  }

  if (playlists.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Playlist Guessing Game</h1>
      <img src={playlists[currentPlaylistIndex].images[0].url} alt="Playlist artwork" />
      <div>
        {options.map((option, index) => (
          <button key={index} onClick={() => handleGuess(option)}>
            {option.name}
          </button>
        ))}
      </div>
      {showAnswer && (
        <div>
          <h2>The answer was {playlists[currentPlaylistIndex].name}</h2>
        </div>
      )}
      {guessesLeft > 0 && <p>Guesses left: {guessesLeft}</p>}
      {guessesLeft === 0 && (
        <div>
          <p>Game over!</p>
          <button onClick={() => window.location.reload()}>Play again</button>
        </div>
      )}
      <button onClick={handleShowAnswer}>Show answer</button>
    </div>
  );
}

export default PlaylistGuessingGame;
