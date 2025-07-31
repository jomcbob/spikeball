export default function Header({ onAddNetClick, rotateUsers }) {
  return (
    <header>
      <div className="name">Spikeball Scramble</div>
      <div className="headerButtons">
        <button onClick={onAddNetClick}>Add Net</button>
        <button onClick={rotateUsers}>Scramble</button>
      </div>
    </header>
  );
}