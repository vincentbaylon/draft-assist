import React from 'react';

const PlayerList = ({ players, onDrafted }) => {
  const listStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    marginTop: '20px',
  };

  const cardStyle = {
    padding: '10px',
    borderRadius: '5px',
    background: '#eee',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
  };

  const nameStyle = {
    marginBottom: '0',
    marginTop: '0',
  };

  const rankStyle = {
    marginTop: '0',
    marginBottom: '0',
    marginRight: '5px',
  };

  const positionStyle = {
    marginTop: '0',
    marginBottom: '0',
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
  };

  const draftedStyle = {
    border: '1px solid red',
    color: 'red',
    background: 'transparent',
    fontSize: '16px',
    fontWeight: '500',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
  };

  return (
    <div className='player-list' style={listStyle}>
      {players.map((player) => (
        <div key={player.Rank} className='player-card' style={cardStyle}>
          <div style={headerStyle}>
            <h3 style={rankStyle}>({player.Rank})</h3>
            <h2 style={nameStyle}>{player['Player Name']}</h2>
          </div>
          <div style={footerStyle}>
            <h4 style={positionStyle}>
              {player.Position} | {player.Team}
            </h4>
            <button
              style={draftedStyle}
              onClick={() => onDrafted(player['Player Name'])}>
              REMOVE
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
