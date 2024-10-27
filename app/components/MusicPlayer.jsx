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
    setPlaying,
  } = useMusicPlayer();

  const [isOpen, setIsOpen] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if the device is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (current) {
      const isAlreadyLiked = playlist.some(
        (song) => song.videoId === current.videoId && song.liked
      );
      setIsLiked(isAlreadyLiked);
    }
  }, [current, playlist]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        skipPrevious();
      } 
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, skipPrevious, togglePlayPause]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

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
    <div
      className={`fixed bottom-0 left-0 right-0 bg-[#121212] border-t-2 border-black flex flex-col md:flex-row items-center justify-between z-50 transition-all duration-500 ${
        isOpen ? 'h-auto p-4' : 'h-20 p-2'
      }`}
    >
      {/* ReactPlayer is always rendered to maintain playerRef consistency */}
      <ReactPlayer
        ref={playerRef}
        url={`https://www.youtube.com/watch?v=${activeSong.videoId}`}
        playing={isPlaying}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={handleNext}
        width={isFullScreen && !isMobile ? '80vw' : '0px'}
        height={isFullScreen && !isMobile ? '45vw' : '0px'}
        style={{
          display: isFullScreen && !isMobile ? 'block' : 'none',
          position: isFullScreen && !isMobile ? 'fixed' : 'absolute',
          top: isFullScreen && !isMobile ? '50%' : '0',
          left: isFullScreen && !isMobile ? '50%' : '0',
          transform: isFullScreen && !isMobile ? 'translate(-50%, -50%)' : 'none',
          zIndex: isFullScreen && !isMobile ? 50 : -1,
        }}
        config={{
          youtube: {
            playerVars: {
              controls: 0,
              modestbranding: 1,
              playsinline: 1,
              fs: 0,
              rel: 0,
              iv_load_policy: 3,
            },
          },
        }}
      />

      {/* Left Section (Thumbnail and Song Info) */}
      <div className="flex items-center w-full md:w-1/3 gap-3">
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
        <button onClick={handleLikeClick} className="ml-3 focus:outline-none">
          {isLiked ? (
            <FaHeart className="text-red-700 absolute sm:relative top-24 right-4 sm:top-0 sm:right-0 text-2xl transition-colors duration-200" />
          ) : (
            <FaRegHeart className="text-gray-300 absolute sm:relative top-24 right-4 sm:top-0 sm:right-0  text-2xl hover:text-[#1ed760] transition-colors duration-200" />
          )}
        </button>

        {/* Toggle Button */}
        <button
          className="ml-auto text-white focus:outline-none md:hidden"
          onClick={toggleOpen}
        >
          {isOpen ? (
            <FaChevronDown className="h-6 w-6" />
          ) : (
            <FaChevronUp className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Center Section (Controls) */}
      {isOpen && (
        <div className="flex justify-center items-center gap-4 w-full md:w-1/3 mt-4 md:mt-0">
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
      )}

      {/* Right Section (Seek Bar) */}
      {isOpen && (
        <div className="flex flex-col w-full md:w-1/3 items-center mt-4 md:mt-0">
          <input
            type="range"
            min={0}
            max={1}
            step="any"
            value={played}
            onChange={(e) => {
              handleSeekChange(e);
              playerRef.current.seekTo(parseFloat(e.target.value));
            }}
            className={`w-full h-1 rounded-lg appearance-none cursor-pointer focus:outline-none ${
              isPlaying ? 'bg-[#1DB954]' : 'bg-gray-600'
            } transition-colors duration-200`}
          />
          <div className="time text-white text-xs mt-1 flex justify-between w-full px-2">
            <span>{formatTime(played * duration)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Full Screen Toggle */}
      <button
        className="absolute hidden md:block -top-6 right-2 text-white focus:outline-none"
        onClick={toggleFullScreen}
      >
        <FaChevronUp className="h-6 w-12" />
      </button>

      {/* Full Screen Mode */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90">
          {/* Display alternative content on mobile */}
          {isMobile && (
            <div className="flex flex-col items-center">
              <img
                src={activeSong.thumbnail}
                alt="Song Thumbnail"
                className="w-80 h-80 rounded-lg"
              />
            </div>
          )}

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
              onClick={() => {
                togglePlayPause();
                setPlaying(!isPlaying);
              }}
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
          {/* Close Full Screen Button */}
          <button
            className="absolute top-60 right-4 text-white focus:outline-none"
            onClick={toggleFullScreen}
          >
            <FaChevronDown className="h-7 w-7" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;

