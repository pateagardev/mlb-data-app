// src/App.js

// The app allows users to:

// Search for MLB players.
// Select two players to compare.
// View detailed statistics for the selected players in a modal dialog.

import React from 'react';
import "./App.css";
import PlayerList from './components/PlayerList';


const App = () => (
  <div className="App">
    <div className='mlb-header'>
      <h1>MLB Player Data</h1>
    </div>
    <div className='container'>
      <PlayerList class="grid-container"/>
    </div> 
  </div>
);

export default App;
