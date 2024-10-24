'use client';
import React, { useState, useEffect } from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import ReactPlayer from 'react-player/youtube';
import {
  FaHeart,
  FaRegHeart,
  FaStepBackward,
  FaStepForward,
  FaPlay,
  FaPause,
  FaChevronUp,
  FaChevronDown,
} from 'react-icons/fa';

const MusicPlayer = () => {
  const {
    current,
    isPlaying,
    setPlaylist,
    togglePlayPause,
    handleNext,
    skipPrevious,
    playlist,
    played,
    duration,
    handleSeekChange,
    formatTime,
    toggleLike,
    isLiked,
    setIsLiked,
    playerRef,
    handleProgress,
    handleDuration,
    handleAdd,
  } = useMusicPlayer();

  const [isOpen, setIsOpen] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (current) {
      const isAlreadyLiked = playlist.some(
        (song) => song.videoId === current.videoId && song.liked
      );
      setIsLiked(isAlreadyLiked);
    }
  }, [current, playlist]);

  const toggleChevron = () => setIsOpen(!isOpen);
  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  const handleLikeClick = () => {
    if (isLiked) return;

    toggleLike();
    const isAlreadyInPlaylist = playlist.some(
      (song) => song.videoId === current.videoId
    );

    if (!isAlreadyInPlaylist) {
      handleAdd({ ...current, liked: true });
    } else {
      setPlaylist((prevPlaylist) =>
        prevPlaylist.map((song) =>
          song.videoId === current.videoId
            ? { ...song, liked: !song.liked }
            : song
        )
      );
    }
    setIsLiked(true);
  };

  const dummyCurrent = {
    videoId: 'dQw4w9WgXcQ',
    title: 'Never Gonna Give You Up',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
  };

  const activeSong = current || dummyCurrent;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#121212] border-t-2 border-[#1DB954] flex flex-col md:flex-row items-center justify-between z-50">
      {!isFullScreen && (
        <ReactPlayer
          ref={playerRef}
          url={`https://www.youtube.com/watch?v=${activeSong.videoId}`}
          playing={isPlaying}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={handleNext}
          style={{ display: 'none' }}
          key={activeSong.videoId}
          config={{
            youtube: {
              playerVars: {
                controls: 0,
                modestbranding: 1,
                playsinline: 1,
                fs: 0,
                rel: 0,
                iv_load_policy: 3, // Hides video annotations
              },
            },
          }}
        />
      )}

      {!isFullScreen && (
        <div className="flex items-center w-full h-12 md:h-auto md:w-[25%] gap-3 mb-1 md:mb-0">
          {isOpen ? (
            <>
              <img
                src={activeSong.thumbnail}
                alt="Song Thumbnail"
                className="w-16 h-16 rounded-lg"
              />
              <div className="flex flex-col justify-center text-white truncate">
                <span className="font-semibold text-sm md:text-md">
                  {activeSong.title}
                </span>
              </div>
              <button
                onClick={handleLikeClick}
                className="ml-3 focus:outline-none"
              >
                {isLiked ? (
                  <FaHeart className="text-red-700 text-2xl transition-colors duration-200" />
                ) : (
                  <FaRegHeart className="text-gray-300 text-2xl hover:text-[#1ed760] transition-colors duration-200" />
                )}
              </button>
            </>
          ) : (
            <div className="flex space-x-6">
              <div>
                <img
                  src={activeSong.thumbnail}
                  alt="Song Thumbnail"
                  className="w-16 h-16 rounded-lg"
                />
              </div>
              <div className="flex flex-col justify-center text-white truncate">
                <span className="font-semibold text-sm md:text-md w-[75vw]">
                  {activeSong.title}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {isOpen && !isFullScreen && (
        <>
          <div className="flex justify-center items-center gap-4 w-full md:w-[30%] mb-2 md:mb-0">
            <button
              className="text-white hover:text-[#1ed760] transition-colors duration-200 focus:outline-none"
              onClick={skipPrevious}
            >
              <FaStepBackward style={{ fontSize: '30px' }} />
            </button>
            <button
              className="text-white hover:text-[#1ed760] transition-colors duration-200 focus:outline-none"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <FaPause
                  className="text-orange-400"
                  style={{ fontSize: '40px' }}
                />
              ) : (
                <FaPlay
                  className="text-orange-400"
                  style={{ fontSize: '40px' }}
                />
              )}
            </button>
            <button
              className="text-white hover:text-[#1ed760] transition-colors duration-200 focus:outline-none"
              onClick={handleNext}
            >
              <FaStepForward style={{ fontSize: '30px' }} />
            </button>
          </div>

          <div className="flex flex-col w-full md:w-[25%] items-center">
            <input
              type="range"
              min={0}
              max={1}
              step="any"
              value={played}
              onChange={handleSeekChange}
              className={`w-full h-1 rounded-lg appearance-none cursor-pointer focus:outline-none ${
                isPlaying ? 'bg-[#1DB954]' : 'bg-gray-600'
              } transition-colors duration-200`}
            />
            <div className="time text-white text-xs mt-1 flex justify-between w-full px-2">
              <span>{formatTime(played * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </>
      )}

      <button
        className="absolute -top-6 right-2 text-white"
        onClick={toggleFullScreen}
      >
        <FaChevronUp className="h-6 w-12" />
      </button>

      {isFullScreen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90">
          <div className="relative">
            <ReactPlayer
              ref={playerRef}
              url={`https://www.youtube.com/watch?v=${activeSong.videoId}`}
              playing={isPlaying}
              onProgress={handleProgress}
              onDuration={handleDuration}
              onEnded={handleNext}
              width="80vw"
              height="45vw"
              config={{
                youtube: {
                  playerVars: {
                    controls: 0,
                    modestbranding: 1,
                    playsinline: 1,
                    fs: 0,
                    rel: 0,
                    iv_load_policy: 3, // Hides video annotations
                  },
                },
              }}
            />
            {/* Overlay div to cover YouTube overlays */}
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{ backgroundColor: 'transparent', pointerEvents: 'none' }}
            ></div>
          </div>
          <div className="text-white text-lg mt-4">{activeSong.title}</div>
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              className="text-white hover:text-[#1ed760] transition-colors duration-200 focus:outline-none"
              onClick={skipPrevious}
            >
              <FaStepBackward style={{ fontSize: '30px' }} />
            </button>
            <button
              className="text-white hover:text-[#1ed760] transition-colors duration-200 focus:outline-none"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <FaPause style={{ fontSize: '40px' }} />
              ) : (
                <FaPlay style={{ fontSize: '40px' }} />
              )}
            </button>
            <button
              className="text-white hover:text-[#1ed760] transition-colors duration-200 focus:outline-none"
              onClick={handleNext}
            >
              <FaStepForward style={{ fontSize: '30px' }} />
            </button>
          </div>
          <button
            className="absolute top-4 right-4 text-white"
            onClick={toggleFullScreen}
          >
            <FaChevronDown className="h-12 w-20" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;

