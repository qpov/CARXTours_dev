import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../css/tournaments.css';

class Tournaments extends Component {
  state = {
    tournaments: [],
  };

  componentDidMount() {
    fetch('https://carxtours.com/api/tournaments/four_latest/')
      .then(res => res.json())
      .then(data => this.setState({ tournaments: data }))
      .catch(err => console.log(err));
  }  

  render() {
    const { tournaments } = this.state;

    return (
      <div className='tournaments'>
        <div className='info'>
          <p>Дата</p>
          <h1 className='slash'>-</h1>
          <p>Организатор</p>
          <h1 className='slash'>-</h1>
          <p>Название турнира</p>
          <h1 className='slash'>-</h1>
          <p>Карта</p>
        </div>
        {tournaments.map((tournament) => (
          <div className='block' key={tournament.id}>
              <p className='date'>{tournament.date}</p>
              <p className='slash'>-</p>
              <p className='organization'>{tournament.short_org_name}</p>
              <p className='slash'>-</p>
              <p className='tourName'>{tournament.tournament_name}</p>
              <p className='slash'>-</p>
              <p className='map'>{tournament.map}</p>
          </div>
        ))}
        
        <div className='tournaments-button'>
          <Link to='/ivents'>Показать больше турниров</Link>
        </div>
      </div>
    );
  }
}

export default Tournaments;