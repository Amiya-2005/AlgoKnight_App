import { useState, useEffect, useContext, Children } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Buffer from '../common/Buffer';
import { AuthContext } from '../../context/AuthContext';


const PageContainer = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false); //only for hamburger-triggered / overlay format of sidebar
  const [scrolled, setScrolled] = useState(false);

  const { loading, showLoader, fadeOutLoader, setShowLoader, setFadeOutLoader } = useContext(AuthContext);


  useEffect(() => {
    if (!loading) {
      setFadeOutLoader(true);
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);



  // Close overlay sidebar when screen size changes
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle sidebar visibility (for mobile)
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='max-h-screen'>
      {showLoader && <Buffer fullScreen fadeOut={fadeOutLoader} />}

      <div className="flex flex-col min-h-screen w-full bg-gray-50 dark:bg-gray-950">
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 xl:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Navbar - always full width */}
        <Navbar toggleSidebar={toggleSidebar} scrolled={scrolled} />

        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} scrolled={scrolled} />

        {/* Right Side wrapper - Page + Footer */}
        <div className={`flex flex-col flex-grow mt-16 min-h-[120.5vh]`}>
          {/* Main content area */}
          <div className={`w-full flex-grow flex justify-center`}>
            {children}
          </div>
          {/* Footer */}
          <div className={"xl:ml-64"}>
            <Footer />
          </div>

        </div>
      </div>
    </div>
  );
};

export default PageContainer;