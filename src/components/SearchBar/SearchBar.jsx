import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SearchBar.scss'; 

function SearchBar() {
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState([]);
  const apiKey = 'RGAPI-5d2057cd-7597-444d-9f57-53723049da67'; // Replace 'YOUR_API_KEY' with your actual API key
  const [errorMessage, setErrorMessage] = useState('');

  const fetchPlayerData = async (input) => {
    try {
      const response = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(input)}?api_key=${apiKey}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage(`No summoner named ${input}`);
      } else {
        console.error('Error fetching player:', error);
        setErrorMessage(``);
      }
      return null;
    }
  };

  const handleChange = async (event) => {
    const input = event.target.value;
    setQuery(input);
    setErrorMessage(``);
    
    if (input.length >= 2) {
      const playerData = await fetchPlayerData(input);
      if (playerData && playerData.name.toLowerCase() === input.toLowerCase()) {
        setPlayers([playerData]);
      } else {
        setPlayers([]);
      }
    } else {
      setPlayers([]);
    }
  };

  return (
    <div className="search-container">
      <input className="searchbar" type="text" placeholder="Search..." value={query} onChange={handleChange} />
      {errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}
      {players.length > 0 && (
        <ul className='dropdown'>
          {players.map(player => (
            <li key={player.id}>
              <Link to={`/summoner/${player.name}`} className="player-link">
                <img src={`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/profileicon/${player.profileIconId}.png`} alt="Profile Icon" className='profile-icon' />
                <span className="player-name">{player.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
