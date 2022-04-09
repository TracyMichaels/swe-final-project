import './App.css';
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
  const [videoComments, setVideoComments] = useState([]);

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

  // WARNING: DEPENDING ON HOW THE BACK END IS SET UP,
  // THE ENDPOINT NAMES AND FORMATTING AND WILL NEED TO BE CHANGED
  // get comments for currently playing video
  useEffect(() => {
    // TODO: remove try catch when backend is set up
    try {
      fetch(`/getComments?id=${videoIds[videoListIndex].id}`)
        .then((response) => response.json())
        .then((data) => {
          setVideoComments(data);
        });
    } catch (err) {
      console.log('Not implemented yet, will be fixed when backend is set up');
    }
  }, [videoListIndex]);

  const onSearchClick = () => {
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

  // WARNING: DEPENDING ON HOW THE BACK END IS SET UP,
  // THE ENDPOINT NAMES AND FORMATTING AND WILL NEED TO BE CHANGED
  const addComment = () => {
    const newCommentObj = {
      videoId: videoIds[videoListIndex].id,
      comment: inputValue,
    };
    // TODO: remove try catch when backend is set up
    try {
      fetch('/addComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(newCommentObj),
      }).then((response) => response.json())
        .then((data) => {
          if (!data.success) {
            alert('User Must be logged in to perform this action');
          } else {
            setVideoComments(data.comments);
          }
        });
    } catch (err) {
      console.log(`sending to back end: ${newCommentObj}`);
      console.log('Not implemented yetwill be fixed when backend is set up');
    }
  };

  // TODO: style
  return (
    <div className="App">
      <a href="/login">Login</a>
      <br />
      <a href="/logout">Logout</a>
      <form>
        <input type="text" placeholder="Search" onChange={updateFieldChanged} />
        <button type="button" onClick={onSearchClick}>Search</button>
      </form>
      <div>
        {videoIds.length > 0
          && (
            <div>
              <h3>{videoIds[videoListIndex].title}</h3>
              <iframe
                title="video"
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videoIds[videoListIndex].id}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay;"
                allowFullScreen
              />
              <button type="button" onClick={playNext}>Skip</button>
            </div>
          )}
      </div>
      <div>
        {videoIds.length > 0
          && (
            <div>
              <textarea rows="10" cols="50" placeholder="Leave a Comment" onChange={updateFieldChanged} />
              <button type="button" onClick={(addComment)}>Submit</button>
            </div>
          )}
      </div>
      <div>
        Comments:
        <br />
        {videoComments && videoComments.map((comment) => (
          <div>
            <p>
              &quot;
              {comment.text}
              &quot;
            </p>
            <p>
              -
              {comment.user}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
