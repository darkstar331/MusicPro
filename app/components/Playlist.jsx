import { useSession } from 'next-auth/react';
import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { FaTrash, FaPlay } from 'react-icons/fa';
import styles from './Playlist.module.css'; // Import the CSS module

const Playlist = () => {
  const { playlist, setCurrent, handleRemove } = useMusicPlayer();
  const { data: session } = useSession();

  const handleSongClick = (song) => {
    setCurrent(song); // Set the clicked song as the current song
  };

  return (
    <div className="mt-9 p-4 md:p-10 text-white h-[57vh] overflow-y-auto hidden-scrollbar">
      {playlist.length === 0 ? (
        <p className="text-gray-400 text-center text-lg py-20">
          No liked songs yet. Start adding some!
        </p>
      ) : (
        <div className="grid grid-cols-1  overflow-y-auto sm:grid-cols-2 p-2 mx-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-4 overflow-auto">
          {playlist.map((song, index) => (
            <div
              key={song.videoId}
              className={`group cursor-pointer user-select-none w-full max-w-[300px] mx-auto border border-[#ffffff22] bg-[#282c34] bg-gradient-to-b from-[#282c34] to-[rgba(17,0,32,0.5)] shadow-lg rounded-lg backdrop-blur-md overflow-hidden p-4 ${styles.shinyCard}`}
              onClick={() => handleSongClick(song)}
            >
              <div className="flex flex-col">
                <img
                  className="rounded-md w-full h-[250px] object-cover mb-4"
                  src="https://i.imgur.com/aZ9HulS.png"
                  alt="Song Cover"
                />
                <h2 className="text-lg font-bold text-white truncate group-hover:text-[#1db954] transition-colors mb-2">
                  {song.title}
                </h2>
                <p className="text-gray-400 truncate mb-4">{song.artist}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <button
                      className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full shadow-lg hover:from-green-500 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-1"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the click from setting the current song
                        handleSongClick(song);
                      }}
                    >
                      <FaPlay className="w-5 h-5" />
                    </button>
                    <span className="ml-2 text-white font-medium">Play</span>
                  </div>
                  <button
                    className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-red-400 to-red-600 text-white rounded-full shadow-lg hover:from-red-500 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-1"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the click from setting the current song
                      handleRemove(song.videoId); // Remove the song from the playlist
                    }}
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlist;
