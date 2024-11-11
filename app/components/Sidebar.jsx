// components/Sidebar.js
'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from 'react';
import { FaHome, FaList, FaSignInAlt, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import Image from 'next/image';
import SearchBar from './SearchBar';

const Sidebar = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { setSearchTerm } = useMusicPlayer(); // To handle global search
    const [active, setActive] = useState('home');

    const handleNavigation = (route) => {
        setActive(route);
        router.push(route);
    };

    return (
        <div className="fixed top-0 left-0 h-full w-20 sm:w-64 bg-[#191414] text-white flex flex-col justify-between shadow-lg">
            {/* Top Section with Logo and Search */}
            <div>
                {/* Logo */}
                <div className="flex items-center justify-center sm:justify-start p-4">
                    <Image
                        src="/spotify-logo.png" // Replace with your logo path
                        alt="Logo"
                        width={40}
                        height={40}
                    />
                    <span className="hidden sm:block ml-2 font-bold text-xl">MusicLite</span>
                </div>
                
                {/* Search Bar */}
                <div className="hidden sm:block px-4 mb-4">
                    <SearchBar />
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col space-y-2">
                    {/* Home Button */}
                    <button
                        onClick={() => handleNavigation('/')}
                        className={`flex items-center p-2 rounded-lg hover:bg-[#1DB954] transition-colors ${
                            active === '/' ? 'bg-[#1DB954]' : ''
                        }`}
                        aria-label="Home"
                    >
                        <FaHome className="w-6 h-6" />
                        <span className="ml-3 hidden sm:inline">Home</span>
                    </button>

                    {/* Your Playlist Button */}
                    <button
                        onClick={() => {
                            if (status === 'authenticated') {
                                handleNavigation('/playlist');
                            }
                        }}
                        className={`flex items-center p-2 rounded-lg hover:bg-[#1DB954] transition-colors ${
                            active === '/playlist' ? 'bg-[#1DB954]' : ''
                        }`}
                        aria-label="Your Playlist"
                        disabled={status !== 'authenticated'}
                        title={status !== 'authenticated' ? "Sign in to access your playlist" : "Your Playlist"}
                    >
                        <FaList className="w-6 h-6" />
                        <span className="ml-3 hidden sm:inline">Your Playlist</span>
                    </button>
                </nav>
            </div>

            {/* Bottom Section with Auth Buttons */}
            <div className="p-4">
                {status === 'authenticated' ? (
                    <button
                        onClick={() => signOut()}
                        className="flex items-center p-2 rounded-lg hover:bg-red-600 transition-colors w-full"
                        aria-label="Sign Out"
                    >
                        <FaSignOutAlt className="w-6 h-6" />
                        <span className="ml-3 hidden sm:inline">Sign Out</span>
                    </button>
                ) : (
                    <button
                        onClick={() => signIn('github')}
                        className="flex items-center p-2 rounded-lg hover:bg-[#1DB954] transition-colors w-full"
                        aria-label="Sign In"
                    >
                        <FaSignInAlt className="w-6 h-6" />
                        <span className="ml-3 hidden sm:inline">Sign In</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
