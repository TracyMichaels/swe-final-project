import React, { useState, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_YT_KEY;
const YOUTUBE_URL = 'https://www.googleapis.com/youtube/v3/';

function App() {
  const [videoIds, setVideoIds] = React.useState([]);

  function searchByKeyword(term) {
    const params = {
      part: 'snippet',
      key: API_KEY,
      q: term,
      type: 'video',
    };
    const res = fetch(`${YOUTUBE_URL}search?part=${params.part}&q=${params.q}&maxResults=1&key=${params.key}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()).then((data) => {
      setVideoIds(data.items[0].id.videoId);
      return data.items[0].id.videoId;
    });
    getRelatedVideos(res);
  }

  // TODO: other searches to implement later
  function searchByLocale(location) {
    // get location from from input
    // get videos from youtube api
    // set videos to state with getRelatedVideos
  }

  function searchByLanguage(lang) {
    // get language from from input
    // get videos from youtube api
    // set videos to state withGetRelatedVideos
  }

  function searchByGenre(genre) {
    // get genre from from input
    // get videos from youtube api
    // set videos to state with getRelatedVideos
  }

  function getRelatedVideos(videoId) {
    const params = {
      part: 'snippet',
      key: API_KEY,
      numResults: 9,
      videoId,
      type: 'video',
    };

    fetch(`${YOUTUBE_URL}search?part=${params.part}&relatedToVideoId=${params.videoId}&maxResults=${params.numResults}&type=${params.type}&key=${params.key}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()).then((data) => {
      const newIds = [...videoIds];
      data.items.forEach((item) => {
        newIds.push(item.id.videoId);
      });
      setVideoIds(newIds);
    });
  }

  return (
    <div className="App">
      <form>
        <input type="text" name="search" placeholder="Search" />
        <button type="button">Search</button>
      </form>
    </div>
  );
}

export default App;
