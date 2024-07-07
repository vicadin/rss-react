import "./App.css";

function App() {
  return (
    <>
      <div>
        <div className="search-panel">
          <input className="search-input" type="text" placeholder="Search..." />
          <button className="search-btn">Search</button>
        </div>
        <div className="result"></div>
      </div>
    </>
  );
}

export default App;
