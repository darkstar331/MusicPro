'use client';
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
    const { data: session } = useSession();
    const [user, setUser] = useState({});
    const [current, setCurrent] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [playlist, setPlaylist] = useState([]);
    const playerRef = useRef(null);

    // Function to add a song to the playlist and database
    const handleAdd = async (song) => {
        setPlaylist((prevPlaylist) => [...prevPlaylist, song]);

        if (session) {
            try {
                const response = await fetch('/api/add-song', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: session.user.id,
                        song: song,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to add song to the database');
                }

                console.log('Song added successfully to the database');
            } catch (error) {
                console.error('Error adding song:', error);
            }
        }
    };

    // Function to remove a song from the playlist and database
    const handleRemove = async (videoId) => {
        removeFromPlaylist(videoId);

        if (session) {
            try {
                const response = await fetch('/api/remove-song', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: session.user.id,
                        videoId: videoId,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to remove song from the database');
                }

                console.log('Song removed successfully from the database');
            } catch (error) {
                console.error('Error removing song:', error);
            }
        }
    };

    // Save playlist to the server before the user leaves the page
    const savePlaylistToServer = async () => {
        if (!session) return;

        try {
            const response = await fetch('/api/save-playlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    playlist,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save playlist');
            }
        } catch (error) {
            console.error('Error saving playlist:', error);
        }
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            savePlaylistToServer();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [playlist, session]);

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.onended = handleNext;
        }
    }, [current, playlist]);

    const togglePlayPause = () => {
        setIsPlaying(prev => !prev);
    };

    const handleNext = () => {
        if (playlist.length === 0) return;

        const currentIndex = playlist.findIndex(song => song.videoId === current.videoId);
        const nextIndex = (currentIndex + 1) % playlist.length;

        setCurrent(playlist[nextIndex]);
        setIsLiked(playlist[nextIndex].liked);
        setPlayed(0);
        playerRef.current.seekTo(0);
        setIsPlaying(true);
    };

    const skipPrevious = () => {
        if (playlist.length === 0) return;

        const currentIndex = playlist.findIndex(song => song.videoId === current.videoId);
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;

        setCurrent(playlist[prevIndex]);
        setIsLiked(playlist[prevIndex].liked);
        setPlayed(0);
        playerRef.current.seekTo(0);
        setIsPlaying(true);
    };

    const handleProgress = (state) => {
        setPlayed(state.played);
    };

    const handleDuration = (duration) => {
        setDuration(duration);
    };

    const handleSeekChange = (e) => {
        const seekTo = parseFloat(e.target.value);
        playerRef.current.seekTo(seekTo);
        setPlayed(seekTo);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const toggleLike = () => {
        setIsLiked(prev => !prev);

        const updatedPlaylist = playlist.map(song =>
            song.videoId === current.videoId ? { ...song, liked: !song.liked } : song
        );
        setPlaylist(updatedPlaylist);
    };

    const removeFromPlaylist = (videoId) => {
        const updatedPlaylist = playlist.filter(song => song.videoId !== videoId);
        setPlaylist(updatedPlaylist);

        if (current && current.videoId === videoId) {
            setIsLiked(false);
        }
    };

    return (
        <MusicPlayerContext.Provider value={{
            current,
            setCurrent,
            setPlaylist,
            playlist,
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
            removeFromPlaylist,
            handleAdd,
            handleRemove,
            user,
            setUser,
        }}>
            {children}
        </MusicPlayerContext.Provider>
    );
};

export const useMusicPlayer = () => {
    return useContext(MusicPlayerContext);
};
