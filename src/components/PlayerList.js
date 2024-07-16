// src/components/PlayerList.js

import React, { useState, useEffect } from 'react';
import { fetchPlayers, fetchPlayerStats } from '../services/mlbService';
import PlayerComparisonModal from './PlayerComparisonModal';

const PlayerList = () => {
  // Updates the players state with the fetched data.
  const [players, setPlayers] = useState([]);
  // Stores the list of players fetched from the MLB API.
  const [searchTerm, setSearchTerm] = useState('');
  // Stores the current search term entered by the user.
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  // player1 and player2: Store the selected players for comparison.
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Controls the visibility of the comparison modal.
  const [filter, setFilter] = useState('all'); 

  // useEffect Hooks: Fetches the player data and their statistics when the component mounts.
  useEffect(() => {
    const getPlayers = async () => {
      try {
        const data = await fetchPlayers();
        const playersWithStats = await Promise.all(
          data.map(async (player) => {
            const stats = await fetchPlayerStats(player.id);
            return { ...player, stats };
          })
        );
        console.log(playersWithStats); // Debugging: Log player data
        setPlayers(playersWithStats);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    getPlayers();
  }, []);

  // Update the state with the selected players.
  const handlePlayer1Change = (event) => {
    const selectedPlayer = players.find(player => player.id === parseInt(event.target.value));
    setPlayer1(selectedPlayer);
  };
  
  const handlePlayer2Change = (event) => {
    const selectedPlayer = players.find(player => player.id === parseInt(event.target.value));
    setPlayer2(selectedPlayer);
  };

  // Updates the search term state.
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Clears the selected players and resets the dropdown menus.
  const clearComparison = () => {
    setPlayer1(null);
    setPlayer2(null);
    document.getElementById('player1-select').value = '';
    document.getElementById('player2-select').value = '';
  };

  // Opens the comparison modal if both players are selected.
  const openModal = () => {
    if (player1 && player2) {
      setIsModalOpen(true);
    } else {
      alert("Pick players to compare")
    }
  };

  // Closes the modal and clears the selected players.
  const closeModal = () => {
    setIsModalOpen(false);
    clearComparison();
  };

  // Checks if the player is a pitcher
  const isPitcher = (player) => {
    return player.primaryPosition === 'Pitcher';
  }; 

  // Filter players based on search term and filter selection
  const filteredPlayers = players.filter(player => {
    const matchesSearchTerm = player.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'pitchers' && isPitcher(player)) || (filter === 'hitters' && !isPitcher(player));
    return matchesSearchTerm && matchesFilter;
  });

  // Handle filter change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
 

  // Renders a search input, dropdowns for selecting players, buttons for clearing the selection and opening the modal, and the list of filtered players.
  return (
    <div className="player-list-container">
      <div className='nav-bar'>
        <div className="search-bar">
          <label htmlFor="search-input">Search Players: </label>
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="filter-bar">
          <label htmlFor="filter-select">Filter: </label>
          <select id="filter-select" value={filter} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="pitchers">Pitchers</option>
            <option value="hitters">Hitters</option>
          </select>
        </div>
        <div className="select-player">
          <label htmlFor="player1-select">Select Player 1: </label>
          <select id="player1-select" onChange={handlePlayer1Change}>
            <option value="">Select a player</option>
            {filteredPlayers.map(player => (
              <option key={player.id} value={player.id}>{player.fullName}</option>
            ))}
          </select>
        </div>
        <div className="select-player">
          <label htmlFor="player2-select">Select Player 2: </label>
          <select id="player2-select" onChange={handlePlayer2Change}>
            <option value="">Select a player</option>
            {filteredPlayers.map(player => (
              <option key={player.id} value={player.id}>{player.fullName}</option>
            ))}
          </select>
        </div>
        <button onClick={openModal}>Compare Players</button>
      </div>
      <PlayerComparisonModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        player1={player1}
        player2={player2}
      />
      <div className="player-grid">
        {filteredPlayers.map((player, index) => (
          <div key={index} className="player-item">
            <img src={player.imageUrl} alt={player.fullName} />
            <div className='card-item'>
              <h3 className='player-name'>{player.fullName}</h3>
              <p>Position: {player.primaryPosition}</p>
              <p>Team: {player.currentTeam || 'N/A'}</p>
              {player.stats && (
                <div>
                  <h4 className='stats-title'>Statistics</h4>
                  {isPitcher(player) ? (
                    <div>
                      <p>Wins: {player.stats.wins}</p>
                      <p>Losses: {player.stats.losses}</p>
                      <p>ERA: {player.stats.era}</p>
                      <p>Strikeouts: {player.stats.strikeouts}</p>
                    </div>
                  ) : (
                    <div>
                      <p>Home Runs: {player.stats.homeRuns}</p>
                      <p>Hits: {player.stats.hits}</p>
                      <p>Batting Average: {player.stats.avg}</p>
                      <p>RBIs: {player.stats.rbi}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerList;
