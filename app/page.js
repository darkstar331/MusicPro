'use client'
import Playlist from "./components/Playlist";
import { useEffect, useState } from "react";
import { useMusicPlayer } from "./context/MusicPlayerContext";
import { useSession } from "next-auth/react";

const HomePage = () => {
  const { playlist } = useMusicPlayer(); // Access playlist from context
  const { data: session, status } = useSession(); // Access session data and status
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      // Simulate loading (e.g., fetching data)
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Adjust the delay as needed
    } else {
      setIsLoading(false);
    }
  }, [status]);

  return (
    <main className="text-white p-6">
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <p className="text-xl mb-4">Loading your playlist...</p>
              <div className="flex justify-center">
                {/* Use a simple spinner for loading */}
                <svg
                  className="animate-spin h-10 w-10 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        ) : playlist && playlist.length > 0 ? (
          <div className="md:mt-10">
            <h1 className="text-3xl text-center font-bold mb-6">Your Playlist</h1>
            <Playlist />
          </div>
        ) : (
          <div className="flex justify-center absolute mt-24 mr-3 md:mr-0 md:mt-0 md:top-[25rem] md:right-[30rem] 2xl:top-[30rem] 2xl:right-[44rem] items-center h-auto">
  <div className="text-center bg-teal-950 p-6 rounded-lg shadow-lg">
    <h2 className="text-4xl font-bold mb-4 text-red-500">
      😢 No Playlist Found
    </h2>
    <p className="text-lg mb-6">
      It looks like you don't have any songs in your playlist yet. 🎶
    </p>
    <p className="text-lg mb-6">
      Please <span className="font-semibold text-blue-600">sign in</span> to create your custom playlist. 🔑
    </p>
   
  </div>
</div>

        )}
      </div>
    </main>
  );
};

export default HomePage;
