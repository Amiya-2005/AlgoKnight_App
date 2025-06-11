import { Link } from 'react-router-dom';
import { CodeForcesIcon, LeetCodeIcon, LinkedInIcon } from '../common/Icons';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const { theme } = useContext(ThemeContext);

  return (
    <footer className="bg-gray-200 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 h-[13rem] py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-200 dark:bg-slate-900">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <Link to="/" className="flex items-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">Algo</span>
              <span className="text-gray-800 dark:text-white font-bold text-xl">Knight</span>
            </Link>
          </div>

          <div className="mt-4 md:mt-0">
            <div className="flex justify-center md:justify-end space-x-4">
              <a
                href="https://www.linkedin.com/in/amiya-ranjan-maharana/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white dark:bg-slate-700 text-gray-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-300 shadow-md hover:shadow-lg dark:shadow-xl dark:shadow-black/40 dark:hover:shadow-2xl dark:hover:shadow-black/50 border border-gray-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-400 rounded-xl p-2 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="sr-only">LinkedIn Account</span>
                <LinkedInIcon size={20} />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-500/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
              </a>

              <a
                href="https://codeforces.com/profile/sniper_0101"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white dark:bg-slate-700 text-gray-600 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-300 shadow-md hover:shadow-lg dark:shadow-xl dark:shadow-black/40 dark:hover:shadow-2xl dark:hover:shadow-black/50 border border-gray-300 dark:border-slate-600 hover:border-red-300 dark:hover:border-red-400 rounded-xl p-2 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="sr-only">Codeforces Profile</span>
                <CodeForcesIcon size={20} />
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent dark:from-red-500/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
              </a>

              <a
                href="https://leetcode.com/u/amiya05/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white dark:bg-slate-700 text-gray-600 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-300 shadow-md hover:shadow-lg dark:shadow-xl dark:shadow-black/40 dark:hover:shadow-2xl dark:hover:shadow-black/50 border border-gray-300 dark:border-slate-600 hover:border-orange-300 dark:hover:border-orange-400 rounded-xl p-2 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="sr-only">Leetcode Profile</span>
                <LeetCodeIcon size={20} theme={theme} />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-500/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-400 dark:border-slate-800 pt-8 md:flex md:items-center md:justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
            © {currentYear} AlgoKnight. All rights reserved.
          </div>

          <nav className="mt-4 md:mt-0 flex flex-wrap justify-center">
            <Link to="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mx-3 my-1">
              About
            </Link>
            <Link to="/blog" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mx-3 my-1">
              Blog
            </Link>
            <Link to="/help" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mx-3 my-1">
              Help
            </Link>
            <Link to="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mx-3 my-1">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mx-3 my-1">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;