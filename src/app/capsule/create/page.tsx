'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { encryptData } from '@/utils/encryption';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
);

// Available programming languages
const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'csharp', name: 'C#' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'html', name: 'HTML' },
  { id: 'css', name: 'CSS' },
  { id: 'sql', name: 'SQL' },
];

// Map Monaco languages to display names
const LANGUAGE_MAP: Record<string, string> = {
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'python': 'Python',
  'java': 'Java',
  'cpp': 'C++',
  'csharp': 'C#',
  'go': 'Go',
  'rust': 'Rust',
  'html': 'HTML',
  'css': 'CSS',
  'sql': 'SQL',
};

export default function CreateCapsulePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Start coding here...');
  const [note, setNote] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [accessMode, setAccessMode] = useState<'PRIVATE' | 'SHARED' | 'PUBLIC'>('PRIVATE');
  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [passphraseHint, setPassphraseHint] = useState('');
  const [sharedEmails, setSharedEmails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Enforce minimum unlock date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minUnlockDate = tomorrow.toISOString().split('T')[0];
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);
  
  // Set default unlock date (1 month from now)
  useEffect(() => {
    const defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() + 1);
    setUnlockDate(defaultDate.toISOString().split('T')[0]);
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!title) {
      setError('Title is required');
      return;
    }
    
    if (title.length > 100) {
      setError('Title must be 100 characters or less');
      return;
    }
    
    if (description && description.length > 500) {
      setError('Description must be 500 characters or less');
      return;
    }
    
    if (!unlockDate) {
      setError('Unlock date is required');
      return;
    }
    
    if (new Date(unlockDate) < tomorrow) {
      setError('Unlock date must be at least tomorrow');
      return;
    }
    
    if (!passphrase) {
      setError('Passphrase is required to encrypt your capsule');
      return;
    }
    
    if (passphrase.length < 8) {
      setError('Passphrase must be at least 8 characters long');
      return;
    }
    
    if (passphrase !== confirmPassphrase) {
      setError('Passphrases do not match');
      return;
    }
    
    if (passphraseHint && passphraseHint.length > 100) {
      setError('Passphrase hint must be 100 characters or less');
      return;
    }
    
    if (note && note.length > 2000) {
      setError('Note must be 2000 characters or less');
      return;
    }
    
    // Validate shared emails format
    if (accessMode === 'SHARED' && sharedEmails) {
      const emails = sharedEmails.split(',').map(email => email.trim());
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      for (const email of emails) {
        if (!emailRegex.test(email)) {
          setError(`Invalid email format: ${email}`);
          return;
        }
      }
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Encrypt the code
      const encryptedCode = encryptData(code, passphrase);
      
      // Prepare capsule data
      const capsuleData = {
        title,
        description,
        language: LANGUAGE_MAP[language] || language,
        codeContent: encryptedCode,
        note,
        accessMode,
        passHint: passphraseHint,
        unlockDate: new Date(unlockDate).toISOString(),
        sharedEmails: accessMode === 'SHARED' ? sharedEmails.split(',').map(email => email.trim()) : [],
      };
      
      // Submit to API
      const response = await fetch('/api/capsules/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(capsuleData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create capsule');
      }
      
      // Redirect to dashboard on success
      router.push('/dashboard?created=true');
    } catch (err: any) {
      console.error('Error creating capsule:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };
  
  // Show loading state if session is loading
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
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Create New Time Capsule
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Seal your code with a future unlock date
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            {/* Capsule Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  className="input-field"
                  placeholder="My First Project"
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {title.length}/100 characters
                </p>
              </div>
              
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input-field"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  maxLength={500}
                  className="input-field"
                  placeholder="Brief description of this code capsule"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {description.length}/500 characters
                </p>
              </div>
            </div>
            
            {/* Code Editor */}
            <div>
              <label htmlFor="code-editor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Code Content
              </label>
              <div className="border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden" style={{ height: '400px' }}>
                <MonacoEditor
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    wordWrap: 'on',
                  }}
                  theme={typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'light'}
                />
              </div>
            </div>
            
            {/* Additional Note */}
            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Additional Note
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                maxLength={2000}
                className="input-field"
                placeholder="Add a personal note to your future self or others who will open this capsule"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {note.length}/2000 characters
              </p>
            </div>
            
            {/* Unlock Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="unlock-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Unlock Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="unlock-date"
                  type="date"
                  value={unlockDate}
                  onChange={(e) => setUnlockDate(e.target.value)}
                  min={minUnlockDate}
                  max="2099-12-31"
                  className="input-field"
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Minimum 1 day from today
                </p>
              </div>
              
              <div>
                <label htmlFor="access-mode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Access Mode <span className="text-red-500">*</span>
                </label>
                <select
                  id="access-mode"
                  value={accessMode}
                  onChange={(e) => setAccessMode(e.target.value as 'PRIVATE' | 'SHARED' | 'PUBLIC')}
                  className="input-field"
                >
                  <option value="PRIVATE">Private (only you)</option>
                  <option value="SHARED">Shared (specific people)</option>
                  <option value="PUBLIC">Public (anyone after unlock)</option>
                </select>
              </div>
              
              {accessMode === 'SHARED' && (
                <div className="md:col-span-2">
                  <label htmlFor="shared-emails" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Shared With (Email Addresses) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="shared-emails"
                    value={sharedEmails}
                    onChange={(e) => setSharedEmails(e.target.value)}
                    rows={2}
                    className="input-field"
                    placeholder="Enter email addresses separated by commas"
                    required={accessMode === 'SHARED'}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Comma-separated list of email addresses
                  </p>
                </div>
              )}
            </div>
            
            {/* Encryption Settings */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Security Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="passphrase" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Passphrase <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="passphrase"
                    type="password"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    minLength={8}
                    className="input-field"
                    placeholder="Enter a strong passphrase"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Minimum 8 characters. You'll need this to unlock your code.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="confirm-passphrase" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Passphrase <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="confirm-passphrase"
                    type="password"
                    value={confirmPassphrase}
                    onChange={(e) => setConfirmPassphrase(e.target.value)}
                    className="input-field"
                    placeholder="Confirm your passphrase"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="passphrase-hint" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Passphrase Hint
                  </label>
                  <input
                    id="passphrase-hint"
                    type="text"
                    value={passphraseHint}
                    onChange={(e) => setPassphraseHint(e.target.value)}
                    maxLength={100}
                    className="input-field"
                    placeholder="Optional hint to help you remember your passphrase (will be visible to anyone with access)"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {passphraseHint.length}/100 characters
                  </p>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Creating Capsule...' : 'Seal This Capsule'}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 