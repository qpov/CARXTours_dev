import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import '../css/tournamentPage.css';

function TournamentPage() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [buttonText, setButtonText] = useState('Участвовать');
  const [isFull, setIsFull] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tournamentName, setTournamentName] = useState('');
  const [mapName, setMapName] = useState('');
  const [date, setDate] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [example, setExample] = useState('');
  const [task, setTask] = useState('');
  const [reglament, setReglament] = useState('');
  const [visualReglament, setVisualReglament] = useState('');
  const [maxPilots, setMaxPilots] = useState('');
  const [try1Values, setTry1Values] = useState({});
  const [try2Values, setTry2Values] = useState({});

  useEffect(() => {
    fetch(`https://carxtours.com/api/tournaments/detail/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка при загрузке турнира');
        }
        return response.json();
      })
      .then(data => {
        setTournament(data);
        setTournamentName(data.tournament_name);
        setMapName(data.map);
        setDate(data.date);
        setMapLink(data.map_link);
        setExample(data.example);
        setTask(data.task);
        setReglament(data.reglament);
        setVisualReglament(data.visual_reglament);
        setMaxPilots(data.max_pilots !== null ? String(data.max_pilots) : '');
        if (data.participants && data.max_pilots !== null && data.participants.length >= data.max_pilots) {
          setIsFull(true);
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    const userId = parseInt(localStorage.getItem('userId'), 10);
    if (tournament && tournament.participants && tournament.participants.some(participant => participant.user.id === userId)) {
      setIsParticipating(true);
      setButtonText('Вы уже участвуете');
    }
    if (tournament && tournament.owner === userId) {
      setIsOwner(true);
    }
  }, [tournament]);

  const handleParticipate = () => {
    const userId = localStorage.getItem('userId');
  
    if (!userId) {
      console.error('Ошибка: userId не найден');
      return;
    }
  
    if (
      tournament.participants &&
      tournament.participants.some(
        participant => participant.user.id === parseInt(userId, 10) && participant.tournament === parseInt(id, 10)
      )
    ) {
      setIsParticipating(true);
      setButtonText('Вы уже участвуете');
      return;
    }
  
    fetch('https://carxtours.com/api/tournaments/participant/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ user_id: parseInt(userId, 10), tournament: parseInt(id, 10) })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка при добавлении участника');
        }
        return response.json();
      })
      .then(participantData => {
        console.log('Участник успешно добавлен');
        console.log('Имя пользователя:', participantData.user.username);
  
        const newParticipant = {
          id: participantData.id,
          user: {
            id: participantData.user.id,
            username: participantData.user.username
          },
          tournament: parseInt(id, 10)
        };
        const newParticipants = [
          ...tournament.participants,
          newParticipant
        ];
        if (tournament.max_pilots !== null && newParticipants.length >= tournament.max_pilots) {
          setIsFull(true);
        }
        setTournament(prevTournament => ({
          ...prevTournament,
          participants: newParticipants
        }));
        setIsParticipating(true);
        setButtonText('Вы уже участвуете');
  
        // Обновление состояния турнира с новым списком участников
        setTournament(prevTournament => ({
          ...prevTournament,
          participants: newParticipants
        }));
      })
      .catch(err => console.error(err));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedTournament = {
      tournament_name: tournamentName,
      map: mapName,
      date: date,
      map_link: mapLink,
      task: task,
      reglament: reglament,
      visual_reglament: visualReglament,
      max_pilots: maxPilots !== '' ? parseInt(maxPilots, 10) : null,
      short_org_name: tournament.short_org_name,
      full_org_name: tournament.full_org_name,
      example: example,
      owner: tournament.owner,
    };
    
    fetch(`https://carxtours.com/api/tournaments/detail/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updatedTournament)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => Promise.reject(err));
      }
      return response.json();
    })
    .then(data => {
      setTournament(data);
      setIsEditing(false);
      console.log('Данные турнира успешно обновлены');
    })
    .catch(err => console.error(err));
  };

  const handleDeleteParticipant = (participantId, tournamentId) => {
    fetch(`https://carxtours.com/api/tournaments/participant/${participantId}/tournament/${tournamentId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при удалении участника');
      }
      if(response.status === 204) {
        return response;
      }
      return response.json();
    })
    .then(data => {
      const updatedParticipants = tournament.participants.filter(participant => participant.user.id !== participantId);
      setTournament({ ...tournament, participants: updatedParticipants });
      console.log('Участник успешно удален');
    })
    .catch(err => console.error(err));
  };

  const handleUpdateParticipant = (participantId, tournamentId) => {
    const try1 = try1Values[participantId];
    const try2 = try2Values[participantId];

    if (try1 === '' && try2 === '') {
      console.error('Нельзя отправить пустые значения try1 и try2');
      return;
    }

    const updatedData = {
      tournament: tournamentId,
      try1: try1 !== '' ? try1 : undefined,
      try2: try2 !== '' ? try2 : undefined
    };

    fetch(
      `https://carxtours.com/api/tournaments/update/${tournamentId}/participants/${participantId}/`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData)
      }
    )
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка при обновлении участника');
        }
        return response.json();
      })
      .then(data => {
        const updatedParticipants = tournament.participants.map(participant =>
          participant.id === participantId ? data : participant
        );
        setTournament({ ...tournament, participants: updatedParticipants });
        console.log('Данные участника успешно обновлены');
        setTry1Values(prevState => {
          const newState = { ...prevState };
          delete newState[participantId];
          return newState;
        });
        setTry2Values(prevState => {
          const newState = { ...prevState };
          delete newState[participantId];
          return newState;
        });
      })
      .catch(err => console.error(err));
  };
  

  if (!tournament) {
    return (
      <div>
        <Header />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div key="tournamentPage" className='tournamentPage'>
      <Header />

      <div className='page'>

        {tournament.task && (
          <div className='task' key="task">
            <p className='bold'>Судейское задание:</p>
            <p>{tournament.task}</p>
          </div>
        )}

        {tournament.reglament && (
          <div className='reglament' key="reglament">
            <p className='bold'>Регламент:</p>
            <p>{tournament.reglament}</p>
          </div>
        )}

        {tournament.visual_reglament && (
          <div className='visual_reglament' key="visual-reglament">
            <p className='bold'>Визуальный регламент:</p>
            <p>{tournament.visual_reglament}</p>
          </div>
        )}

        {isEditing && (
          <div className='edit-fields' key="edit-fields">

            <div className='tourNameEdit'>
              <label htmlFor='tournamentName'>Название турнира:</label>
              <input
                type='text'
                id='tournamentName'
                value={tournamentName}
                onChange={e => setTournamentName(e.target.value)}
              />
            </div>

            <div className='mapNameEdit'>
              <label htmlFor='mapName'>Название карты:</label>
              <input
                type='text'
                id='mapName'
                value={mapName}
                onChange={e => setMapName(e.target.value)}
              />
            </div>

            <div className='dateEdit'>
              <label htmlFor='date'>Дата проведения:</label>
              <input
                type='date'
                id='date'
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>

            <div className='mapLinkEdit'>
              <label htmlFor='mapLink'>Ссылка на карту:</label>
              <input
                type='text'
                id='mapLink'
                value={mapLink}
                onChange={e => setMapLink(e.target.value)}
              />
            </div>

            <div className='exampleEdit'>
              <label htmlFor='example'>Примерный проезд:</label>
              <input
                type='text'
                id='example'
                value={example}
                onChange={e => setExample(e.target.value)}
              />
            </div>

            <div className='taskEdit'>
              <label htmlFor='task'>Судейское задание:</label>
              <textarea
                id='task'
                value={task}
                onChange={e => setTask(e.target.value)}
              />
            </div>

            <div className='reglamentEdit'>
              <label htmlFor='reglament'>Регламент:</label>
              <textarea
                id='reglament'
                value={reglament}
                onChange={e => setReglament(e.target.value)}
              />
            </div>

            <div className='visualReglamentEdit'>
              <label htmlFor='visualReglament'>Визуальный регламент:</label>
              <textarea
                id='visualReglament'
                value={visualReglament}
                onChange={e => setVisualReglament(e.target.value)}
              />
            </div>

            <div className='maxPilotsEdit'>
              <label htmlFor='maxPilots'>Ограничение количества пилотов (оставьте поле пустым, если ограничение не нужно):</label>
              <input
                type='number'
                id='maxPilots'
                value={maxPilots}
                onChange={e => setMaxPilots(e.target.value)}
              />
            </div>

          </div>
        )}

        {!isEditing && (
          <div className='max_pilots' key="max-pilots">
            <p className='bold'>Ограничение кол-во пилотов: {tournament.max_pilots !== null ? parseInt(tournament.max_pilots, 10) : 'Нет'}</p>
          </div>
        )}

        {tournament.participants && (
          <div className='Participant'>

            <p className='bold'>Участники:</p>

            <div className='participant-container'>
              {tournament.participants.map(participant => (
                participant && participant.user && participant.user.id && participant.user.username && (
                  <div key={participant.user.id} className='participant-item'>
                    <div className='participant-info'>
                      <p>{participant.user.username}</p>
                      {isOwner && isEditing && (
                        <button onClick={() => handleDeleteParticipant(participant.user.id, id)}>Удалить</button>
                      )}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        <div className='enter' key="enter">
          {isFull ? (
            <p>Достигнуто максимальное количество участников</p>
          ) : (
            <button onClick={handleParticipate} disabled={isParticipating} key="participate-button">
              {buttonText}
            </button>
          )}
        </div>

      </div>

      <div className='right'>

        <div className='tour_image'> 
          {tournament.image && <img src={`https://carxtours.com/api/tournaments/${tournament.image}`} alt='Tournament' />}
        </div>

        <p>Организатор / Название турнира / Карта / Дата</p>
        <div className='tour_info'>
          {tournament.full_org_name && tournamentName && mapName && date && (
            <p key="header-info">
              {tournament.full_org_name}: {tournamentName} / {mapName} - Дата проведения: {date}
            </p>
          )}
        </div>

        {(tournament.map_link || tournament.example) && (
          <div className='a' key="a" style={{ display: 'flex' }}>

            {tournament.map_link && (
              <a href={tournament.map_link} target='_blank' rel='noopener noreferrer' key="map-link">
                Ссылка на карту
              </a>
            )}

            {tournament.example && (
              <a href={tournament.example} target='_blank' rel='noopener noreferrer' key="example-link">
                Примерный проезд
              </a>
            )}

            {isOwner && !isEditing && (
              <div className='edit-buttons' key="edit-buttons">
                <button onClick={handleEdit}>Редактировать</button>
              </div>
            )}

            {isEditing && (
              <div className='edit-buttons' key="edit-buttons">
                <button onClick={handleSave}>Сохранить</button>
                <button onClick={() => setIsEditing(false)}>Отмена</button>
              </div>
            )}

          </div>
        )}
      </div>

      <div className='qualification'>
        <div className='grid'>
          <h3>Квалификация</h3>
          <Link to={`/tournament/${id}/grid`}>Сетка</Link>
        </div>
        {tournament &&
          tournament.participants &&
          tournament.participants.map(participant => {
            const participantId = participant.user.id;
            const try1Value = try1Values[participantId] || '';
            const try2Value = try2Values[participantId] || '';

            if (isOwner) {
              return (
                <div key={participantId} className='qual_info'>
                  <p>{participant.user.username}</p>
                  <p>1 заезд: {participant.try1}</p>
                  <input
                    type='number'
                    value={try1Value}
                    onChange={e =>
                      setTry1Values(prevState => ({
                        ...prevState,
                        [participantId]: e.target.value
                      }))
                    }
                  />
                  <p>2 заезд: {participant.try2}</p>
                  <input
                    type='number'
                    value={try2Value}
                    onChange={e =>
                      setTry2Values(prevState => ({
                        ...prevState,
                        [participantId]: e.target.value
                      }))
                    }
                  />
                  <div className='qual_info'>
                    <button
                      onClick={() => {
                        if (!isNaN(try1Value) && !isNaN(try2Value)) {
                          handleUpdateParticipant(participantId, tournament.id);
                        } else {
                          console.error('Неверные значения try1 или try2');
                        }
                      }}
                    >
                      Сохранить
                    </button>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={participantId} className='qual_info'>
                  <p>{participant.user.username}</p>
                  <p>1 заезд: {participant.try1}</p>
                  <p>2 заезд: {participant.try2}</p>
                </div>
              );
            }
          })}
      </div>
    </div>
  );
}

export default TournamentPage;