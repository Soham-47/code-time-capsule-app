'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type PublicCapsule = {
  id: string;
  title: string;
  description: string | null;
  language: string | null;
  unlockDate: string;
  createdAt: string;
  user: {
    username: string;
    image: string | null;
  };
  _count: {
    comments: number;
  };
};

// Feed content component that uses useSearchParams
function FeedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [capsules, setCapsules] = useState<PublicCapsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(searchParams?.get('language') || null);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>(
    (searchParams?.get('sort') as 'recent' | 'popular') || 'recent'
  );
  
  useEffect(() => {
    fetchPublicCapsules();
  }, [selectedLanguage, sortBy]);
  
  const fetchPublicCapsules = async () => {
    try {
      setLoading(true);
      
      let url = '/api/feed?';
      if (selectedLanguage) {
        url += `language=${encodeURIComponent(selectedLanguage)}&`;
      }
      url += `sort=${sortBy}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch public capsules');
      }
      
      const data = await response.json();
      setCapsules(data);
    } catch (err: any) {
      console.error('Error fetching public capsules:', err);
      setError(err.message || 'An error occurred while fetching public capsules');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLanguageChange = (language: string | null) => {
    setSelectedLanguage(language);
    
    // Update URL with new params
    const params = new URLSearchParams(searchParams as any);
    if (language) {
      params.set('language', language);
    } else {
      params.delete('language');
    }
    params.set('sort', sortBy);
    
    router.push(`/feed?${params.toString()}`);
  };
  
  const handleSortChange = (sort: 'recent' | 'popular') => {
    setSortBy(sort);
    
    // Update URL with new params
    const params = new URLSearchParams(searchParams as any);
    params.set('sort', sort);
    if (selectedLanguage) {
      params.set('language', selectedLanguage);
    }
    
    router.push(`/feed?${params.toString()}`);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  const getLanguageColor = (language: string | null) => {
    if (!language) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    
    const colors: Record<string, string> = {
      JavaScript: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      TypeScript: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      Python: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      Java: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'C++': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'C#': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      Rust: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      Go: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      HTML: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      CSS: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      SQL: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300',
    };
    
    return colors[language] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };
  
  // List all supported languages
  const languages = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'C++',
    'C#',
    'Rust',
    'Go',
    'HTML',
    'CSS',
    'SQL',
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Public Capsules Feed
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Browse unlocked code capsules shared by the community
            </p>
          </div>
          
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <label htmlFor="language-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Filter by Language
                </label>
                <select
                  id="language-filter"
                  value={selectedLanguage || ''}
                  onChange={(e) => handleLanguageChange(e.target.value || null)}
                  className="input-field"
                >
                  <option value="">All Languages</option>
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort By
                </label>
                <div className="flex rounded-md shadow-sm" role="group">
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium ${
                      sortBy === 'recent'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    } border border-gray-300 dark:border-gray-600 rounded-l-md`}
                    onClick={() => handleSortChange('recent')}
                  >
                    Most Recent
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium ${
                      sortBy === 'popular'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    } border border-gray-300 dark:border-gray-600 border-l-0 rounded-r-md`}
                    onClick={() => handleSortChange('popular')}
                  >
                    Most Popular
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-md mb-6">
              {error}
              <button 
                className="ml-2 underline"
                onClick={fetchPublicCapsules}
              >
                Try again
              </button>
            </div>
          )}
          
          {/* Capsules Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading capsules...</p>
            </div>
          ) : capsules.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                No capsules found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {selectedLanguage 
                  ? `There are no unlocked public capsules with ${selectedLanguage} yet.`
                  : 'There are no unlocked public capsules yet.'}
              </p>
              <Link href="/capsule/create" className="btn-primary">
                Create a Capsule
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capsules.map((capsule) => (
                <Link
                  key={capsule.id}
                  href={`/capsule/${capsule.id}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
                        {capsule.title}
                      </h3>
                      {capsule.language && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLanguageColor(capsule.language)}`}>
                          {capsule.language}
                        </span>
                      )}
                    </div>
                    
                    {capsule.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
                        {capsule.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <span>
                          by <span className="font-medium">{capsule.user.username}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>
                          Unlocked: {formatDate(capsule.unlockDate)}
                        </span>
                        <span>
                          {capsule._count.comments} comments
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {/* Pagination would go here in a real implementation */}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Main page component that wraps the content in Suspense
export default function FeedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <FeedContent />
    </Suspense>
  );
} 