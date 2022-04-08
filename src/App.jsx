import React, { useState, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_YT_KEY;
const YOUTUBE_URL = 'https://www.googleapis.com/youtube/v3/';

function App() {
  const [initalId, setInitalId] = useState('');
  const [videoIds, setVideoIds] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [enterFlag, setEnterFlag] = useState(false);
  const [videoListIndex, setVideoListIndex] = useState(0);

  // get initial video id based on query
  useEffect(() => {
    if (!enterFlag) return;
    const params = {
      part: 'snippet',
      key: API_KEY,
      q: query,
      type: 'video',
    };
    fetch(`${YOUTUBE_URL}search?part=${params.part}&q=${params.q}&maxResults=1&key=${params.key}`, {
      // for local testing to save api calls (files located in public folder)
      // fetch('./searchreturn.json', {
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
      numResults: 20,
      videoId: initalId.id,
      type: 'video',
    };
    fetch(`${YOUTUBE_URL}search?part=${params.part}&relatedToVideoId=${params.videoId}&maxResults=${params.numResults}&type=${params.type}&key=${params.key}`, {
      // for local testing to save api calls (files located in public folder)
      // fetch('./relatedreturn.json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then((response) => response.json()).then((data) => {
      const newIds = [initalId];
      data.items.forEach((item) => {
        if (item.hasOwnProperty.call(item, 'snippet')) {
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

  const onClick = () => {
    setQuery(inputValue);
    setEnterFlag(true);
  };

  const updateFieldChanged = (e) => {
    setInputValue(e.target.value);
  };
  const playNext = () => {
    if (videoListIndex === videoIds.length - 1) {
      alert('end of playlist, starting over');
      setVideoListIndex(0);
    } else {
      setVideoListIndex(videoListIndex + 1);
    }
  };

  // just prints the video ids and titles for now
  // TODO: display videos
  return (
    <div className="App">
      <form>
        <input type="text" placeholder="Search" onChange={updateFieldChanged} />
        <button type="button" onClick={onClick}>Search</button>
        <div>
          {videoIds.length > 0
            && (
              <div>
                <h3>{videoIds[videoListIndex].title}</h3>
              </div>
            )}
          {videoIds.length > 0
            && (
              <iframe
                title="video"
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videoIds[videoListIndex].id}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay;"
                allowFullScreen
              />
            )}
          {videoIds.length > 0
            && (
              <div>
                <button type="button" onClick={playNext}>Skip</button>
              </div>
            )}
        </div>
      </form>
    </div>
  );
}

export default App;
