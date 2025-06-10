import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import Buffer from '../components/common/Buffer';
import Button from '../components/common/Button';
import { CodeChefIcon, CodeForcesIcon, LeetCodeIcon } from '../components/common/Icons';
import { UpsolveContext } from '../context/UpsolveContext';
import { toast } from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';

import { ChartNoAxesCombined, Heart, Link2, Medal, Search, Star, Target, Trash2 } from 'lucide-react'

// Animation wrapper component
const AnimatedCard = ({ children, className = "", delay = 0 }) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transform transition-all duration-700 ease-out ${hasAnimated
        ? 'translate-y-0 opacity-100'
        : 'translate-y-8 opacity-0'
        } ${className}`}
    >
      {children}
    </div>
  );
};


const getRatingColor = (rating) => {
  if (rating >= 2100) return 'text-red-500';
  if (rating >= 1900) return 'text-orange-500';
  if (rating >= 1600) return 'text-purple-500';
  if (rating >= 1400) return 'text-blue-500';
  if (rating >= 1200) return 'text-cyan-500';
  return 'text-green-500';
};

export default function ContestsPage() {
  const [recentContests, setRecentContests] = useState([]);
  const [favoriteContests, setFavoriteContests] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContest, setNewContest] = useState({
    name: '',
    url: '',
    platform: 'codeforces',
    short_note: ''
  });
  const [pageLoading, setPageLoading] = useState(true);
  const [fadeOutPageLoader, setFadeOutPageLoader] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  const { theme } = useContext(ThemeContext);

  const platformIcons = {
    codeforces: <CodeForcesIcon />,
    codechef: <CodeChefIcon />,
    leetcode: <LeetCodeIcon theme={theme} />,
  };

  const { getUpsolve, getFavorites, addToFavorite, removeFromFavorite } = useContext(UpsolveContext);

  useEffect(() => {
    const fetchData = async () => {
      const recentContests = await getUpsolve();
      const favoriteContests = await getFavorites();
      setRecentContests(recentContests);
      setFavoriteContests(favoriteContests);
      setFadeOutPageLoader(true);

      console.log("Up : ", recentContests);
      console.log("Fav : ", favoriteContests);

      setTimeout(() => {
        setPageLoading(false);
        setAnimationDone(true);
      }, 500);
    };

    fetchData();
  }, []);

  const location = useLocation();
  const [sectionId, setSectionId] = useState(location.state?.sectionId);

  useEffect(() => {
    console.log("Location states : ", location.state);
    setSectionId(location.state?.sectionId)
  }, [location.state])

  useEffect(() => {
    if(!animationDone) return;
    if (sectionId) {
      const section = document.getElementById(sectionId);
      setTimeout(() => {
        section.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }, 100);
      setSectionId(null);
    }
    else {
      window.scroll({ top: 0, behavior: 'smooth' })
    }
  }, [sectionId, animationDone])

  const handleAddFavorite = async () => {
    if (!newContest.name) {
      toast.error("Please enter valid name of contest");
      return;
    }
    if (!newContest.url || !newContest.url.startsWith('https://')) {
      toast.error("Please enter valid url of contest")
      return;
    }

    const response = await addToFavorite(newContest);
    if (response.success) {
      setFavoriteContests(prev => [...prev, { ...newContest }]);
      toast.success("Added new contest to favourites");
    }
    else {
      toast.error("Addition to favourites failed")
    }

    setNewContest({ name: '', url: '', platform: 'codeforces', short_note: '' });
    setShowAddForm(false);
  };

  const handleRemoveFavorite = async (url) => {
    const response = await removeFromFavorite(url);
    if (response.success) {
      setFavoriteContests(prev => prev.filter(contest => contest.url !== url));
      toast.success("Removed from favourites");
    }
    else {
      toast.error("Removal from favourites failed")
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  if (pageLoading) {
    return <Buffer className='xl:pl-64' type='dots' text="Loading Contests..." fadeOut={fadeOutPageLoader} />;
  }

  return (
    <div className={`min-h-screen w-full xl:ml-64 p-6 transition-opacity duration-500 
      dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 
      dark:text-white 
      bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900 
      `}>

      {/* Header Section */}
      <AnimatedCard className="mb-12 mt-7 text-center">
        <div className="text-center space-x-3 my-3">
          <h1 className="text-3xl font-bold text-indigo-700 dark:text-white">
            Contest Actions
          </h1>
        </div>
        <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Upsolve your recent contests and review your favorites ones
        </p>
      </AnimatedCard>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">

          {/* Recent Contests (Upsolve) */}
          <AnimatedCard delay={100}>
            <div className={`rounded-xl p-6 ${theme === 'dark'
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200 shadow-sm'
              }`}>
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-lg">📊</span>
                <div>
                  <h2 className="text-xl font-semibold">Recent Contests</h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your last 5 contest performances
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {recentContests.map((contest, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg transition-all duration-300 hover:scale-[1.01] border border-blue-400 dark:border-blue-600 ${theme === 'dark'
                      ? 'bg-gray-900/40 hover:bg-gray-900/60'
                      : 'bg-gray-100/60 hover:bg-gray-200/80'
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">
                            {platformIcons[contest.platform]}
                          </span>
                          <a
                            href={contest.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {contest.name}
                          </a>
                          <span className="text-sm text-gray-500">
                            {formatDate(contest.date)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Rating:</span>
                            <span className={`font-semibold ${getRatingColor(contest.rating)}`}>
                              {contest.rating}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Rank:</span>
                            <span className="font-semibold">
                              #{contest.rank.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(contest.url, '_blank')}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${theme === 'dark'
                            ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                        >
                          Upsolve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedCard>

          {/* Favorite Contests */}
          <AnimatedCard delay={200}>
            <div id='favs' className={`rounded-xl p-6 ${theme === 'dark'
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200 shadow-sm'
              }`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">⭐</span>
                  <div>
                    <h2 className="text-xl font-semibold">Favorite Contests</h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {favoriteContests.length} saved contests
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${theme === 'dark'
                    ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                >
                  Add Contest
                </button>
              </div>

              <div className="space-y-4">
                {favoriteContests.map((contest, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg transition-all duration-300 hover:scale-[1.01] border border-blue-400 dark:border-blue-600 ${theme === 'dark'
                      ? 'bg-gray-900/50 hover:bg-gray-900/60'
                      : 'bg-gray-100/60 hover:bg-gray-200/80'
                      }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">
                            {platformIcons[contest.platform]}
                          </span>
                          <a
                            href={contest.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {contest.name}
                          </a>
                          <span className={`text-xs px-2 py-1 rounded-full hidden md:flex capitalize ${theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                            }`}>
                            {contest.platform}
                          </span>
                        </div>
                        {contest.short_note && (
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {contest.short_note}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveFavorite(contest.url)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${theme === 'dark'
                          ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                      >
                        <Trash2 className='flex md:hidden' size={15}/>
                        <span className='hidden md:flex'>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}

                {favoriteContests.length === 0 && (
                  <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="text-4xl mb-2 block">📝</span>
                    <p>No favorite contests yet. Add some to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Contest Statistics */}
          <AnimatedCard delay={300}>
            <div className={`rounded-xl p-5 ${theme === 'dark'
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200 shadow-sm'
              }`}>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-lg">📈</span>
                <h2 className="text-lg font-semibold">Contest Stats</h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    label: 'Recent Contests Extracted',
                    value: recentContests.length,
                    icon: <Target size={18} className='text-blue-400' />,
                    color: 'text-blue-500'
                  },
                  {
                    label: 'Overall Performance',
                    value: Math.round(recentContests.reduce((acc, c) => acc + c.rating, 0) / recentContests.length) || 0,
                    icon: <Star size={18} className='text-yellow-600' />,
                    color: 'text-yellow-500'
                  },
                  {
                    label: 'Best Rank',
                    value: `#${Math.min(...recentContests.map(c => c.rank)).toLocaleString()}`,
                    icon: <Medal size={18} className='text-blue-400' />,
                    color: 'text-green-500'
                  },
                  {
                    label: 'Favorite Contests',
                    value: favoriteContests.length,
                    icon: <Heart size={18} className='text-red-600' />,
                    color: 'text-red-500'
                  }
                ].map((stat) => (
                  <div key={stat.label} className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] ${theme === 'dark' ? 'bg-gray-700/40' : 'bg-gray-50/60'
                    }`}>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{stat.icon}</span>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {stat.label}
                      </span>
                    </div>
                    <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedCard>

          {/* Quick Navigator */}
          <AnimatedCard delay={400}>
            <div className={`rounded-xl p-5 ${theme === 'dark'
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200 shadow-sm'
              }`}>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-lg">⚡</span>
                <h2 className="text-lg font-semibold">Quick Navigator</h2>
              </div>

              <div className="space-y-3">
                <button className={`w-full p-3 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] ${theme === 'dark'
                  ? 'bg-gray-700/40 hover:bg-gray-700/60'
                  : 'bg-gray-50/60 hover:bg-gray-100/80'
                  }`}>
                  <div className="flex items-center space-x-2">
                    <Search size={18} className='text-blue-400' />
                    <span className="text-sm font-medium">Upcoming Contests - <span className='text-blue-500'><Link to='/dashboard'>DashBoard</Link></span></span>
                  </div>
                </button>

                <button className={`w-full p-3 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] ${theme === 'dark'
                  ? 'bg-gray-700/40 hover:bg-gray-700/60'
                  : 'bg-gray-50/60 hover:bg-gray-100/80'
                  }`}>
                  <div className="flex items-center space-x-2">
                    <ChartNoAxesCombined size={18} className='text-blue-400' />
                    <span className="text-sm font-medium">Contests Rating Plot - <span className='text-blue-500'><Link to='/dashboard'>DashBoard</Link></span></span>
                  </div>
                </button>

                <button className={`w-full p-3 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] ${theme === 'dark'
                  ? 'bg-gray-700/40 hover:bg-gray-700/60'
                  : 'bg-gray-50/60 hover:bg-gray-100/80'
                  }`}>
                  <div className="flex items-center space-x-2">
                    <Link2 size={18} className='text-blue-400' />
                    <span className="text-sm font-medium">Contest Handles - <span className='text-blue-500'><Link to='/profile' state={{ sectionId: 'handles' }}>Profile</Link></span></span>
                  </div>
                </button>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* Add Favorite Contest Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Favorite Contest</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Contest Name</label>
                <input
                  type="text"
                  value={newContest.name}
                  onChange={(e) => setNewContest(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full p-3 rounded-lg border transition-colors ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                    : 'bg-white border-gray-300 focus:border-blue-500'
                    } focus:ring-1 focus:ring-blue-500 outline-none`}
                  placeholder="Enter contest name"
                  required
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Contest URL</label>
                <input
                  type="url"
                  value={newContest.url}
                  onChange={(e) => setNewContest(prev => ({ ...prev, url: e.target.value }))}
                  className={`w-full p-3 rounded-lg border transition-colors ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                    : 'bg-white border-gray-300 focus:border-blue-500'
                    } focus:ring-1 focus:ring-blue-500 outline-none`}
                  placeholder="https://..."
                  required
                  maxLength={150}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Platform</label>
                <select
                  value={newContest.platform}
                  onChange={(e) => setNewContest(prev => ({ ...prev, platform: e.target.value }))}
                  className={`w-full p-3 rounded-lg border transition-colors ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                    : 'bg-white border-gray-300 focus:border-blue-500'
                    } focus:ring-1 focus:ring-blue-500 outline-none`}
                >
                  <option value="codeforces">Codeforces</option>
                  <option value="codechef">CodeChef</option>
                  <option value="leetcode">LeetCode</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Short Note (Optional)</label>
                <textarea
                  value={newContest.short_note}
                  onChange={(e) => setNewContest(prev => ({ ...prev, short_note: e.target.value }))}
                  className={`w-full p-3 rounded-lg border transition-colors ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500'
                    : 'bg-white border-gray-300 focus:border-blue-500'
                    } focus:ring-1 focus:ring-blue-500 outline-none`}
                  placeholder="Why do you like this contest?"
                  rows={3}
                  maxLength={150}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant='secondary'
                  onClick={() => setShowAddForm(false)}
                  className='w-1/2'
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddFavorite}
                  className='w-1/2'
                >
                  Add Contest
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}