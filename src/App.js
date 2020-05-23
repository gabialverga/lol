import React from 'react';
import './App.css';
import Home from './home.js';
import ListDataChampions from './listDataChampions.js';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/busca" exact component={ListDataChampions} />
          <Redirect exact from="/busca" to="/" />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
