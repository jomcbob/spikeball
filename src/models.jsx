import React, { useState } from "react";

function EditPlayerModal({ player, onSave, onDelete, onClose }) {
  const [name, setName] = useState(player.name);
  const [games, setGames] = useState(player.games || [
    { result: "notPlayed", score: 0 },
    { result: "notPlayed", score: 0 },
    { result: "notPlayed", score: 0 },
  ]);

  const handleGameChange = (index, field, value) => {
    const updatedGames = [...games];
    updatedGames[index] = {
      ...updatedGames[index],
      [field]: field === "score" ? parseInt(value, 10) || 0 : value,
    };
    setGames(updatedGames);
  };

  const totalWins = games.filter(g => g.result === "win").length;
  const totalScore = games
    .filter(g => g.result !== "notPlayed")
    .reduce((sum, g) => sum + (parseInt(g.score) || 0), 0);

  return (
    <div className="editPlayerModal">
      <h2>{name}</h2>

      <label>
        Name:
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      {games.map((game, index) => (
        <div key={index} style={{ marginTop: "10px" }}>
          <label>
            Game {index + 1} Result:
            <select
              value={game.result}
              onChange={(e) => handleGameChange(index, "result", e.target.value)}
            >
              <option value="notPlayed">Not Played</option>
              <option value="win">Win</option>
              <option value="loss">Loss</option>
            </select>
          </label>
          <label>
            Score:
            <input
              type="number"
              value={game.score}
              onChange={(e) => handleGameChange(index, "score", e.target.value)}
              disabled={game.result === "notPlayed"}
            />
          </label>
        </div>
      ))}

      <p style={{ marginTop: "10px" }}>
        Wins: {totalWins} — Total Score: {totalScore}
      </p>

      <button
        onClick={() => {
          onSave({
            ...player,
            name,
            score: totalScore,
            wins: totalWins,
            games,
          });
          onClose();
        }}
      >
        Save
      </button>

      <button
        onClick={() => {
          onDelete(player.id);
          onClose();
        }}
      >
        Delete {name}
      </button>
    </div>
  );
}

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <button className="closeBtn" onClick={onClose}>✖</button>
        {children}
      </div>
    </div>
  );
}

const addNet = (nets, setNets, playerOne, playerTwo, playerThree, playerFour) => {
  const newId = nets.length + 1;
  const baseId = nets.length * 4 + 1;

  const newNet = {
    id: newId,
    name: `#${newId}`,
    users: [
      { id: baseId, name: playerOne, score: 0 },
      { id: baseId + 1, name: playerTwo, score: 0 },
      { id: baseId + 2, name: playerThree, score: 0 },
      { id: baseId + 3, name: playerFour, score: 0 },
    ],
  };

  setNets([...nets, newNet]);
};

const Newnet = ({ nets, setNets, setModalOpen }) => {
  const [playerOne, setPlayerOne] = useState("");
  const [playerTwo, setPlayerTwo] = useState("");
  const [playerThree, setPlayerThree] = useState("");
  const [playerFour, setPlayerFour] = useState("");

  return (
    <div className="newNet">
      <input type="text" placeholder="player one" value={playerOne} onChange={(e) => setPlayerOne(e.target.value)} />
      <input type="text" placeholder="player two" value={playerTwo} onChange={(e) => setPlayerTwo(e.target.value)} />
      <input type="text" placeholder="player three" value={playerThree} onChange={(e) => setPlayerThree(e.target.value)} />
      <input type="text" placeholder="player four" value={playerFour} onChange={(e) => setPlayerFour(e.target.value)} />
      <button
        onClick={() => {
          addNet(nets, setNets, playerOne, playerTwo, playerThree, playerFour);
          setModalOpen(false);
        }}
      >
        Add Net
      </button>
    </div>
  );
};

export { Modal, EditPlayerModal, Newnet }