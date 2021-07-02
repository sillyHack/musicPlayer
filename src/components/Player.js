import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlay, faPause, faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons';

// used to manage the playing of the song(play button, time showing...)
const Player = ({currentSong, isPlaying, setIsPlaying, audioRef, songInfo, setSongInfo, songs, setCurrentSong, setSongs}) => {
     
     const activeLibraryHandler = (nextPrev) => {
          const newSongs = songs.map((song) => {
               if(song.id === nextPrev.id){ // id-> the song that we click on; song.id-> the state
                    return{
                         ...song,
                         active: true
                    };
               }else{
                    return{
                         ...song,
                         active: false
                    };
               }
          });
          setSongs(newSongs);
     }

     // event handlers
     const playSongHandler = () => {
          if (isPlaying){
               audioRef.current.pause();
          }else{
               audioRef.current.play();  
          }
          setIsPlaying(!isPlaying);
     }
     
     const getTime = (time) => {
          return (
               Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
          );
     }
     const dragHandler = (e) => {
          const timeSelected = e.target.value;

          audioRef.current.currentTime = timeSelected;
          setSongInfo({...songInfo, currentTime: timeSelected })
     }

     const skipTrackHandler = async (direction) => {
          let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
          if(direction === 'skip-forward'){
               await setCurrentSong(songs[(currentIndex + 1) % songs.length]); // we wait until the song finishes
               activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
          }
          if(direction === 'skip-back'){
               if((currentIndex - 1) % songs.length === -1){
                    await setCurrentSong(songs[songs.length - 1]);
                    activeLibraryHandler(songs[songs.length - 1]);
                    if(isPlaying) audioRef.current.play();
                    return;
               }
               await setCurrentSong(songs[currentIndex - 1]);
               activeLibraryHandler(songs[currentIndex - 1]);
          }
          if(isPlaying) audioRef.current.play();
     }
     
     // add style
     const trackAnim = {
          transform: `translateX(${songInfo.animationPercentage}%)`
     };

     return (
          <div className="player">
               <div className="time-control">
                    <p>{getTime(songInfo.currentTime)}</p>
                    <div style={{background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`}} className="track">
                         <input 
                         min={0} 
                         max={songInfo.duration || 0} 
                         value={songInfo.currentTime} 
                         onChange={dragHandler}
                         type="range"
                         />
                         <div style={trackAnim} className="animate-track"></div>
                    </div>
                    
                    <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
               </div>
               <div className="play-control">
                    <FontAwesomeIcon 
                    onClick={() => skipTrackHandler('skip-back')} 
                    className="skip-back" 
                    size="2x" 
                    icon={faAngleLeft}/>

                    <FontAwesomeIcon 
                    onClick={playSongHandler} 
                    className="play" 
                    size="2x" 
                    icon={isPlaying ? faPause : faPlay}/>

                    <FontAwesomeIcon 
                    onClick={() => skipTrackHandler('skip-forward')} 
                    className="skip-forward" 
                    size="2x" 
                    icon={faAngleRight}/>
               </div>
          </div>
         
     );
}

export default Player;