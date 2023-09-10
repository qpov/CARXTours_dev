import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../css/create.css';

export default function Create() {
  const [shortOrgName, setShortOrgName] = useState('');
  const [fullOrgName, setFullOrgName] = useState('');
  const [tournamentName, setTournamentName] = useState('');
  const [date, setDate] = useState('');
  const [map, setMap] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [task, setTask] = useState('');
  const [example, setExample] = useState('');
  const [reglament, setReglament] = useState('');
  const [visualReglament, setVisualReglament] = useState('');
  const [maxPilots, setMaxPilots] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isImageSelected, setIsImageSelected] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://carxtours.com/api/auth/userprofile/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Не авторизован');
        }
        return response.json();
      })
      .then(data => {
        setShortOrgName(data.userprofile.short_org_name);
        setFullOrgName(data.userprofile.full_org_name);
      })
      .catch(err => {
        console.error(err);
        navigate('/login');
      });
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsImageSelected(true);
      setImageFile(file);
    } else {
      setIsImageSelected(false);
      setImageFile(null);
    }
  };

  const handleTournamentNameChange = (e) => {
    setTournamentName(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleMapChange = (e) => {
    setMap(e.target.value);
  };

  const handleMapLinkChange = (e) => {
    setMapLink(e.target.value);
  };

  const handleTaskChange = (e) => {
    setTask(e.target.value);
  };

  const handleExampleChange = (e) => {
    setExample(e.target.value);
  };

  const handleReglamentChange = (e) => {
    setReglament(e.target.value);
  };

  const handleVisualReglamentChange = (e) => {
    setVisualReglament(e.target.value);
  };

  const handleMaxPilotsChange = (e) => {
    const value = e.target.value;
    setMaxPilots(value === '' ? null : value);
  };

  const handleTournamentCreate = () => {
    // Проверка выбрано ли изображение
    if (!isImageSelected) {
      alert('Пожалуйста, выберите изображение.');
      return;
    }

    const data = new FormData();
    data.append('owner', localStorage.getItem('userId'));
    data.append('short_org_name', shortOrgName);
    data.append('full_org_name', fullOrgName);
    data.append('tournament_name', tournamentName);
    data.append('date', date);
    data.append('map', map);
    data.append('map_link', mapLink);
    data.append('task', task);
    data.append('example', example);
    data.append('reglament', reglament);
    data.append('visual_reglament', visualReglament);

    if (maxPilots !== '') {
      data.append('max_pilots', maxPilots);
    }

    if (imageFile) {
      data.append('image', imageFile);
    }

    fetch('https://carxtours.com/api/tournaments/create/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
      body: data,
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            console.error(text);
            throw new Error('Ошибка при создании турнира');
          });
        }
        return response.json();
      })
      .then(data => {
        navigate(`/tournament/${data.id}`);
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <Header />
      <div className='create'>
        <p>Сокращённое название организации: {shortOrgName}</p>
        <p>Полное название организации: {fullOrgName}</p>
        <div className='tour_name'>
          <label>Название турнира:</label>
          <input value={tournamentName} onChange={handleTournamentNameChange} placeholder='Обязательно'/>
        </div>
        <div className='tour_date'>
          <label>Дата проведения:</label>
          <input type="date" value={date} onChange={handleDateChange} placeholder='Обязательно'/>
        </div>
        <div className='tour_map'>
          <label>Карта:</label>
          <input value={map} onChange={handleMapChange} placeholder='Обязательно'/>
        </div>
        <div className='tour_maplink'>
          <label>Ссылка на карту (рекомендуется использовать Google Disk):</label>
          <input value={mapLink} onChange={handleMapLinkChange} />
        </div>
        <div className='tour_example'>
          <label>Примерный проезд (ссылка на YouTube):</label>
          <input value={example} onChange={handleExampleChange} placeholder='Обязательно'/>
        </div>
        <div className='tour_task'>
          <label>Судейское задание:</label>
          <textarea value={task} onChange={handleTaskChange} placeholder='Обязательно'/>
        </div>
        <div className='tour_reglament'>
          <label>Регламент:</label>
          <textarea value={reglament} onChange={handleReglamentChange} placeholder='Обязательно'/>
        </div>
        <div className='tour_visual_reglament'>
          <label>Визуальный регламент:</label>
          <textarea value={visualReglament} onChange={handleVisualReglamentChange} />
        </div>
        <div className='tour_pilots'>
          <label>Максимальное кол-во пилотов (оставьте поле пустым если ограничение не нужно):</label>
          <input value={maxPilots} onChange={handleMaxPilotsChange} />
        </div>
        <div className='create_image'>
          <label>(Обязательно) Баннер:</label>
          <input type='file' accept="image/*" onChange={handleImageChange} />
        </div>
        <div className='tour_create'>
          <button onClick={handleTournamentCreate}>Создать турнир</button>
        </div>
      </div>
    </div>
  );
}
