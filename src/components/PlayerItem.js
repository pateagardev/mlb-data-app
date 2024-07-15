// src/components/PlayerItem.js

import React, { useState, useEffect } from 'react';
import { fetchPlayerStats } from '../services/mlbService';

const PlayerItem = ({ player }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const getPlayerStats = async () => {
      try {
        const data = await fetchPlayerStats(player.id);
        setStats(data);
      } catch (error) {
        console.error('Error fetching player stats:', error);
      }
    };

    getPlayerStats();
  }, [player.id]);

  return (
    <div className='grid-item'>
      <img src={player.imageUrl} alt={player.fullName} />
      <div className='card-item'>
        <h3 className='player-name'>{player.fullName}</h3>
        <p>Position: {player.primaryPosition}</p>
        <p>Team: {player.currentTeam || 'N/A'}</p>
        {stats && (
          <div>
            <h4 className='stats-title'>Statistics</h4>
            <p><strong>Home Runs:</strong> {stats.homeRuns}</p>
            <p><strong>Hits:</strong> {stats.hits}</p>
            <p><strong>Batting Average:</strong> {stats.avg}</p>
            <p><strong>RBIs:</strong> {stats.rbi}</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default PlayerItem;
