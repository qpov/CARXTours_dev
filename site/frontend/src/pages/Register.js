import React, { useState } from 'react';
import { Link } from "react-router-dom";
import '../css/loginAndRegister.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const [isAdded, setIsAdded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('https://carxtours.com/api/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      window.location.href = '/login';
    })
    .catch((error) => {
      console.error('Error:', error);
      if (error.status === 400) {
        setError('Данное имя пользователя уже занято');
        setIsAdded(true);
        setTimeout(() => setIsVisible(true), 100); // задержка для плавного появления ошибки
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            setError(null);
            setIsAdded(false);
          }, 1000); // задержка для плавного исчезновения ошибки
        }, 5000); // время показа ошибки
      }
    });
  };

  return (
    <div>
      <div className='registerPage'>

        <div className='containerRegisterText'>
          <div className='containerLoginBack'>
            <Link to='/login'>Назад</Link>
          </div>
          <div className='containerRegisterAuth'>
            Регистрация
          </div>
          <form onSubmit={handleSubmit}>
            <p className='containerRegisterTextUsername'>Имя пользователя</p>
            <input value={username} onChange={(e) => setUsername(e.target.value)} />

            <p className='containerRegisterTextPassword'>Пароль</p>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <div className='buttonContainer'>
              <button type="submit">
                Зарегистрироваться
              </button>
                <p>После регистрации нужно будет авторизоваться</p>
            </div>

            <div className='errorMessageContainer'>
              {isAdded && <p className={`errorMessage ${isVisible ? 'visible' : ''}`}>{error}</p>}
            </div>

          </form>
        </div>
        
      </div>
    </div>
  );
}
