import React, { Component } from 'react';
import '../css/news.css';
import { Link } from 'react-router-dom'; 

class News extends Component {
  state = {
    tournament: {}
  }

  componentDidMount() {
    fetch('https://carxtours.com/api/tournaments/latest/')
      .then(res => res.json())
      .then(data => this.setState({ tournament: data }))
      .catch(err => console.log(err));
  }

  render() {
    const { tournament } = this.state;
    return (
      <div className='news'>
          <div className='text'>
            <p>Организатор: {tournament.short_org_name}</p>
            <h1>-</h1>
            <p>Название турнира: {tournament.tournament_name}</p>
            <h1>-</h1>
            <p>Карта: {tournament.map}</p>
            <h1>-</h1>
            <p>Дата: {tournament.date}</p>
          </div>
          <div className='image'>
            {tournament.image && <img src={`https://carxtours.com/api/tournaments/${tournament.image}`} alt='Tournament' />}
          </div>
          <div className='link'>
            <Link to={`/tournament/${tournament.id}`}>Перейти</Link>
          </div>
      </div>
    )
  }
};

export default News;
