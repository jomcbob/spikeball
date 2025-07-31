import React, { useState, useRef, useEffect } from "react";

let initialNets = [
  {
    id: 1,
    name: "#1",
    users: [
      { id: 1, name: "Alice", score: 0 },
      { id: 2, name: "Ben", score: 0 },
      { id: 3, name: "Cleo", score: 0 },
      { id: 4, name: "Dan", score: 0 },
    ],
  },
  {
    id: 2,
    name: "#2",
    users: [
      { id: 5, name: "Eva", score: 0 },
      { id: 6, name: "Finn", score: 0 },
      { id: 7, name: "Gina", score: 0 },
      { id: 8, name: "Hank", score: 0 },
    ],
  },
  {
    id: 3,
    name: "#3",
    users: [
      { id: 9, name: "Ivy", score: 0 },
      { id: 10, name: "Jack", score: 0 },
      { id: 11, name: "Kara", score: 0 },
      { id: 12, name: "Leo", score: 0 },
    ],
  },
  {
    id: 4,
    name: "#4",
    users: [
      { id: 13, name: "Mia", score: 0 },
      { id: 14, name: "Nate", score: 0 },
      { id: 15, name: "Olga", score: 0 },
      { id: 16, name: "Paul", score: 0 },
    ],
  },
];

function Player({ name, score, onClick }) {
  return (
    <button
      className="px-4 py-2 bg-white border rounded w-full text-left"
      onClick={onClick}
    >
      {name} — {score}
      
    </button>
  );
}


function Net({ id, name, users, onScoreChange, onRemove }) {
  return (
    <div className="net">
      <h2 className="netNumber">
        {name}
        <button onClick={() => onRemove(id)} style={{ marginLeft: '10px' }}>✖</button>
      </h2>
      <div className="displayFlex">
        {users.map((user) => (
          <Player
            key={user.id}
            name={user.name}
            score={user.score}
            onClick={() => onScoreChange(user.id)}
          />
        ))}
      </div>
    </div>
  );
}

const reindexNetsAndUsers = (nets) => {
  let userId = 1;

  return nets.map((net, netIndex) => {
    const newNetId = netIndex + 1;
    const updatedUsers = net.users.map((user) => ({
      ...user,
      id: userId++,
    }));

    return {
      ...net,
      id: newNetId,
      name: `#${newNetId}`,
      users: updatedUsers,
    };
  });
};



function NetList({ nets, setNets, handlePlayerClick }) {

  const removeNet = (id) => {
    const filtered = nets.filter((net) => net.id !== id);
    const cleaned = reindexNetsAndUsers(filtered);
    setNets(cleaned);
  };
  

  const rotateUsers = () => {
    const frozenTop = nets[0].users.slice(0, 2);
    const frozenBottom = nets[nets.length - 1].users.slice(2, 4);

    const newNets = nets.map((net) => ({ ...net, users: [...net.users] }));
    const rotatedUsers = nets.map((net) => [...net.users]);

    for (let i = 0; i < nets.length; i++) {
      const current = nets[i].users;

      if (i > 0) {
        const topTwo = current.slice(0, 2);
        rotatedUsers[i - 1].splice(2, 2, ...topTwo);
      }

      if (i < nets.length - 1) {
        const bottomTwo = current.slice(2, 4);
        rotatedUsers[i + 1].splice(0, 2, ...bottomTwo);
      }
    }

    rotatedUsers[0].splice(0, 2, ...frozenTop);
    rotatedUsers[nets.length - 1].splice(2, 2, ...frozenBottom);

    const finalNets = newNets.map((net, i) => ({
      ...net,
      users: rotatedUsers[i].sort((a, b) => (b.score || 0) - (a.score || 0)),
    }));

    setNets(finalNets);
  };


  const handleScoreChange = (playerId) => {
    const updatedNets = nets.map((net) => {
      const users = net.users.map((user) => {
        if (user.id === playerId) {
          const newScore = parseInt(prompt(`Enter score for ${user.name}:`, user.score), 10);
          return { ...user, score: isNaN(newScore) ? user.score : newScore };
        }
        return user;
      });

      return { ...net, users: users.sort((a, b) => b.score - a.score) };
    });

    setNets(updatedNets);
  };

  return (
    <>
      <button onClick={rotateUsers}>Rotate Users</button>
      <div className="netBox">
        {nets.map((net) => (
          <Net
            key={net.id}
            id={net.id}
            name={net.name}
            users={net.users}
            onScoreChange={handlePlayerClick}
            onRemove={removeNet}
          />

        ))}
      </div>
    </>
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

function Header({ onAddNetClick }) {
  return (
    <header>
      <div className="name">Spikeball Scramble</div>
      <div className="headerButtons">
        <button onClick={onAddNetClick}>Add Net</button>
        <button>Settings</button>
      </div>
    </header>
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

function EditPlayerModal({ player, onSave, onDelete, onClose }) {
  const [name, setName] = useState(player.name);
  const [score, setScore] = useState(player.score);

  return (
    <div className="editPlayerModal">
      <h2>Edit Player</h2>
      <label>
        Name:
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Score:
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(parseInt(e.target.value, 10))}
        />
      </label>
      <button
        onClick={() => {
          onSave({ ...player, name, score });
          onClose();
        }}
      >
        Save
      </button>
      <button
        style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
        onClick={() => {
          onDelete(player.id);
          onClose();
        }}
      >
        Delete
      </button>
    </div>
  );
}



export default function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("Default Content");
  const [nets, setNets] = useState(initialNets);

  useEffect(() => {
    console.log(nets)
  }, [nets])

  const handleAddNetClick = () => {
    setModalOpen(true);
    setModalContent(<Newnet nets={nets} setNets={setNets} setModalOpen={setModalOpen} />);
  };
  
  const handlePlayerClick = (playerId) => {
    const player = nets.flatMap(net => net.users).find(user => user.id === playerId);
    if (!player) return;
  
    setModalContent(
      <EditPlayerModal
        player={player}
        onSave={(updatedPlayer) => {
          const updatedNets = nets.map(net => {
            const updatedUsers = net.users.map(user =>
              user.id === updatedPlayer.id ? updatedPlayer : user
            );
  
            return {
              ...net,
              users: updatedUsers.sort((a, b) => b.score - a.score),
            };
          });
  
          setNets(updatedNets);
        }}
        onDelete={(idToDelete) => {
          let allUsers = nets.flatMap(net => net.users).filter(user => user.id !== idToDelete);
  
          allUsers = allUsers.map((user, index) => ({
            ...user,
            id: index + 1,
          }));
  
          const rebuiltNets = [];
          for (let i = 0; i < allUsers.length; i += 4) {
            const usersChunk = allUsers.slice(i, i + 4).sort((a, b) => b.score - a.score);
            rebuiltNets.push({
              id: rebuiltNets.length + 1,
              name: `#${rebuiltNets.length + 1}`,
              users: usersChunk,
            });
          }
  
          setNets(rebuiltNets);
        }}
        onClose={() => setModalOpen(false)}
      />
    );
  
    setModalOpen(true);
  };
  
  
  

  return (
    <div className="container">
      <Header onAddNetClick={handleAddNetClick} />
      <NetList nets={nets} setNets={setNets} handlePlayerClick={handlePlayerClick} />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        {modalContent}
      </Modal>
    </div>
  );
}
