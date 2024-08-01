"use client";

import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext'; // Ensure the path is correct

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('button[aria-controls="navbar-user"]')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/assets/classmatelogo.jpg" className="h-8 w-auto" alt="ClassMate Logo" />
          <span className="self-center text-2xl font-mono text-slate-950 whitespace-nowrap">ClassMate</span>
        </a>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {user ? (
            <>
              <button
                type="button"
                className="flex text-sm bg-gray-100 text-slate-950 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 transition duration-150 ease-in-out"
                onClick={toggleDropdown}
              >
                <span className="sr-only">Open user menu</span>
                <Image className="w-8 h-8 rounded-full" src={user.profilePictureUrl} alt="user photo" width={32} height={32} />
              </button>
              {/* Dropdown menu */}
              <div
                ref={dropdownRef}
                className={`absolute right-3 top-full mt-2 w-48 text-base list-none bg-white divide-y divide-gray-200 rounded-lg shadow-lg ${isDropdownOpen ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}
                id="user-dropdown"
              >
                <div className="px-4 py-3">
                  <span className="block text-sm text-slate-950 font-semibold">{user.name}</span>
                  <span className="block text-sm text-gray-500 truncate">{user.email}</span>
                </div>
                <ul className="py-2">
                  <li>
                    <a href="#" className="block px-4 py-2 text-slate-950 hover:bg-gray-100 transition duration-150 ease-in-out">Dashboard</a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 text-slate-950 hover:bg-gray-100 transition duration-150 ease-in-out">Settings</a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 text-slate-950 hover:bg-gray-100 transition duration-150 ease-in-out">Earnings</a>
                  </li>
                  <li>
                    <button onClick={logout} className="block px-4 py-2 text-slate-950 hover:bg-gray-100 transition duration-150 ease-in-out">Sign out</button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <button
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-slate-950 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition duration-150 ease-in-out"
              onClick={toggleMobileMenu}
              aria-controls="navbar-user"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Toggle main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          )}
        </div>
        <div
          ref={mobileMenuRef}
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'block' : 'hidden'}`}
          id="navbar-user"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-200 rounded-lg bg-white md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li>
              <a href="/" className={`block py-2 px-3 ${usePathname() === '/' ? 'text-slate-950 bg-gray-100 rounded md:bg-transparent md:text-slate-950 md:p-0 md:hover:text-blue-700' : 'text-slate-950 hover:bg-gray-100'} transition duration-150 ease-in-out`} aria-current="page">Home</a>
            </li>
            <li>
              <a href="/login" className={`block py-2 px-3 ${usePathname() === '/login' ? 'text-slate-950 bg-gray-100 rounded md:bg-transparent md:text-slate-950 md:p-0 md:hover:text-blue-700' : 'text-slate-500 hover:bg-gray-200'} transition duration-150 ease-in-out`}>Login / Register</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
