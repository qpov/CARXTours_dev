import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import '../css/loginAndRegister.css';

async function login(username, password) {
  const response = await fetch('https://carxtours.com/api/auth/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data.userId)
    return { token: data.token, userId: data.userId };
  } else {
    throw new Error('Failed to log in');
  }
}

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [errorMessageClass, setErrorMessageClass] = useState('');
  const { setAuthToken, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      setErrorMessageClass('visible');
      const timer = setTimeout(() => {
        setErrorMessageClass('');
      }, 4000); // сообщение об ошибке исчезнет через 4 секунды

      return () => {
        clearTimeout(timer);
      }
    }
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Обновление состояние ошибки
    try {
      const result = await login(username, password);
      if (result.token) {
        setAuthToken(result.token);
        setIsLoggedIn(true);
        navigate('/');
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('isLoggedIn', true);
      }
    } catch (error) {
      setError('Неверное имя пользователя или пароль');
    }
  };

  return (
    <div className='loginPage'>
      <div className='containerLoginText'>
        <div className='containerMainBack'>
          <Link to={'/'}>Главная</Link>
        </div>
        <p className='containerLoginAuth'>Авторизация</p>
        <p className='containerLoginTextUsername'>Имя пользователя</p>
        <input value={username} onChange={(e) => setUsername(e.target.value)}></input>
        <p className='containerLoginTextPassword'>Пароль</p>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <div className='errorMessageContainer'>
          <p className={`errorMessage ${errorMessageClass}`}>{error}</p>
        </div>
        <div className='containerButton'>
          <button type="submit" onClick={handleLogin}>
            Войти
          </button>
        </div>
      </div>

      <div className='containerNoRegAndRegister'>
        <p className='containerNoReg'>Не зарегистрированы?</p>
        <div className='containerLoginRegister'>
          <Link to={'/register'}>Регистрация</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;