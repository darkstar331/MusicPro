'use client'
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
  FaRandom,
  FaVolumeUp,
  FaVolumeMute,
  FaChevronUp,
  FaChevronDown,
} from 'react-icons/fa';
import { MdQueueMusic } from 'react-icons/md';

const MusicPlayer = () => {
  const {
    current,
    isPlaying,
    togglePlayPause,
    handleNext,
    skipPrevious,
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
    setPlaylist,
    playlist,
  } = useMusicPlayer();

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);

  // Set initial device settings
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initialize on mount

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
    artist: 'Rick Astley',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
  };

  const activeSong = current || dummyCurrent;

  const handleMuteToggle = () => {
    setIsMuted((prev) => !prev);
    playerRef.current.muted = !isMuted;
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  const toggleShrink = () => {
    setIsShrunk((prev) => !prev);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-[#181818] text-white border-t border-gray-800 px-4 z-50 ${
        isMobile
          ? 'flex flex-col items-start overflow-hidden transition-all duration-500 ease-in-out'
          : 'flex items-center'
      }`}
      style={{ maxHeight: isMobile ? (isShrunk ? '80px' : '200px') : 'auto' }}
    >
      {/* ReactPlayer (hidden visually, used for playback) */}
      <ReactPlayer
        ref={playerRef}
        url={`https://www.youtube.com/watch?v=${activeSong.videoId}`}
        playing={isPlaying}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={handleNext}
        volume={volume}
        muted={isMuted}
        width={isMobile ? '0px' : isFullScreen ? '100vw' : '0px'}
        height={isMobile ? '0px' : isFullScreen ? '80vh' : '0px'}
        style={{
          opacity: isMobile ? 0 : isFullScreen ? 1 : 0,
          pointerEvents: isMobile ? 'none' : isFullScreen ? 'auto' : 'none',
          position: 'fixed',
          top: '12%',
          left: '50%',
          transform: 'translate(-50%, 0)',
          transition: 'all 0.5s ease-in-out',
          zIndex: 100,
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
              showinfo: 0,
            },
          },
        }}
      />

      {/* Left Section - Thumbnail and Song Info */}
      <div className="flex items-center gap-3 w-full md:w-1/3 relative">
        <img
          src={activeSong.thumbnail}
          alt="Song Thumbnail"
          className="w-14 h-14 rounded-md"
        />
        <div className="flex flex-col text-white truncate">
          <div className="flex flex-col text-white w-full">
            <span className="font-semibold text-md md:text-lg whitespace-normal">
              {activeSong?.title
                ? activeSong.title.split(/[\|,()]/)[0].trim()
                : ''}
            </span>
            <span className="text-sm md:text-md text-gray-400 whitespace-normal">
              {activeSong?.title
                ? activeSong.title
                    .split(/[\|,()]/)
                    .slice(1)
                    .join(',')
                    .trim()
                : ''}
            </span>
          </div>
        </div>
        {(!isMobile || !isShrunk) && (
          <button onClick={handleLikeClick} className="ml-3 focus:outline-none">
            {isLiked ? (
              <FaHeart className="text-[#1DB954] text-xl transition-colors duration-200" />
            ) : (
              <FaRegHeart className="text-gray-300 text-xl hover:text-[#1DB954] transition-colors duration-200" />
            )}
          </button>
        )}
        {/* Chevron Button for Mobile Shrink/Expand */}
        {isMobile && (
          <button
            className="text-white focus:outline-none absolute right-0 top-0 mt-1 mr-1"
            onClick={toggleShrink}
          >
            {isShrunk ? (
              <FaChevronUp className="text-lg" />
            ) : (
              <FaChevronDown className="text-lg" />
            )}
          </button>
        )}
      </div>

      {/* Conditionally render Center and Right Sections */}
      {(!isMobile || !isShrunk) && (
        <>
          {/* Center Section - Playback Controls */}
          <div className="flex items-center justify-center w-full md:w-1/3 gap-6 mt-2 md:mt-0">
            <button
              className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
              onClick={() => console.log('Shuffle')}
            >
              <FaRandom />
            </button>
            <button
              className="text-white hover:text-[#1DB954] transition-colors duration-200 focus:outline-none"
              onClick={skipPrevious}
            >
              <FaStepBackward className="text-2xl" />
            </button>
            <button
              className="bg-white text-black rounded-full p-3 focus:outline-none"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <FaPause className="text-black" />
              ) : (
                <FaPlay className="text-black" />
              )}
            </button>
            <button
              className="text-white hover:text-[#1DB954] transition-colors duration-200 focus:outline-none"
              onClick={handleNext}
            >
              <FaStepForward className="text-2xl" />
            </button>
            <button
              className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
              onClick={() => console.log('Queue')}
            >
              <MdQueueMusic />
            </button>
          </div>

          {/* Right Section - Seek Bar, Volume, and Fullscreen Toggle */}
          <div className="flex items-center gap-4 w-full md:w-1/3 justify-end mt-2 md:mt-0">
            <div className="flex flex-col items-center w-full">
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
                className="w-full h-1 rounded-lg appearance-none cursor-pointer focus:outline-none bg-gray-600 transition-colors duration-200"
              />
              <div className="time text-white text-xs mt-1 flex justify-between w-full">
                <span>{formatTime(played * duration)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            {/* Hide Volume Controls on Mobile */}
            {!isMobile && (
              <>
                <button
                  className="text-white focus:outline-none"
                  onClick={handleMuteToggle}
                >
                  {isMuted ? (
                    <FaVolumeMute className="text-lg" />
                  ) : (
                    <FaVolumeUp className="text-lg" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    playerRef.current.volume = parseFloat(e.target.value);
                  }}
                  className="w-24 h-1 rounded-lg appearance-none cursor-pointer focus:outline-none bg-gray-400  duration-200"
                />
              </>
            )}
            {/* Chevron Button for Fullscreen Toggle on Desktop */}
            {!isMobile && (
              <button
                className="text-white focus:outline-none"
                onClick={toggleFullScreen}
              >
                {isFullScreen ? (
                  <FaChevronDown className="text-lg" />
                ) : (
                  <FaChevronUp className="text-lg" />
                )}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MusicPlayer;
