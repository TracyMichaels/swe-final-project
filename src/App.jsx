import React, { useState, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_YT_KEY;
const YOUTUBE_URL = 'https://www.googleapis.com/youtube/v3/';

function App() {
  const [initalId, setInitalId] = useState('');
  const [videoIds, setVideoIds] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [enterFlag, setEnterFlag] = useState(false);

  // just prints the keys for now
  // TODO: display videos
  return (
    <div className="App">
      <form>
        <input type="text" placeholder="Search" onChange={() => setInputValue()} />
        <button type="button" onClick={onClick}>Search</button>
        <div>
          videoIds:
          {videoIds.map((item) => (
            <div key={item.id}>
              Key:
              {' '}
              {item.id}
              <br />
              Title:
              {' '}
              {item.title}
              <br />
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}

export default App;