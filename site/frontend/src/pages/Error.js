import React, { Component } from 'react'
import Header from '../components/Header';
import '../css/error.css';

export default class Error extends Component {
  render() {
    return (
      <div>
        
        <Header/>

        <div className='error'>
            <p>Если вы сюда попали, то страница ещё не готова</p>
        </div>

      </div>
    )
  }
}
