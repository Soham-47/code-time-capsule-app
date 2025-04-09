'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  
  const isActive = (path: string) => {
    return pathname === path ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300';
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              Code Time Capsule
            </span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className={`${isActive('/')} hover:text-primary-600 dark:hover:text-primary-400 transition-colors`}>
              Home
            </Link>
            <Link href="/feed" className={`${isActive('/feed')} hover:text-primary-600 dark:hover:text-primary-400 transition-colors`}>
              Public Feed
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className={`${isActive('/dashboard')} hover:text-primary-600 dark:hover:text-primary-400 transition-colors`}>
                  My Capsules
                </Link>
                <Link href="/capsule/create" className={`${isActive('/capsule/create')} hover:text-primary-600 dark:hover:text-primary-400 transition-colors`}>
                  Create Capsule
                </Link>
              </>
            ) : null}
          </nav>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                  {session?.user?.name || 'Dashboard'}
                </Link>
                <button 
                  onClick={() => signOut()} 
                  className="text-sm px-3 py-1.5 border border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 rounded-md hover:bg-primary-50 dark:hover:bg-gray-800"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                  Log In
                </Link>
                <Link href="/auth/register" className="text-sm px-3 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 