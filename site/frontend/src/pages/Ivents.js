import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import '../css/ivents.css';

const Ivents = () => {
  const [iventsData, setIventsData] = useState([]);

  useEffect(() => {
    fetch('https://carxtours.com/api/tournaments/create/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Не удалось получить данные');
        }
        return response.json();
      })
      .then(data => setIventsData(data.reverse()))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <Header />
      <div className="iventsContainer">
        <div className='iventsFirstText'>
          <p>Организатор | Название турнира / Карта | Дата (Год - Месяц - День)</p>
        </div>

        {iventsData.map((ivents, index) => (
          <div key={index} className='iventsBlock'>
            <div className='iventsBlockContent'>
              <p className='short_org_name'>{ivents.short_org_name}</p>
              <p className='tourNameAndMap'>{ivents.tournament_name} / {ivents.map}</p>
              <p className='iventsBlockDate'>{ivents.date}</p>
            </div>
            <Link to={`/tournament/${ivents.id}`}>Открыть</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Ivents;
