import React, { useState, useCallback, useRef } from 'react';

import { Switch, Route } from 'react-router-dom';

import Navigation from "./components/Navigation"
import GameofLife from "./components/GameofLife"
import Home from "./components/Home"

import './App.css'

function App() {
  
  return (
    <div className="App">
      <Navigation />
      
      <Switch>
        <Route exact
          path="/" component={Home} />
        <Route path="/gameoflife" component={GameofLife} />
      </Switch>
   
    </div>
  );
}
export default App;