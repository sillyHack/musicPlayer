import React, {useState, useRef} from 'react';
// Import styles
import './styles/app.scss';
// Adding components
import Player from './components/Player';
import Song from './components/Song';
import Library from './components/Library';
import Nav from './components/Nav';
// import music data
import data from './data';

function App() {
  // ref
  const audioRef = useRef(null);
  // states
  const [songs, setSongs] = useState(data());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0
  });
  const [libraryStatus, setLibraryStatus] = useState(false);
  //functions
  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    // calculate percentage (for the input style in CSS)
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const animation = Math.round((roundedCurrent / roundedDuration) * 100);

    setSongInfo({
         ...songInfo,
         currentTime: current,
         duration: duration,
         animationPercentage: animation // if the two words are the same, we can just put `duration`
    });
  }

  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]); // we wait until the song finishes       
    if(isPlaying) audioRef.current.play();
  }

  return (
    <div className={`App ${libraryStatus ? 'library-active' : ''}`}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus}/>
      <Song currentSong={currentSong} isPlaying={isPlaying}/>

      <Player 
      audioRef={audioRef} 
      setIsPlaying={setIsPlaying} 
      isPlaying={isPlaying} 
      currentSong={currentSong}
      songInfo={songInfo}
      setSongInfo={setSongInfo}
      songs={songs}
      setCurrentSong={setCurrentSong}
      setSongs={setSongs}/>

      <Library 
      audioRef={audioRef} 
      songs={songs} 
      setCurrentSong={setCurrentSong}
      isPlaying={isPlaying}
      setSongs={setSongs}
      libraryStatus={libraryStatus}/>

      <audio 
      onTimeUpdate={timeUpdateHandler} 
      onLoadedMetadata={timeUpdateHandler}
      ref={audioRef} 
      src={currentSong.audio}
      onEnded={songEndHandler}></audio>
    </div>
  );
}

export default App;
