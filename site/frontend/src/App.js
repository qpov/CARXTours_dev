import './App.css';
import React from 'react';
import Header from './components/Header';
import News from './components/News';
import Tournaments from './components/Tournaments';
import Footer from './components/Footer';

class App extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        <News/>
        <Tournaments/>
        <Footer/>
      </div>
    )
  }
}

export default App;