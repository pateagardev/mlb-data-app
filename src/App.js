// src/App.js

import React from 'react';
import "./App.css";
import PlayerList from './components/PlayerList';


const App = () => (
  <div className="App">
    <h1>MLB Player Data</h1>
    <div className='container'>
      <PlayerList class="grid-container"/>
    </div> 
  </div>
);

export default App;
