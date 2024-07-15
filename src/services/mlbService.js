// src/services/mlbService.js

import axios from 'axios';

const BASE_URL = 'https://statsapi.mlb.com/api/v1';

export const fetchPlayers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/sports/1/players`);
    return response.data.people.map(player => ({
      id: player.id,
      fullName: player.fullName,
      primaryPosition: player.primaryPosition.name,
      currentTeam: player.currentTeam ? player.currentTeam.name : 'N/A',
      imageUrl: `https://securea.mlb.com/mlb/images/players/head_shot/${player.id}.jpg`
    }));
  } catch (error) {
    console.error('Error fetching player data:', error);
    throw error;
  }
};

export const fetchPlayerStats = async (playerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/people/${playerId}/stats?stats=season`);
    const stats = response.data.stats[0]?.splits[0]?.stat || {};
    return {
      homeRuns: stats.homeRuns || 'N/A',
      hits: stats.hits || 'N/A',
      avg: stats.avg || 'N/A',
      rbi: stats.rbi || 'N/A'
    };
  } catch (error) {
    console.error(`Error fetching stats for player ID ${playerId}:`, error);
    return {
      homeRuns: 'N/A',
      hits: 'N/A',
      avg: 'N/A',
      rbi: 'N/A'
    };
  }
};
