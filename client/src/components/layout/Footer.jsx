import { Link } from 'react-router-dom';
import { Github, Twitter, Coffee } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
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
            <div className="flex justify-center md:justify-end space-x-6">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                <span className="sr-only">GitHub</span>
                <Github size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                <span className="sr-only">Twitter</span>
                <Twitter size={20} />
              </a>
              <a 
                href="https://ko-fi.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                <span className="sr-only">Support</span>
                <Coffee size={20} />
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