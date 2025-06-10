import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  ChevronDown,
  ChevronRight,
  Clock,
  CircleUserRound,
  Crosshair,
  Code,
  Waypoints,
  BookDown,
  FileQuestion,
  Album,
  LogOut
} from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

let toggleSideBar;

const Sidebar = ({ isOpen, toggle, scrolled }) => {

  const {logout} = useContext(AuthContext);

  const handleLogout = () => {
    setTimeout(logout, 100);
    toast.success("Logged out successfully");
  }

  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState(null);

  // Reset expanded section when sidebar closes
  useEffect(() => {
    setExpandedSection(null);
  }, [isOpen]);

  toggleSideBar = () => {
    console.log("Toggle was called");
    setTimeout(toggle, 100);
  };
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <aside
      className={`fixed top-0 pt-10 left-0 bottom-0 xl:top-16 xl:pt-0 z-40 w-64 ${scrolled ? 'bg-white dark:bg-gray-900' : 'bg-transparent'}
       shadow-md border-r-1 border-r-transparent dark:border-r-gray-700 transition-all duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } xl:translate-x-0`}
    >
      <div className="h-full flex flex-col">

        {/* Main navigation links - Using overflow-y-auto only here */}
        <nav className='flex-1 px-3 py-2 space-y-1 overflow-auto thin-scrollbar'>
          <SidebarLink
            to="/dashboard"
            icon={<LayoutDashboard size={18} />}
            current={location.pathname === '/dashboard'}
          >
            Dashboard
          </SidebarLink>

          <SidebarLink
            to="/smartsheet"
            icon={<Crosshair size={18} />}
            current={location.pathname === '/smartsheet'}
          >
            Smart Sheet
          </SidebarLink>

          {/* Contests section */}
          <div>
            <SidebarLink
              to="/contests"
              icon={<Code size={18} />}
              current={location.pathname === '/contests'}
              onClick={() => toggleSection('contests')}
              dropdown={true}
              expanded={expandedSection === 'contests'}
            >
              Contests
            </SidebarLink>

            <div
              className={`pl-10 space-y-1 mt-1 transition-all duration-300 transform origin-top ${expandedSection === 'contests'
                ? 'max-h-40 opacity-100 scale-y-100'
                : 'max-h-0 opacity-0 scale-y-0 pointer-events-none'
                }`}
            >
              <SidebarSubLink
                to="/contests"
              >
                Upsolve
              </SidebarSubLink>
              <SidebarSubLink
                to="/contests"
                sectionId='favs'
              >
                Favorites
              </SidebarSubLink>
            </div>
          </div>

          <SidebarLink
            to="/network"
            icon={<Waypoints size={18} />}
            current={location.pathname === '/network'}
          >
            Network
          </SidebarLink>

          <SidebarLink
            to="/stumbles"
            icon={<FileQuestion size={18} />}
            extraClasses='md:hidden'
          >
            Tricky Problems
          </SidebarLink>
          <SidebarLink
            to="/concepts"
            icon={<Album size={18} />}
            extraClasses='md:hidden'
          >
            Saved Notes
          </SidebarLink>

          <SidebarLink
            to="/profile"
            sectionId="handles"
            icon={<BookDown size={18} />}
          >
            Add Handles
          </SidebarLink>

        </nav>

        {/* Secondary links at bottom - No scroll here */}
        <div className="flex-shrink-0">
          <div className="px-3 py-4 space-y-1 border-t border-gray-200 dark:border-slate-700">
            <SidebarLink
              to="/profile"
              icon={<CircleUserRound size={20} />}
              current={location.pathname === '/profile'}
            >
              Profile
            </SidebarLink>

            <SidebarLink
              to="/"
              onClick={handleLogout}
              icon={<LogOut size={18} />}
            >
              Sign out
            </SidebarLink>
          </div>

          {/* User progress section */}
          <div className="px-4 py-4 bg-blue-50 dark:bg-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm text-blue-700 dark:text-blue-400">Daily Goal</h4>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-300">2/5 problems</span>
            </div>
            <div className="w-full bg-blue-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
            </div>
            <div className="flex items-center mt-4 text-xs text-gray-600 dark:text-gray-400">
              <Clock size={14} className="mr-1" />
              <span>Streak: 7 days</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// Sidebar main link component
const SidebarLink = ({ to, sectionId, icon, current, children, onClick, dropdown = false, expanded = false, extraClasses}) => {
  const baseClasses = "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors";
  const activeClasses = "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
  const inactiveClasses = "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800";

  const content = (
    <>
      <span className="mr-3">{icon}</span>
      <span className="flex-1">{children}</span>
      {dropdown && (
        <span className="ml-2">
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
      )}
    </>
  );

  if (dropdown) {
    return (
      <button
        className={`${baseClasses} ${current ? activeClasses : inactiveClasses} w-full text-left ${extraClasses}`}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      to={to}
      state={{ sectionId: sectionId }}
      className={`${baseClasses} ${current ? activeClasses : inactiveClasses} ${extraClasses}`}
      onClick={() => {
        toggleSideBar();
        if(onClick) onClick();
      }}
    >
      {content}
    </Link>
  );
};

// Sidebar sub-link component
const SidebarSubLink = ({ to, current, sectionId, children }) => (
  <Link
    to={to}
    state={{ sectionId: sectionId }}
    className={`block py-2 pl-3 pr-4 text-sm rounded-md ${current
      ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
      }`}
    onClick={toggleSideBar}
  >
    {children}
  </Link>
);

export default Sidebar;