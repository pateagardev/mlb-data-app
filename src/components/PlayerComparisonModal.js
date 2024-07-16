// src/components/PlayerComparisonModal.js

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { fetchPlayerStats } from '../services/mlbService';


// Set the app element for accessibility
Modal.setAppElement('#root');
const PlayerComparisonModal = ({ isOpen, onRequestClose, player1, player2 }) => {
  const [stats1, setStats1] = useState(null);
  const [stats2, setStats2] = useState(null);

  // Fetch player stats when the modal opens and players are selected
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

  // Handle closing the modal and clearing selected players
  const handleClose = () => {
    onRequestClose();
    document.getElementById('player1-select').value = '';
    document.getElementById('player2-select').value = '';
  };

  // Checks if the player is a pitcher
  const isPitcher = (player) => {
    return player.primaryPosition === 'Pitcher';
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Player Comparison Modal"
    >
      <div className="player-comparison-modal">
        <button onClick={handleClose} className="close-button">Close</button>
        {player1 && player2 && (
            <div className="player-comparison">
              <div>
                <img src={player1.imageUrl} alt={player1.fullName} />
                <div className='player-card'>
                  <h3 className='player-name'>{player1.fullName}</h3>
                  <p>Position: {player1.primaryPosition}</p>
                  <p>Team: {player1.currentTeam || 'N/A'}</p>
                  <p>Birthdate: {new Date(player1.birthDate).toLocaleDateString()}</p>
                  {stats1 && (
                    <div>
                      <h4 className='stats-title'>Statistics</h4>
                      {isPitcher(player1) ? (
                        <div>
                          <p>Wins: {stats1.wins}</p>
                          <p>Losses: {stats1.losses}</p>
                          <p>ERA: {stats1.era}</p>
                          <p>Strikeouts: {stats1.strikeouts}</p>
                        </div>
                      ) : (
                        <div>
                          <p>Home Runs: {stats1.homeRuns}</p>
                          <p>Hits: {stats1.hits}</p>
                          <p>Batting Average: {stats1.avg}</p>
                          <p>RBIs: {stats1.rbi}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
              </div>
              <div>
                <img src={player2.imageUrl} alt={player2.fullName} />
                <div className='player-card'>
                  <h3 className='player-name'>{player2.fullName}</h3>
                  <p>Position: {player2.primaryPosition}</p>
                  <p>Team: {player2.currentTeam || 'N/A'}</p>
                  <p>Birthdate: {new Date(player2.birthDate).toLocaleDateString()}</p>
                  {stats2 && (
                    <div>
                      <h4 className='stats-title'>Statistics</h4>
                      {isPitcher(player2) ? (
                        <div>
                          <p>Wins: {stats2.wins}</p>
                          <p>Losses: {stats2.losses}</p>
                          <p>ERA: {stats2.era}</p>
                          <p>Strikeouts: {stats2.strikeouts}</p>
                        </div>
                      ) : (
                        <div>
                          <p>Home Runs: {stats2.homeRuns}</p>
                          <p>Hits: {stats2.hits}</p>
                          <p>Batting Average: {stats2.avg}</p>
                          <p>RBIs: {stats2.rbi}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
              </div>
            </div>
        )}
      </div>
    </Modal>
  );
};

export default PlayerComparisonModal;
