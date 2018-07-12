import React, { Component } from 'react';
import RsvpList from './rsvps/RsvpList'
import TopicsList from './topics/TopicsList'
import {connect} from 'react-redux'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to the Meetup Mashup</h1>
        </header>
        
        <main>
          <RsvpList />
          <TopicsList />
        </main>
      </div>
    );
  }
}

export default App
