// src/components/PlayerComparisonModal.js

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { fetchPlayerStats } from '../services/mlbService';

const PlayerComparisonModal = ({ isOpen, onRequestClose, player1, player2 }) => {
  const [stats1, setStats1] = useState(null);
  const [stats2, setStats2] = useState(null);
  
  useEffect(() => {
    if (player1 && player2) {
      const getPlayerStats = async () => {
        try {
          const data1 = await fetchPlayerStats(player1.id);
          const data2 = await fetchPlayerStats(player2.id);
          setStats1(data1);
          setStats2(data2);


        } catch (error) {
          console.error('Error fetching player stats:', error);
        }
      };

      getPlayerStats();
    }
  }, [player1, player2]);
  
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Player Comparison Modal">
      <div className="player-comparison-modal">
        <button onClick={onRequestClose}>Close</button>
        {player1 && player2 && (
          <>
            <div className="player-comparison">
              <div>
                <img src={player1.imageUrl} alt={player1.fullName} />
                <h3>{player1.fullName}</h3>
                <p>Position: {player1.primaryPosition}</p>
                <p>Team: {player1.currentTeam || 'N/A'}</p>
                <p>Birthdate: {new Date(player1.birthDate).toLocaleDateString()}</p>
                {stats1 && (
                  <div>
                    <h4>Statistics</h4>
                    <p>Home Runs: {stats1.homeRuns}</p>
                    <p>Hits: {stats1.hits}</p>
                    <p>Batting Average: {stats1.avg}</p>
                    <p>RBIs: {stats1.rbi}</p>
                    <p>Games Played: {stats1.gamesPlayed}</p>
                    <p>At Bats: {stats1.atBats}</p>
                    <p>Stolen Bases: {stats1.stolenBases}</p>
                  </div>
                )}
              </div>
              <div>
                <img src={player2.imageUrl} alt={player2.fullName} />
                <h3>{player2.fullName}</h3>
                <p>Position: {player2.primaryPosition}</p>
                <p>Team: {player2.currentTeam || 'N/A'}</p>
                <p>Birthdate: {new Date(player2.birthDate).toLocaleDateString()}</p>
                {stats2 && (
                  <div>
                    <h4>Statistics</h4>
                    <p>Home Runs: {stats2.homeRuns}</p>
                    <p>Hits: {stats2.hits}</p>
                    <p>Batting Average: {stats2.avg}</p>
                    <p>RBIs: {stats2.rbi}</p>
                    <p>Games Played: {stats2.gamesPlayed}</p>
                    <p>At Bats: {stats2.atBats}</p>
                    <p>Stolen Bases: {stats2.stolenBases}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default PlayerComparisonModal;
