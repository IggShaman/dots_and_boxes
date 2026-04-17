import React from 'react';
import ReactDOM from 'react-dom/client';
import { Button, Card, Elevation, FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import 'normalize.css';
import './app.css';

// ── Constants ──────────────────────────────────────────────────────────────

const PALETTE = [
  { label: 'Crimson',   value: '#e03131' },
  { label: 'Cobalt',    value: '#1971c2' },
  { label: 'Violet',    value: '#7048e8' },
  { label: 'Emerald',   value: '#2f9e44' },
  { label: 'Tangerine', value: '#e67700' },
  { label: 'Teal',      value: '#0c8599' },
  { label: 'Rose',      value: '#c2255c' },
  { label: 'Marigold',  value: '#c98a00' },
];

const DEFAULT_PLAYERS = [
  { name: 'Jungkook', color: PALETTE[0] },
  { name: 'Rosé',     color: PALETTE[1] },
];

// ── ColorPicker ────────────────────────────────────────────────────────────

function ColorPicker({ selected, takenValue, onChange }) {
  return (
    <div className="color-swatches">
      {PALETTE.map(color => {
        const isTaken    = color.value === takenValue;
        const isSelected = color.value === selected.value;
        let cls = 'color-swatch';
        if (isSelected) cls += ' swatch-selected';
        if (isTaken)    cls += ' swatch-taken';
        return (
          <div
            key={color.value}
            className={cls}
            style={{ backgroundColor: color.value }}
            title={isTaken ? `${color.label} (taken)` : color.label}
            onClick={() => { if (!isTaken) onChange(color); }}
          />
        );
      })}
    </div>
  );
}

// ── PlayerCard ─────────────────────────────────────────────────────────────

function PlayerCard({ number, player, otherColor, onChange }) {
  return (
    <Card elevation={Elevation.THREE} className="player-card">
      <div className="player-card-header">
        <span className="player-badge" style={{ backgroundColor: player.color.value }}>
          {number}
        </span>
        <p className="player-card-title">Player {number}</p>
      </div>

      <FormGroup label="Name">
        <InputGroup
          value={player.name}
          onChange={e => onChange({ ...player, name: e.target.value })}
          placeholder="Enter name…"
          large
        />
      </FormGroup>

      <FormGroup label="Color">
        <ColorPicker
          selected={player.color}
          takenValue={otherColor}
          onChange={color => onChange({ ...player, color })}
        />
      </FormGroup>

      <div className="player-preview" style={{ backgroundColor: player.color.value }}>
        {player.name.trim() || `Player ${number}`}
      </div>
    </Card>
  );
}

// ── NewGameScreen ──────────────────────────────────────────────────────────

function NewGameScreen({ onStart }) {
  const [players, setPlayers] = React.useState(DEFAULT_PLAYERS);

  const update = (index, updated) =>
    setPlayers(prev => prev.map((p, i) => (i === index ? updated : p)));

  const namesOk  = players.every(p => p.name.trim().length > 0);
  const colorsOk = players[0].color.value !== players[1].color.value;
  const canStart = namesOk && colorsOk;

  return (
    <>
      <h1 className="app-title">Dots &amp; Boxes</h1>
      <p className="app-subtitle">A two-player game of lines and squares</p>

      <div className="players-row">
        <PlayerCard
          number={1}
          player={players[0]}
          otherColor={players[1].color.value}
          onChange={p => update(0, p)}
        />
        <PlayerCard
          number={2}
          player={players[1]}
          otherColor={players[0].color.value}
          onChange={p => update(1, p)}
        />
      </div>

      <div className="start-row">
        {!colorsOk && (
          <span className="color-conflict-msg">Players must choose different colors.</span>
        )}
        <Button
          large
          intent={Intent.PRIMARY}
          disabled={!canStart}
          onClick={() => onStart(players)}
          icon="play"
          text="Start Game"
        />
      </div>
    </>
  );
}

// ── GameScreen (placeholder) ───────────────────────────────────────────────

function GameScreen({ config, onNewGame }) {
  const [p1, p2] = config.players;
  return (
    <div className="game-placeholder">
      <h2>Game Board</h2>
      <div className="vs-row">
        <span className="player-chip" style={{ backgroundColor: p1.color.value }}>{p1.name}</span>
        <span style={{ color: '#8f99a8' }}>vs</span>
        <span className="player-chip" style={{ backgroundColor: p2.color.value }}>{p2.name}</span>
      </div>
      <p style={{ color: '#8f99a8', margin: 0 }}>Game board coming soon…</p>
      <Button intent={Intent.NONE} icon="arrow-left" text="New Game" onClick={onNewGame} />
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────

function App() {
  const [screen, setScreen] = React.useState('new-game');
  const [config, setConfig]  = React.useState(null);

  const handleStart = (players) => {
    setConfig({ players });
    setScreen('game');
  };

  if (screen === 'game') {
    return <GameScreen config={config} onNewGame={() => setScreen('new-game')} />;
  }
  return <NewGameScreen onStart={handleStart} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
