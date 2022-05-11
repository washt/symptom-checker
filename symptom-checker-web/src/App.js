import './App.css';

import { useEffect, useState, useRef } from "react";
import Fuse from 'fuse.js';

function App() {
  return (
    <div className="App">
      <SymptomChecker />
    </div>
  );
}

function SymptomChecker() {
  const [state, setState] = useState()
  const [query, updateQuery] = useState('');
  const [results, updateResults] = useState();
  const [symptoms, updateSymptoms] = useState([]);
  const [disorders, updateDisorders] = useState([]);

  const countRef = useRef(0);

  const addSymptom = name => {
    console.log(name, 'asd')
    const newSymptoms = [...symptoms, name]

    updateSymptoms(newSymptoms)
  }

  const removeSymptom = idx => {
    const newSymptoms = [...symptoms]

    newSymptoms.splice(idx, 1)
    updateSymptoms(newSymptoms)
  }

  const queryDisorders = () => {
    const hpo_ids = symptoms.map(symptom => symptom.hpo_id )

    fetch("http://localhost:8000/", {
                                      method: 'POST',
                                      headers: {'Content-Type': 'application/json'},
                                      body: JSON.stringify(hpo_ids)
                                    }
         )
         .then(res => res.json())
         .then(res => updateDisorders(res))
  }

  useEffect(() => {
    // @TODO add error handling and logging
    fetch("http://localhost:8000/", { headers: {'Content-Type': 'application/json'}})
      .then(res => res.json())
      .then(res => JSON.parse(res))
      .then(res => {
        countRef.current++;

        let fuzzy_index = []
        const res_keys = Object.keys(res)

        // reformat payload to fit Fuze's indices
        // @TODO refactor api so this isn't necessary 
        res_keys.forEach(key => {
          fuzzy_index.push({'name': key, 'hpo_id': res[key]})
        })
        // Fuze.js for fuzzing string matching
        // https://fusejs.io/api/options.html
        const fuse = new Fuse(fuzzy_index, {keys: ['name', 'hpo_id']})

        setState({"fuse": fuse});
      })
    // not sure why this works, but fixes
    // the infinite call of useEffect on page load
    // @TODO investigate, maybe something 
    // going on with the object reference ordependency?
    // https://dmitripavlutin.com/react-useeffect-infinite-loop/
    }, [countRef]
  );

  // @TODO add clear methods for search results and selected symptoms

  function onSearch({ currentTarget }) {
      updateQuery(currentTarget.value);
      search()
  }

  function search() {
  // return top 7 results
  // UX wise:
  //  i think 7 items feels informative without
  //  being obtrusive or clunky while searching
    updateResults(state['fuse'].search(query).slice(0, 7))
  }
    
  return (
      <div className="App-container">
        <img src="https://assets.website-files.com/600886e2dc64ccedc74f294f/6244c097bb50ad3d007c640d_logo-genetic-vector.svg" loading="lazy" alt="" class="nav__logo" width="304" height="310"></img>
        <h1>Symptom Checker</h1>
        <ul className="App-diorders-links">
          { disorders.length > 0 && <h2>Disorders</h2>}
          { disorders && disorders.map((result) => { 
            return(
              <li className="App-disorders-item"
              // @TODO add uniq key prop to all list items
                key={result.hpo_id}>
                <a href={result[1]} target="_blank"><p>{result[0]}</p></a>
              </li>
            ); 
          })}
        </ul>
        <ul className="App-selected">
          { symptoms.length > 0 && <h2>Selected</h2>}
          { symptoms && symptoms.map((result, idx) => {
              return(
                <li className="App-results-item"
                    key={result.hpo_id}>
                            {result.name}
                            <button className="App-selected-symptom-remove button" onClick={() => removeSymptom(idx)}>Remove</button>
                </li>
              );
          })}
        </ul>
        <textarea type="text" value={query} onChange={onSearch} placeholder="Enter Symptom"/>
        <ul className="App-results">
          { results && results.map((result) => {
              return(
                <li className="App-results-item"
                    key={result.item.hpo_id}>
                            {result.item.name}
                            <button className="App-results-item-add button" onClick={() => addSymptom(result.item)}>Add Symptom</button>
                </li>
              );
          })}
        </ul>
        <button className="App-disorders-query-submit button" onClick={() => queryDisorders()}>Search</button>
      </div>
  );
}

export default App;
