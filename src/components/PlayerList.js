// src/components/PlayerList.js

import React, { useState, useEffect } from 'react';
import { fetchPlayers } from '../services/mlbService';
import PlayerItem from './PlayerItem';

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState('All');

  useEffect(() => {
    const getPlayers = async () => {
      try {
        const data = await fetchPlayers();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    getPlayers();
  }, []);

  const handlePositionChange = (event) => {
    setSelectedPosition(event.target.value);
  };

  const filteredPlayers = selectedPosition === 'All'
    ? players
    : players.filter(player => player.primaryPosition === selectedPosition);

  return (
    <div>
      <div className='form-select-wrapper'>
        <label htmlFor="position-select">Filter by Position: </label>
        <select className='form-select' id="position-select" value={selectedPosition} onChange={handlePositionChange}>
          <option value="All">All</option>
          <option value="Pitcher">Pitcher</option>
          <option value="Catcher">Catcher</option>
          <option value="First Base">First Base</option>
          <option value="Second Base">Second Base</option>
          <option value="Third Base">Third Base</option>
          <option value="Shortstop">Shortstop</option>
          <option value="Outfielder">Outfielder</option>
          <option value="Designated Hitter">Designated Hitter</option>
          {/* Add more positions as needed */}
        </select>
      </div>
      <div className='grid-container'>
        {filteredPlayers.map((player, index) => (
          <PlayerItem key={index} player={player} />
        ))}
      </div>
    </div>
  );
};

export default PlayerList;
