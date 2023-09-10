import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import '../css/grid.css';

  function Grid() {
    const { id } = useParams();
    const [rounds, setRounds] = useState([]);
    const [tournamentWinner, setTournamentWinner] = useState(null);
    const [ownerId, setOwnerId] = useState(null);
    const [winners, setWinners] = useState([]);
    const [losers, setLosers] = useState([]);
    const [thirdPlaceFighters, setThirdPlaceFighters] = useState([]);
    const [thirdPlaceWinner, setThirdPlaceWinner] = useState(null);
    const [thirdPlaceMatch, setThirdPlaceMatch] = useState(null);
    const [participants, setParticipants] = useState([]);
    const totalRounds = Math.ceil(Math.log2(participants.length));

    const createRound = (players) => {
      const pairs = [];
      for (let i = 0; i < players.length; i += 2) {
        pairs.push({
          players: [players[i], players[i + 1]],
          winner: null,
        });
      }
    
      // Если есть нечетное количество игроков, добавляется "заглушку" (null) в последнюю пару
      if (players.length % 2 === 1) {
        pairs[pairs.length - 1].players.push(null);
      }
    
      return pairs;
    };
    
    useEffect(() => {
      const activeRound = rounds[rounds.length - 1];
      if (!activeRound) return;
    
      const allPairsHaveWinners = activeRound.every(pair => pair.winner !== null);
      if (!allPairsHaveWinners) return;
    
      const winners = activeRound.map(pair => pair.winner);
      const losers = activeRound.map(pair => pair.players.find(player => player !== pair.winner));
    
      setLosers(losers);
    
      if (winners.length === 2) {
        setThirdPlaceFighters(losers);
      } else if (winners.length === 1) {
        setTournamentWinner(winners[0]);
        setWinners(prevWinners => [...prevWinners, winners[0]]);
        return;
      }
    
      const newRound = createRound(winners);
      setRounds(prevRounds => [...prevRounds, newRound]);
    
    }, [rounds]);    

    const handleWinnerSelect = (roundIndex, pairIndex, winnerIndex) => {
      const currentUserId = parseInt(window.localStorage.getItem('userId'));
    
      if (currentUserId !== ownerId) {
        alert('Вы не являетесь владельцем этого турнира');
        return;
      }
    
      const updatedRounds = rounds.map((round, index) => {
        if (index === roundIndex) {
          const updatedPairs = round.map((pair, pIndex) => {
            if (pIndex === pairIndex) {
              const winner = pair.players[winnerIndex] ? pair.players[winnerIndex] : null;
              console.log('Selected winner:', winner);
              return {
                ...pair,
                winner: winner ? { ...winner } : null,
              };
            }
            return pair;
          });
          return updatedPairs;
        }
        return round;
      });
    
      setRounds(updatedRounds);
    
      const winners = updatedRounds[roundIndex].map(pair => pair.winner);
      const losers = updatedRounds[roundIndex].map(pair => pair.players.find(player => player !== pair.winner));
    
      if (roundIndex === totalRounds - 2 && losers[0]) {
        setThirdPlaceMatch({ players: losers, winner: null });
      }
    
      setWinners(prevWinners => [...prevWinners, ...winners]);
    };

    const handleThirdPlaceWinnerSelect = (winnerIndex) => {
      const currentUserId = parseInt(window.localStorage.getItem('userId'));
    
      if (currentUserId !== ownerId) {
        alert('Вы не являетесь владельцем этого турнира');
        return;
      }
    
      if (thirdPlaceMatch && thirdPlaceMatch.players && thirdPlaceMatch.players[winnerIndex]) {
        const updatedThirdPlaceMatch = {
          players: thirdPlaceMatch.players,
          winner: thirdPlaceMatch.players[winnerIndex], // Установка победителя в соответствии с выбранным индексом
        };
        setThirdPlaceMatch(updatedThirdPlaceMatch);
        setThirdPlaceWinner(updatedThirdPlaceMatch.winner);
      } else {
        alert('Выбранный индекс не соответствует участнику');
      }
    };  

    const thirdPlaceWinnerName = thirdPlaceWinner ? thirdPlaceWinner.username : '';

    useEffect(() => {
      fetch(`https://carxtours.com/api/tournaments/detail/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error loading participants');
          }
          return response.json();
        })
        .then(data => {
          if (!Array.isArray(data.participants)) {
            console.error('Participants must be an array');
            return;
          }
          const participants = data.participants.map(participant => ({
            id: participant.user.id,
            username: participant.user.username,
            try1: participant.try1,
            try2: participant.try2,
          }));
          setParticipants(participants);  // Установка participants в состоянии
          const totalRounds = Math.ceil(Math.log2(participants.length));  // Вычисление totalRounds
          const initialRounds = [createRound(participants)];
          setOwnerId(data.owner);
          console.log('Owner Id:', data.owner);
    
          if (participants.length > 2) {
            // Если участников больше 2, добавляется матч за третье место после финала
            const finalRoundIndex = Math.ceil(Math.log2(participants.length));
            const newRound = createRound([null, null]);
            setRounds(prevRounds => [
              ...prevRounds.slice(0, finalRoundIndex),
              newRound,
              ...prevRounds.slice(finalRoundIndex),
            ]);
          }
          setRounds(initialRounds);
        })
        .catch(err => console.error(err));
    }, [id]);

    return (
      <div className="grid">
        <Header />
        <div className="tour_grid">
          <div className="back">
            <h3>Турнирная сетка</h3>
            <Link to={`/tournament/${id}/`}>Назад</Link>
          </div>
          {rounds.map((round, roundIndex) => (
            <div className="round" key={roundIndex}>
              <h4>Round {roundIndex + 1}</h4>
              <ul>
                {round.map((pair, pairIndex) => (
                  <li key={pairIndex}>
                    <div className="fp">
                      <button
                        disabled={pair.winner !== null}
                        onClick={() => handleWinnerSelect(roundIndex, pairIndex, 0)}
                      >
                        {pair.players[0] ? pair.players[0].username : 'Участник не определен'}
                      </button>
                    </div>
                    <div className="tp">
                      <button
                        disabled={pair.winner !== null || !pair.players[1]}
                        onClick={() => handleWinnerSelect(roundIndex, pairIndex, 1)}
                      >
                        {pair.players[1] ? pair.players[1].username : 'Участник не определен'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              {roundIndex === rounds.length - 1 && thirdPlaceMatch && !thirdPlaceWinner && (
                <div className="round">
                  <h4>Match for the third place</h4>
                  <ul>
                    <li>
                      <button
                        disabled={thirdPlaceMatch.winner !== null}
                        onClick={() => handleThirdPlaceWinnerSelect(0)}
                      >
                        {thirdPlaceMatch.players[0].username}
                      </button>
                      <button
                        disabled={thirdPlaceMatch.winner !== null}
                        onClick={() => handleThirdPlaceWinnerSelect(1)}
                      >
                        {thirdPlaceMatch.players[1].username}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ))}
    
          {tournamentWinner && (
            <div className="winner">
              <h4>Победитель турнира</h4>
              <p>{tournamentWinner.username}</p>
            </div>
          )}
    
          {thirdPlaceWinner && (
            <div className="round">
              <h4>Третье место</h4>
              <p>{thirdPlaceWinnerName}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  export default Grid;