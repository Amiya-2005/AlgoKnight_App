import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Avatar from '../common/Avatar';

import {  Menu, Moon, Sun, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import Button from '../common/Button';

const Navbar = ({ toggleSidebar, scrolled }) => {
  const { currentUser: user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();


  return (
    <nav className={`fixed top-0 left-0 right-0 z-10 h-[9vh] min-h-[63px] transition-all duration-300 ${scrolled ? 'bg-white dark:bg-slate-900 shadow-md' : 'bg-transparent'
      }  border-b-1 border-b-transparent dark:lg:border-b-gray-700 shadow-xs`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Logo & hamburger */}
          <div className="flex items-center">
            <button
              className="w-7 p-2 rounded-md text-gray-600 dark:text-gray-300 focus:outline-none xl:hidden"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              {<Menu size={20} />}
            </button>

            <Link to="/" className="flex items-center ml-2 xl:ml-0">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">Algo</span>
              <span className="text-gray-800 dark:text-white font-bold text-xl">Knight</span>
            </Link>
          </div>

          {/* Center: Main navigation (desktop only) */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" current={location.pathname === '/'}>Home</NavLink>
            <NavLink to="/stumbles" current={location.pathname === '/stumbles'}>Tricky Problems</NavLink>
            <NavLink to="/concepts" current={location.pathname === '/concepts'}>Saved Notes</NavLink>
          </div>

          {/* Right section: User menu & actions */}
          <div className="min-w-1/6 flex items-center space-x-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>


            {/* User menu */}
            {user ? (
              <div className="relative">
                  <div className="flex items-center">
                    <Avatar
                      src={user.avatar}
                      userName={user.userName}
                      size="sm"
                      className="ring-2 ring-white dark:ring-slate-800"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block transition-all">
                      {user.userName}
                    </span>
                  </div>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="md" dark={theme === 'dark'} icon={<User />}>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Helper component for navbar links
const NavLink = ({ to, current, children }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${current
      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'
      }`}
  >
    {children}
  </Link>
);

export default Navbar;

