import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';

const NotFoundPage = () => {
  return (
      <div className="xl:ml-64 flex flex-col items-center justify-center min-h-[70vh] mt-15 px-4 text-center">
        <div className="mb-8">
          <svg 
            className="w-24 h-24 text-gray-400 dark:text-gray-600 mx-auto" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">Page Not Found</h2>
        
        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/" 
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Home
          </Link>
          <Link 
            to="/dashboard" 
            className="px-6 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
        
        <div className="mt-12">
          <p className="text-gray-500 dark:text-gray-500">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
  );
};

export default NotFoundPage;