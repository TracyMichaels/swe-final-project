import React, { useState, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_YT_KEY;
const YOUTUBE_URL = 'https://www.googleapis.com/youtube/v3/';

function App() {
  const [initalId, setInitalId] = useState('');
  const [videoIds, setVideoIds] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [enterFlag, setEnterFlag] = useState(false);

  // get initial video id based on query
  useEffect(() => {
    if (!enterFlag) return;
    const params = {
      part: 'snippet',
      key: API_KEY,
      q: query,
      type: 'video',
    };
    fetch(`${YOUTUBE_URL}search?part=${params.part}&q=${params.q}& maxResults=1 & key=${params.key}`, {
      // './searchreturn.json', { // for local testing to save api calls (files located in public folder)
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then((response) => response.json()).then((data) => {
      setInitalId({
        id: data.items[0].id.videoId,
        title: data.items[0].snippet.title,
      });
    });
  }, [query]);

  // get list of related videos based on initial video id
  useEffect(() => {
    if (!enterFlag) return;
    const params = {
      part: 'snippet',
      key: API_KEY,
      numResults: 9,
      videoId: initalId.id,
      type: 'video',
    };
    fetch(`${YOUTUBE_URL}search?part=${params.part}&relatedToVideoId=${params.videoId}&maxResults=${params.numResults}&type=${params.type}&key=${params.key}`, {
      // fetch('./relatedreturn.json', { // for local testing to save api calls (files located in public folder)
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then((response) => response.json()).then((data) => {
      const newIds = [initalId];
      data.items.forEach((item) => {
        if (item.hasOwnProperty('snippet')) {
          newIds.push({
            id: item.id.videoId,
            title: item.snippet.title,
          });
        }
      });
      setVideoIds(newIds);
    });
    setEnterFlag(false);
  }, [initalId]);


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