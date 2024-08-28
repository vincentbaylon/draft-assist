import React, { useEffect, useState } from 'react';
import PlayerList from './PlayerList';
import Papa from 'papaparse';

const App = () => {
  const [players, setPlayers] = useState([]);
  const [originalPlayers, setOriginalPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [draftedPlayers, setDraftedPlayers] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch('/rankings.csv')
      .then((response) => response.text())
      .then((data) => {
        Papa.parse(data, {
          header: true,
          complete: (result) => {
            const playersData = result.data;
            setPlayers(playersData);
            setOriginalPlayers(playersData);
            setFilteredPlayers(playersData);
          },
        });
      });
  }, []);

  useEffect(() => {
    let updatedPlayers = originalPlayers.filter((player) => {
      return (
        player['Player Name']
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        (teamFilter === '' || player.Team === teamFilter) &&
        (positionFilter === '' || player.Position === positionFilter) &&
        !draftedPlayers.some(
          (drafted) => drafted['Player Name'] === player['Player Name']
        )
      );
    });
    setFilteredPlayers(updatedPlayers);
  }, [searchTerm, teamFilter, positionFilter, draftedPlayers, originalPlayers]);

  const handleDrafted = (playerName) => {
    const player = originalPlayers.find((p) => p['Player Name'] === playerName);
    if (player) {
      setDraftedPlayers([...draftedPlayers, player]);
      setHistory([...history, player]);
      setPlayers(players.filter((p) => p['Player Name'] !== playerName));
    }
  };

  const handleUndo = () => {
    const lastDrafted = history[history.length - 1];
    if (lastDrafted) {
      // Insert the player back into the players list maintaining the original order
      const index = originalPlayers.findIndex(
        (p) => p['Player Name'] === lastDrafted['Player Name']
      );
      const updatedPlayers = [
        ...players.slice(0, index),
        lastDrafted,
        ...players.slice(index),
      ];

      setPlayers(updatedPlayers);
      setDraftedPlayers(
        draftedPlayers.filter(
          (p) => p['Player Name'] !== lastDrafted['Player Name']
        )
      );
      setHistory(history.slice(0, -1));
    }
  };

  const teams = [...new Set(originalPlayers.map((player) => player.Team))];
  const positions = [
    ...new Set(originalPlayers.map((player) => player.Position)),
  ];

  const appStyle = {
    margin: '25px',
  };

  const filterStyle = {
    marginRight: '10px',
    padding: '10px',
    cursor: 'pointer',
  };

  const inputStyle = {
    marginRight: '10px',
    padding: '10px',
  };

  const undoStyle = {
    border: '1px solid green',
    padding: '10px',
    color: 'white',
    background: 'green',
    fontWeight: '600',
    fontSize: '15px',
    cursor: 'pointer',
  };

  const headerStyle = {
    background: 'black',
    color: 'white',
    textAlign: 'center',
    padding: '10px',
  };

  return (
    <div className='App' style={appStyle}>
      <div style={headerStyle}>
        <h1>FFL Draft Assistance</h1>
        <input
          type='text'
          placeholder='Search by player name'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
        />
        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          style={filterStyle}>
          <option value=''>All Teams</option>
          {teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          style={filterStyle}>
          <option value=''>All Positions</option>
          {positions.map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </select>
        <button
          style={undoStyle}
          onClick={handleUndo}
          disabled={history.length === 0}>
          UNDO REMOVE
        </button>
      </div>
      <PlayerList players={filteredPlayers} onDrafted={handleDrafted} />
    </div>
  );
};

export default App;
