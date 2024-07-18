// src/components/PlayerList.js

import React, { useState, useEffect } from 'react';
import { fetchPlayers, fetchPlayerStats, fetchTeams } from '../services/mlbService';
import PlayerComparisonModal from './PlayerComparisonModal';

const PlayerList = () => {
  // Updates the players state with the fetched data.
  const [players, setPlayers] = useState([]);
  // Stores the list of players fetched from the MLB API.
  const [searchTerm, setSearchTerm] = useState('');
  // Stores the current search term entered by the user.
  const [player1, setPlayer1] = useState(null);
    // player1 and player2: Store the selected players for comparison.
  const [player2, setPlayer2] = useState(null);
  // Controls the visibility of the comparison modal.
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Filters the Data
  const [filter, setFilter] = useState('all'); 
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [teams, setTeams] = useState([]);

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

    const getTeams = async () => {
      try {
        const teamsData = await fetchTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    getPlayers();
    getTeams();
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

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilter('all');
    setSelectedPosition('All');
    setSelectedTeam('All');
    clearComparison();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePositionChange = (event) => {
    setSelectedPosition(event.target.value);
  };
  
  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  // Checks if the player is a pitcher
  const isPitcher = (player) => {
    return player.primaryPosition === 'Pitcher';
  }; 

  // Filter players based on search term and filter selection
  const filteredPlayers = players.filter(player => {
    const matchesSearchTerm = player.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'pitchers' && isPitcher(player)) || (filter === 'hitters' && !isPitcher(player));
    const matchesTeam = selectedTeam === 'All' || player.currentTeam === selectedTeam;
    const matchesPosition = selectedPosition === 'All' || player.primaryPosition === selectedPosition;
    return matchesSearchTerm && matchesFilter && matchesPosition && matchesTeam;
  });

  // Handle filter change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
 

  // Renders a search input, dropdowns for selecting players, buttons for clearing the selection and opening the modal, and the list of filtered players.
  return (
    <div className="player-list-container">
      <div className='nav-bar'>
        <div className='tools-top'>
          <div className="search-bar">
            <label htmlFor="search-input">Search Players: </label>
            <input
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="filter-team">
            <label htmlFor="team-select">Filter by Team: </label>
            <select id="team-select" value={selectedTeam} onChange={handleTeamChange}>
              <option value="All">All Teams</option>
              {teams.map(team => (
                <option key={team.id} value={team.name }>{team.name}</option>
              ))}
            </select>
          </div>
          <div className='filter-position'>
            <label htmlFor="position-select">Filter by Position: </label>
            <select id="position-select" value={selectedPosition} onChange={handlePositionChange}>
              <option value="All">All</option>
              <option value="Pitcher">P</option>
              <option value="Catcher">C</option>
              <option value="First Base">1B</option>
              <option value="Second Base">2B</option>
              <option value="Third Base">3B</option>
              <option value="Shortstop">SS</option>
              <option value="Outfielder">OF</option>
              <option value="Designated Hitter">DH</option>
            </select>
          </div>
          <div className="filter-bar">
            <label htmlFor="position-select">Filter by Hitters or Pitcher: </label>
            <select id="filter-select" value={filter} onChange={handleFilterChange}>
              <option value="all">All</option>
              <option value="pitchers">Pitchers</option>
              <option value="hitters">Hitters</option>
            </select>
          </div>
          <div className='clear-all'>
            <button onClick={clearAllFilters}>Clear All</button> {/* Clear All button */}
          </div>
        </div>
        <div className='compater-wrap'>
          <h4 className='player-compare'>Compare a Player</h4>
        </div>
        <div className='tools-bottom'>
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
