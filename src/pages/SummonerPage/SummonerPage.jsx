// SummonerPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './SummonerPage.scss';

function SummonerPage() {
  const { summonerName } = useParams();
  const [summonerData, setSummonerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [autoUpdate, setAutoUpdate] = useState(true); // State to track auto update
  const apiKey = 'RGAPI-5d2057cd-7597-444d-9f57-53723049da67';
  const [commonPlayers, setCommonPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}?api_key=${apiKey}`);
        setSummonerData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching summoner:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [summonerName, apiKey]);

  useEffect(() => {
    if (summonerData && autoUpdate) { // Auto click update button if summonerData is available and autoUpdate is true
      handleUpdate();
      setAutoUpdate(false); // Disable auto update after the first click
    }
  }, [summonerData, autoUpdate]);

  const fetchMatches = async () => {
    try {
      const response = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${summonerData.puuid}/ids?endIndex=20&api_key=${apiKey}`);
      const matchIds = response.data || [];
      const matchDetailsPromises = matchIds.map(async matchId => {
        try {
          const matchResponse = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}`);
          return matchResponse.data;
        } catch (error) {
          console.error(`Error fetching match details for match ID ${matchId}:`, error);
          return null;
        }
      });

      const matchDetails = await Promise.all(matchDetailsPromises);
      setMatches(matchDetails.filter(match => match !== null));

      // Analyze matches for common players
      const playerStats = {};
      matchDetails.forEach(match => {
        match.info.participants.forEach(participant => {
          if (participant.summonerName !== summonerName) {
            if (!playerStats[participant.summonerName]) {
              playerStats[participant.summonerName] = { wins: 0, losses: 0 };
            }
            if (participant.win) {
              playerStats[participant.summonerName].wins++;
            } else {
              playerStats[participant.summonerName].losses++;
            }
          }
        });
      });

      // Find most common players
      const sortedPlayers = Object.keys(playerStats).sort((a, b) => playerStats[b].wins + playerStats[b].losses - playerStats[a].wins - playerStats[a].losses);
      const topCommonPlayers = sortedPlayers.slice(0, 5).map(player => ({
        name: player,
        wins: playerStats[player].wins,
        losses: playerStats[player].losses
      
      }));
      setCommonPlayers(topCommonPlayers);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const handleUpdate = () => {
    fetchMatches();
  };

  const getMatchResult = (match, summonerName) => {
    const participant = match.info.participants.find(participant => participant.summonerName === summonerName);
    if (!participant) return null;
    return participant.win ? 'Victory' : 'Defeat';
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!summonerData) {
    return <div className="summoner-page">Summoner not found</div>; // Render this if summoner data is null or empty
  }

  return (
    <div className="summoner-page">
      <div className="left-sidebar">
        <div className="glitch" data-text={summonerData.name}>{summonerData.name}</div>
        <p className="summoner-level">Level: {summonerData.summonerLevel}</p>
        <img src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/profileicon/${summonerData.profileIconId}.png`} alt="Profile Icon" className="profile-icon" />
        <button onClick={handleUpdate} className="update-button">Update</button>
      </div>
      <div className="right-content">
        <h2>Last 20 Matches:</h2>
        <ul className="match-list">
          {matches.map(match => (
            <li key={match.metadata.matchId} className={`match-item ${getMatchResult(match, summonerName) === 'Victory' ? 'victory' : 'defeat'}`}>
            <p>Match ID: {match.metadata.matchId}</p>
            
            {match.info.gameMode === 'CLASSIC' && match.info.queueId === 400 && <p>Game Type: Normal </p>}
            {match.info.gameMode === 'CLASSIC' && match.info.queueId === 450 && <p>Game Type: ARAM</p>}
            {match.info.gameMode === 'CLASSIC' && match.info.queueId === 440 && <p>Game Type: Flex Queue</p>}
            {match.info.gameMode === 'CLASSIC' && match.info.queueId === 420 && <p>Game Type: Solo/Duo Queue</p>}
            <b className='result'>{getMatchResult(match, summonerName)}</b>
          <div className='participant-full'>
            <div className="participant-info">
              {match.info.participants.map(participant => {
                if (participant.summonerName === summonerName) {
                  return (
                    <div key={participant.summonerName}>
                      <div className='champion-wrapper'>
                        <b className="champion-level">{participant.champLevel}</b>
                      </div>
                      <p>
                      <img src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${participant.championName}.png`} alt="Champion Icon" className="champion-icon" />
                        <b>{participant.championName}</b>
                        <br />
                        {participant.kills}/<b className='champion-death'>{participant.deaths}</b>/{participant.assists} 
                        <br />
                        KDA: {((participant.kills + participant.assists) / participant.deaths).toFixed(1)}
                        <br/>
                      </p>
                      <div className='champion-items'>
                        {Array.from({ length: 7 }, (_, i) => (
                          <div className={`item-wrapper${!participant[`item${i}`] ? ' no-item' : ''}`} key={`item-${i}`}>
                            {participant[`item${i}`] ? (
                              <img
                                src={`https://ddragon.leagueoflegends.com/cdn/14.7.1/img/item/${participant[`item${i}`]}.png`}
                                alt={`Item ${i}`}
                                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentNode.classList.add('no-item'); }}
                              />
                            ) : (
                              <div className="placeholder"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
            <div className='full-team'>
            <div className="teammates">
                      <h3>Teammates:</h3>
                      {match.info.participants
                        .filter(participant => participant.summonerName !== summonerName) // Exclude the current player
                        .slice(0, 4) // Get the top 4 teammates
                        .map(participant => (
                          <p key={participant.summonerName}>{participant.summonerName}
                          </p>
                          
                        ))}{summonerData.name}
                    </div>
                    <div className="enemy-teammates">
                      <h3>Enemy Teammates:</h3>
                      {match.info.participants
                        .filter(participant => participant.summonerName !== summonerName) // Exclude the current player
                        .slice(-5) // Get the last 5 enemy teammates
                        .map(participant => (
                          <p key={participant.summonerName}>{participant.summonerName}</p>
                        ))}
                    </div>
            </div>
            </div>
          </li>
          ))}
        </ul>
        <div className="common-players">
          <h2>Common Players:</h2>
          <ul>
            {commonPlayers.map((player, index) => (
              <li key={index}>
                <p>{player.name}</p>
                <p>Wins: {player.wins}</p>
                <p>Losses: {player.losses}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SummonerPage;
