import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="App-container">
        <h1>Symptom Checker</h1>
        <textarea type="text" className="App-form-symptom-list"></textarea><br/>
        <button>Submit</button>
      </div>
    </div>
  );
}

export default App;
