'use client';
import Image from 'next/image';
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import ReactLoading from 'react-loading';
import axios from 'axios';
import { FaGithub, FaUserCircle } from 'react-icons/fa';

const Header = () => {
    const { data: session, status } = useSession();
    const { playlist, setPlaylist } = useMusicPlayer();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === 'authenticated' && session) {
            fetchPlaylist();
        }
    }, [status, session]);

    const savePlaylistToServer = async () => {
        if (!session) {
            console.error('No session found. Cannot save playlist.');
            return;
        }

        try {
            const response = await fetch('/api/setSongs', {
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
            console.log('Playlist saved successfully.');
        } catch (error) {
            console.error('Error saving playlist:', error);
        }
    };

    const fetchPlaylist = async () => {
        setLoading(true); // Start loading
        try {
            // Make the GET request using axios
            const response = await axios.get(`/api/setSongs?userId=${session.user.id}`);

            // axios automatically throws an error for response statuses outside the 2xx range,
            // so we don't need to manually check `response.ok`.
            if (response.status !== 200) {
                throw new Error('Failed to fetch playlist');
            }

            // response.data contains the parsed JSON
            const data = response.data;
            console.log('Fetched data:', data);

            // Update the playlist state with the fetched data
            setPlaylist(data.playlist);
        } catch (error) {
            console.error('Error fetching playlist:', error.message);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleSignOut = async () => {
        // First, save the playlist to the server
        await savePlaylistToServer();

        // Then, sign out the user
        signOut();
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleOutsideClick = (event) => {
        if (!event.target.closest('.dropdown-container')) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <nav className='flex justify-between items-center p-5 bg-transparent text-white border-b-4 border-white shadow-md'>
            <div className="flex items-center space-x-3 font-extrabold md:text-2xl text-xl">
                <img className="md:w-14 w-9 rounded-full" src="/favicon.ico" alt="Logo" />
                <span className="tracking-wide">STREAM</span>
            </div>

            <div>
                {status === 'authenticated' ? (
                    <>
                        {loading ? (
                            <div className="flex justify-center items-center">
                                <ReactLoading type="bars" color="#ffffff" height={30} width={30} />
                            </div>
                        ) : (
                            <div className="relative dropdown-container">
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    <FaUserCircle className="w-5 h-5 md:w-10 md:h-7" />
                                    <span className="font-medium">Account</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>

                                {dropdownVisible && (
                                    <div className="absolute right-0 mt-2 w-64 bg-slate-700 text-white rounded-lg shadow-lg py-3 z-10 animate-slide-down">
                                        <div className="flex items-center px-4 py-3 border-b border-gray-700">
                                            {session.user.image ? (
                                                <Image
                                                    className="rounded-full"
                                                    src={session.user.image}
                                                    alt="Profile"
                                                    width={40}
                                                    height={40}
                                                    quality={100}
                                                />
                                            ) : (
                                                <span className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.218 0 4.31.508 6.121 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14.5c3.312 0 6-2.688 6-6S15.312 2.5 12 2.5 6 5.188 6 8.5s2.688 6 6 6z"></path>
                                                    </svg>
                                                </span>
                                            )}
                                            <div className="ml-3">
                                                <p className="text-white font-semibold truncate max-w-[140px]">{session.user.name}</p>
                                                <p className="text-sm text-gray-400 truncate max-w-[140px]">{session.user.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center w-full text-left px-4 py-2 text-white hover:bg-gray-800 transition duration-300"
                                        >
                                            <svg className="w-5 h-5 mr-2 text-gray-400 group-hover:text-amber-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H3m12 0l-4-4m4 4l-4 4M21 5a2 2 0 00-2-2h-6a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2V5z"></path>
                                            </svg>
                                            Log Out
                                        </button>
                                    </div>
                                )}

                            </div>
                        )}
                    </>
                ) : (
                    <button
                        onClick={() => signIn('github')}
                        className="bg-gray-800 rounded-md w-24 hover:bg-pink-400 text-white font-medium border focus-within:border-amber-600  px-4 py-2 transition duration-300 flex items-center justify-center"
                    >
                        < FaGithub className="w-5 h-5 md:w-10 md:h-7" />
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Header;
