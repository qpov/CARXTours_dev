import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import '../css/profile.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAlreadyOrganizer, setShowAlreadyOrganizer] = useState(false);
  const [shortOrgName, setShortOrgName] = useState('');
  const [fullOrgName, setFullOrgName] = useState('');

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
        console.log('Data from server:', data); // Добавлено для отладки
        setUser(data);
      })
      .catch(err => {
        console.error(err);
        navigate('/login');
      });
  }, []);

  const handleConfirm = () => {
    fetch('https://carxtours.com/api/auth/userprofile/update/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        status: 'Организатор',
        short_org_name: shortOrgName,
        full_org_name: fullOrgName,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setUser(data);
        setShowConfirm(false);
      })
      .catch(err => console.error(err));
  };

  const handleOrganizerClick = () => {
      if (user && user.userprofile && user.userprofile.status === 'Организатор') {
          setShowAlreadyOrganizer(true);
      } else {
          setShowConfirm(true);
      }
  };

  const handleLogout = () => {
    fetch('https://carxtours.com/api/auth/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Не удалось выйти из аккаунта');
        }
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userId');
        navigate('/login');
      })
      .catch(err => console.error(err));
  };  

  return (
    <div>
        <Header />
        {user && (
            <div className="userInfo">
                <p>Ник: {user.username}</p>
                <p>Регистрация: {new Date(user.date_joined).toLocaleDateString()}</p>
                {user.userprofile ? (
                    <>
                        <p>Статус: {user.userprofile.status}</p>
                        <div className='exit'>
                            <button onClick={handleLogout}>Выйти с аккаунта</button>
                        </div>
                        {user.userprofile.status === 'Организатор' ? (
                            <div className="organizer">
                                <p>Организация:</p>
                                <p>Сокращённое название: {user.userprofile.short_org_name}</p>
                                <p>Полное название: {user.userprofile.full_org_name}</p>
                                <Link to="/create">Создать турнир</Link>
                            </div>
                        ) : (
                            <React.Fragment>
                                <button onClick={handleOrganizerClick}>Получить статус организатора</button>
                                {showConfirm && (
                                    <div className="createOrganizer">
                                        <label>Сокращённое название организации:</label>
                                        <input value={shortOrgName} onChange={(e) => setShortOrgName(e.target.value)} />
                                        <label>Полное название организации:</label>
                                        <input value={fullOrgName} onChange={(e) => setFullOrgName(e.target.value)} />
                                        <p>Вы уверены, что хотите получить статус организатора?</p>
                                        <button className='yes' onClick={handleConfirm}>Да</button>
                                        <button className='no' onClick={() => setShowConfirm(false)}>Нет</button>
                                    </div>
                                )}
                                {showAlreadyOrganizer && (
                                    <div className="createOrganizer">
                                        <p>У вас уже есть статус организатора</p>
                                        <button onClick={() => setShowAlreadyOrganizer(false)}>OK</button>
                                    </div>
                                )}
                            </React.Fragment>
                        )}
                    </>
                ) : (
                    <>
                        <p>Статус: не установлен</p>
                        <div className='exit'>
                            <button onClick={handleLogout}>Выйти с аккаунта</button>
                        </div>
                        <button onClick={handleOrganizerClick}>Получить статус организатора</button>
                    </>
                )}
            </div>
        )}
    </div>
);
}
