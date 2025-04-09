import Link from 'next/link';
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary-50 to-white dark:from-primary-950 dark:to-gray-900">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-900 dark:text-primary-100">
                  Seal Your Code for the Future
                </h1>
                
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Create time-locked code capsules to preserve your ideas, track your growth, or share with others when the time is right.
                </p>
                
                <div className="flex gap-4 pt-4">
                  <Link href="/auth/register" className="btn-primary">
                    Get Started
                  </Link>
                  <Link href="/feed" className="btn-secondary">
                    Explore Capsules
                  </Link>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                    <pre className="text-sm md:text-base overflow-x-auto">
                      <code className="language-javascript">
{`// Code Time Capsule Example
const myCapsule = {
  title: "My First Project",
  code: "console.log('Hello Future!')",
  createdOn: "${new Date().toISOString().split('T')[0]}",
  unlockDate: "${new Date(Date.now() + 31536000000).toISOString().split('T')[0]}",
  message: "Remember when you were just starting?"
};

// Seal it for the future!
CodeTimeCapsule.seal(myCapsule);`}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-primary-900 dark:text-primary-100">
              Why Use Code Time Capsule?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card">
                <h3 className="text-xl font-semibold mb-3 text-primary-700 dark:text-primary-300">Preserve Your Journey</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Capture your code at different points in your development journey and see how far you've come.
                </p>
              </div>
              
              <div className="card">
                <h3 className="text-xl font-semibold mb-3 text-primary-700 dark:text-primary-300">Secure Encryption</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  All capsules are encrypted with AES-256, ensuring your code remains private until you're ready to share it.
                </p>
              </div>
              
              <div className="card">
                <h3 className="text-xl font-semibold mb-3 text-primary-700 dark:text-primary-300">Share When Ready</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose whether your capsule should be private, shared with specific people, or publicly available upon unlocking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Unlocks Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-primary-900 dark:text-primary-100">
              Recently Unlocked Capsules
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* This would be populated dynamically in a real implementation */}
              <div className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300">First React App</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 text-xs rounded-full">JavaScript</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-3">
                  My first attempt at building a React application. It's a simple todo list but was a big step for me at the time!
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>Sealed: 2 years ago</span>
                  <span className="mx-2">•</span>
                  <span>Unlocked: Today</span>
                </div>
              </div>
              
              <div className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300">ML Algorithm</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 text-xs rounded-full">Python</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-3">
                  An early machine learning model I built to classify images. Looking back, I can see how much I've improved!
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>Sealed: 1 year ago</span>
                  <span className="mx-2">•</span>
                  <span>Unlocked: Yesterday</span>
                </div>
              </div>
              
              <div className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300">Game Engine</h3>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 text-xs rounded-full">C++</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-3">
                  My attempt at building a 2D game engine from scratch. Not very optimized but a good learning experience.
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>Sealed: 3 years ago</span>
                  <span className="mx-2">•</span>
                  <span>Unlocked: 3 days ago</span>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <Link href="/feed" className="btn-secondary">
                View All Public Capsules
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
} 