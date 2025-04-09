'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type Capsule = {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  unlockDate: string;
  isUnlocked: boolean;
  accessMode: 'PRIVATE' | 'SHARED' | 'PUBLIC';
  language: string | null;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Capsule>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);
  
  // Fetch user's capsules
  useEffect(() => {
    if (status === 'authenticated') {
      fetchCapsules();
    }
  }, [status]);
  
  const fetchCapsules = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/capsules');
      
      if (!response.ok) {
        throw new Error('Failed to fetch capsules');
      }
      
      const data = await response.json();
      setCapsules(data);
    } catch (err: any) {
      console.error('Error fetching capsules:', err);
      setError(err.message || 'An error occurred while fetching your capsules');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSort = (field: keyof Capsule) => {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new field
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const getSortIcon = (field: keyof Capsule) => {
    if (field !== sortField) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  // Get time remaining until unlock
  const getTimeRemaining = (unlockDate: string) => {
    const now = new Date();
    const unlock = new Date(unlockDate);
    const diff = unlock.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ready to unlock';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 365) {
      const years = Math.floor(days / 365);
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    if (days > 30) {
      const months = Math.floor(days / 30);
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    }
    
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  };
  
  // Get access mode label
  const getAccessModeLabel = (mode: 'PRIVATE' | 'SHARED' | 'PUBLIC') => {
    switch (mode) {
      case 'PRIVATE':
        return 'Private';
      case 'SHARED':
        return 'Shared';
      case 'PUBLIC':
        return 'Public';
      default:
        return mode;
    }
  };
  
  // Get access mode badge color
  const getAccessModeColor = (mode: 'PRIVATE' | 'SHARED' | 'PUBLIC') => {
    switch (mode) {
      case 'PRIVATE':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'SHARED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'PUBLIC':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get language badge color
  const getLanguageColor = (language: string | null) => {
    if (!language) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    
    const colors: Record<string, string> = {
      JavaScript: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      TypeScript: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      Python: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      Java: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'C++': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      Rust: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      Go: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      HTML: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      CSS: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      SQL: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300',
    };
    
    return colors[language] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };
  
  // Filter capsules by search term
  const filteredCapsules = capsules.filter(capsule => 
    capsule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (capsule.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Sort capsules
  const sortedCapsules = [...filteredCapsules].sort((a, b) => {
    if (sortField === 'title' || sortField === 'description') {
      const aValue = (a[sortField] || '').toLowerCase();
      const bValue = (b[sortField] || '').toLowerCase();
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (sortField === 'createdAt' || sortField === 'unlockDate') {
      const aDate = new Date(a[sortField]).getTime();
      const bDate = new Date(b[sortField]).getTime();
      return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
    }
    return 0;
  });
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                My Capsules
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Manage your sealed code capsules
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-4">
              <div>
                <input
                  type="text"
                  placeholder="Search capsules..."
                  className="input-field"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Link href="/capsule/create" className="btn-primary">
                Create New Capsule
              </Link>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-md mb-6">
              {error}
              <button 
                className="ml-2 underline"
                onClick={fetchCapsules}
              >
                Try again
              </button>
            </div>
          )}
          
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">Loading your capsules...</p>
            </div>
          ) : capsules.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                No capsules found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You haven't created any code time capsules yet.
              </p>
              <Link href="/capsule/create" className="btn-primary">
                Create Your First Capsule
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('title')}
                      >
                        <div className="flex items-center">
                          <span>Title</span>
                          <span className="ml-1">{getSortIcon('title')}</span>
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center">
                          <span>Created</span>
                          <span className="ml-1">{getSortIcon('createdAt')}</span>
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('unlockDate')}
                      >
                        <div className="flex items-center">
                          <span>Unlock Date</span>
                          <span className="ml-1">{getSortIcon('unlockDate')}</span>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Access
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedCapsules.map((capsule) => (
                      <tr key={capsule.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {capsule.title}
                              </div>
                              {capsule.description && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                  {capsule.description}
                                </div>
                              )}
                              {capsule.language && (
                                <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLanguageColor(capsule.language)}`}>
                                  {capsule.language}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(capsule.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {formatDate(capsule.unlockDate)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {getTimeRemaining(capsule.unlockDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {capsule.isUnlocked ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              Unlocked
                            </span>
                          ) : new Date(capsule.unlockDate) <= new Date() ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                              Ready to unlock
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              Sealed
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccessModeColor(capsule.accessMode)}`}>
                            {getAccessModeLabel(capsule.accessMode)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            href={`/capsule/${capsule.id}`} 
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4"
                          >
                            View
                          </Link>
                          {!capsule.isUnlocked && (
                            <Link 
                              href={`/capsule/${capsule.id}/edit`} 
                              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              Edit
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 