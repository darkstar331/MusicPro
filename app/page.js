'use client';

import { useEffect, useState } from "react";
import Playlist from "../app/components/Playlist";
import { useMusicPlayer } from "./context/MusicPlayerContext";
import { useSession } from "next-auth/react";
import { FiInfo } from "react-icons/fi";

const HomePage = () => {
  const { setCurrent } = useMusicPlayer(); // Access setCurrent from context
  const { data: session, status } = useSession(); // Access session data and status
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false); // State to control dialog visibility
  const [randomHits, setRandomHits] = useState([
    {
      title: "Despacito",
      artist: "Luis Fonsi ft. Daddy Yankee",
      videoId: "kJQP7kiw5Fk",
      thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/0.jpg"
    },
    {
      title: "Shape of You",
      artist: "Ed Sheeran",
      videoId: "JGwWNGJdvx8",
      thumbnail: "https://img.youtube.com/vi/JGwWNGJdvx8/0.jpg"
    },
    {
      title: "See You Again",
      artist: "Wiz Khalifa ft. Charlie Puth",
      videoId: "RgKAFK5djSk",
      thumbnail: "https://img.youtube.com/vi/RgKAFK5djSk/0.jpg"
    },
    {
      title: "Blinding Lights",
      artist: "The Weeknd",
      videoId: "fHI8X4OXluQ",
      thumbnail: "https://img.youtube.com/vi/fHI8X4OXluQ/0.jpg"
    },
    {
      title: "Uptown Funk",
      artist: "Mark Ronson ft. Bruno Mars",
      videoId: "OPf0YbXqDm0",
      thumbnail: "https://img.youtube.com/vi/OPf0YbXqDm0/0.jpg"
    },
    {
      title: "Never Gonna Give You Up",
      artist: "Rick Astley",
      videoId: "dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg"
    },
    {
      title: "Night Changes",
      artist: "One Direction",
      videoId: "syFZfO_wfMQ",
      thumbnail: "https://img.youtube.com/vi/syFZfO_wfMQ/0.jpg"
    },
    {
      title: "Faded",
      artist: "Alan Walker",
      videoId: "60ItHLz5WEA",
      thumbnail: "https://img.youtube.com/vi/60ItHLz5WEA/0.jpg"
    }
  ]);

  useEffect(() => {
    if (status === 'authenticated') {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [status]);

  if (status === 'authenticated') {
    return <Playlist />; // Show Playlist component when user is authenticated
}

  const handleSongClick = (song) => {
    setCurrent(song); // Set the clicked song as the current song
  };

  return (
    <div className="relative w-full overflow-y-auto mt-3 mb-28 bg-transparent p-6">
      <h2 className="text-3xl font-bold text-[#1db954] mb-4">Most Viewed Songs</h2>
      <div className="grid grid-cols-1 m-2 px-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto h-[30rem] 2xl:h-[38rem] py-4 hidden-scrollbar">
        {randomHits.map((song, index) => (
          <div
            key={index}
            className="cursor-pointer text-center transition-transform transform hover:scale-110 bg-[#121212] p-7 rounded-lg shadow-md hover:shadow-lg"
            onClick={() => handleSongClick(song)}
          >
            <img src={song.thumbnail} alt={song.title} className="w-full h-48 object-cover rounded-md shadow-md" />
            <p className="mt-2 text-lg font-semibold text-[#1db954] truncate">{song.title}</p>
            <p className="text-sm text-gray-400 truncate">{song.artist}</p>
          </div>
        ))}
      </div>
      {/* Info Button Icon */}
      <div className="fixed top-32 right-8 flex items-center">
        <div
          className="cursor-pointer p-3 bg-[#1db954] rounded-full text-white shadow-lg hover:bg-[#17a34a] transition-colors"
          onClick={() => {
            setShowDialog(!showDialog);
            if (!showDialog) {
              setTimeout(() => setShowDialog(false), 5000);
            }
          }}
        >
          <FiInfo size={24} />
        </div>
        {/* Dialog Box */}
        {showDialog && (
          <div className="absolute top-0 right-0 mt-12 p-4 bg-white text-black rounded-lg shadow-lg w-64">
            <p className="font-medium">Sign in to create your custom playlist and enjoy personalized recommendations!</p>
          </div>
        )}
      </div>
    </div>
    
  );
};

export default HomePage;
