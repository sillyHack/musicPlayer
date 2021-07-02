import React from 'react';

const LibrarySong = ({song, songs, setCurrentSong, id, audioRef, isPlaying, setSongs}) => {

     // functions
     const songSelectHandler = async (e) => {
          const selectedSong = songs.filter((state) => state.id === id)
          await setCurrentSong(selectedSong[0]);
          //add active state
          const newSongs = songs.map((song) => {
               if(song.id === id){ // id-> the song that we click on; song.id-> the state
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
          if(isPlaying) audioRef.current.play();
     }

     return (
          <div onClick={songSelectHandler} className={`library-song ${song.active ? 'selected' : ""}`}>
               <img 
               alt={song.name} 
               src={song.cover}
               ></img>
               <div className="song-description">
                    <h3>{song.name}</h3>
                    <h4>{song.artist}</h4>
               </div>
          </div>
         
     );
}

export default LibrarySong;