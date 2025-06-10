import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import Buffer from '../components/common/Buffer';
import Button from '../components/common/Button';
import { Plus, Search } from 'lucide-react';
import { CodeChefIcon, CodeForcesIcon, LeetCodeIcon } from '../components/common/Icons';
import { NetworkContext } from '../context/NetworkContext';
import { toast } from 'react-toastify';

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

// User Card Component
const UserCard = ({ user, onRemove, platformIcons, theme }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemove = () => {
    onRemove(user.id);
    setShowConfirm(false);
  };

  return (
    <div className={`rounded-xl p-6 transition-all duration-300 hover:border-blue-400 group ${theme === 'dark'
      ? 'bg-gray-800 border border-gray-700 hover:bg-gray-750'
      : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
      }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl text-black dark:text-white  ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-lg group-hover:text-blue-600 group-hover:dark:text-blue-400 transition-color duration-300">{user.fullName}</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              @ {user.userName}
            </p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowConfirm(!showConfirm)}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 border border-transparent hover:border-red-700/50 ${theme === 'dark'
              ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/20'
              : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
              }`}
          >
            🗑️
          </button>

          {showConfirm && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowConfirm(false)}
              />
              <div className={`absolute right-0 top-full mt-2 p-4 rounded-lg shadow-xl z-50 border ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
                }`}>
                <p className="text-sm mb-3 whitespace-nowrap">Remove from network?</p>
                <div className="flex space-x-2">
                  <Button
                    variant='danger'
                    size='sm'
                    onClick={handleRemove}
                  >
                    Remove
                  </Button>
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(user.handles).map(([platform, handle]) => (
          (
            <div key={platform} className={`flex items-center justify-between p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
              <div className="flex items-center space-x-3">
                <span className="text-lg">{platformIcons[platform]}</span>
                <div>
                  <p className="font-medium capitalize">{platform}</p>
                  <p className={`text-sm ${theme === 'dark' ? (handle ? 'text-gray-400' : 'text-gray-500/80') : (handle ? 'text-gray-600' : 'text-gray-400/80')}`}>
                    {handle || "Not set"}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${user.ratings?.[platform]
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                {user.ratings?.[platform] || user.handles?.[platform] !== '' && 'Unrated' || 'NA'}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

// Search Modal Component
const SearchModal = ({ isOpen, platformIcons, onClose, onAddUser, theme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [platformFilter, setPlatformFilter] = useState('all');

  const [showResults,setShowResults] = useState(false);

  const { searchUser } = useContext(NetworkContext);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchUser(searchQuery.trim());
      setSearchResults(results);
    }
    catch (error) {
      console.error('Search failed:', error);
    }
    finally {
      setIsSearching(false);
      setShowResults(true);
    }
  };

  const handleAddUser = (user) => {
    onAddUser(user);
    setSearchQuery('');
    setSearchResults([]);
    onClose();
  };

  if (!isOpen) return null;

  const filteredUsers = searchResults.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(user.handles).some(handle =>
        handle.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesPlatform = platformFilter === 'all' || user.handles[platformFilter].toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-xl p-6 ${theme === 'dark'
        ? 'bg-gray-800 border border-gray-700'
        : 'bg-white border border-gray-200'
        }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Add User to Network</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${theme === 'dark'
              ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
                }`}
            >
              <option value="all">All Platforms</option>
              <option value="codeforces">Codeforces</option>
              <option value="leetcode">LeetCode</option>
              <option value="codechef">CodeChef</option>
            </select>

            <input
              type="text"
              placeholder="Enter username or handle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className={`flex-1 px-4 py-2 rounded-lg border focus:outline-blue-300 focus:dark:outline-blue-600 ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
            />

            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? <Search /> : 'Search'}
            </Button>
          </div>

          {isSearching && (
            <div className="text-center py-8">
              <div className="text-2xl mb-2"><Buffer type='spinner' className='bg-transparent' /></div>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Searching users...
              </p>
            </div>
          )}

          {showResults && (filteredUsers.length === 0 ?
            <div className="text-center py-8">
              <div className="text-2xl mb-2"><Search className='mx-auto'/></div>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                No users found
              </p>
            </div>
            : (
              <div className="space-y-3 max-h-60 sm:max-h-100 overflow-y-auto thin-scrollbar">
                <h3 className="font-medium">Search Results:</h3>
                {filteredUsers.map((user) => (
                  <div key={user.id} className={`flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg border ${theme === 'dark'
                    ? 'bg-gray-700/50 border-gray-600'
                    : 'bg-gray-50 border-gray-200'
                    }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                        }`}>
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className='flex flex-col gap-1'>
                        <p className="font-medium text-md">{user.fullName}</p>
                        <div className="flex space-x-2 gap-y-2 text-sm flex-wrap">
                          {Object.values(user.handles).every(v => v === '') ? <div className='text-gray-400'>No handle set</div> : Object.entries(user.handles).map(([platform, handle]) => (
                            handle && (
                              <span key={platform} className={`flex gap-2 items-center px-2 py-1 rounded text-md font-semibold ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                                }`}>
                                {platformIcons[platform]} {handle.length >= 20 ? handle.substring(0,18) + '...' : handle}
                              </span>
                            )
                          ))}

                        </div>
                      </div>
                    </div>
                    <Button
                    className='my-2'
                      variant='success'
                      onClick={() => handleAddUser(user)}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default function NetworkPage() {
  const [users, setUsers] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [fadeOutPageLoader, setFadeOutPageLoader] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');

  const { theme } = useContext(ThemeContext);
  const { getAllConnections, toggleConnection } = useContext(NetworkContext);

  const platformIcons = {
    codeforces: <CodeForcesIcon />,
    codechef: <CodeChefIcon />,
    leetcode: <LeetCodeIcon theme={theme} />
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allNetwork = await getAllConnections();
        setUsers(allNetwork);

        setFadeOutPageLoader(true);
        const timer = setTimeout(() => {
          setPageLoading(false);
          setIsVisible(true);
        }, 500);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setPageLoading(false);
      }
    };

    fetchUsers();
  }, []);


  const handleRemoveUser = async (userId) => {
    try {
      setUsers(users.filter(user => user.id !== userId));
      await toggleConnection(userId);
      toast.success("Connection removed successfully");
    }
    catch (error) {
      toast.error("Connection removal failed");
    }
  };

  const handleAddUser = async (newUser) => {
    setUsers([...users, newUser]);
    const response = await toggleConnection(newUser.id);
    if (response.success === true) {
      toast.success("Connection added successfully");
    }
    else {
      toast.error("Connection addition failed");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(user.handles).some(handle =>
        handle.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesPlatform = platformFilter === 'all' || user.handles[platformFilter].toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch && matchesPlatform;
  });

  return (
    pageLoading ? (
      <Buffer className='xl:pl-64' type='dots' text="Loading Network..." fadeOut={fadeOutPageLoader} />
    ) : (
      <div className={`min-h-screen w-full xl:ml-64 p-6 transition-opacity duration-500 
        dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 
        dark:text-white 
        bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900 
        ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

        {/* Header Section */}
        <AnimatedCard className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
            <div className="flex flex-col gap-4 text-center mb-4 lg:mb-0 w-full mt-10">
              <h1 className="text-3xl font-bold text-indigo-700 dark:text-white">
                My Network
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Connect with top programmers — their submissions fuel <span className='font-bold'>your smartsheet</span> with the best problems to practice.
              </p>
            </div>

            <div className={`px-4 py-2 rounded-lg ${theme === 'dark'
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
              }`}>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{users.length}</div>
                <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Connections
                </div>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Search and Filter Section */}
        <AnimatedCard delay={100}>
          <div className={`rounded-xl p-6 mb-6 ${theme === 'dark'
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200 shadow-sm'
            }`}>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <input
                  type="text"
                  placeholder="Search in your network by username or handles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 px-4 py-2 rounded-lg border focus:ring-1 focus:ring-blue-500 outline-none ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                />

                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className={`px-4 py-2 rounded-lg border ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-1 focus:ring-blue-500 outline-none`}
                >
                  <option value="all">All Platforms</option>
                  <option value="codeforces">Codeforces</option>
                  <option value="leetcode">LeetCode</option>
                  <option value="codechef">CodeChef</option>
                </select>
              </div>

              <Button
                onClick={() => setShowSearchModal(true)}
                icon={<Plus size={20} />}
              >
                <span>Add User</span>
              </Button>
            </div>
          </div>
        </AnimatedCard>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <AnimatedCard delay={200}>
            <div className={`text-center py-12 rounded-xl ${theme === 'dark'
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200 shadow-sm'
              }`}>
              <div className="text-6xl mb-4"><Search className='mx-auto' size={30} /></div>
              <h3 className="text-xl font-semibold mb-2">No users found</h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                {searchQuery || platformFilter !== 'all'
                  ? 'Try adjusting your search filters'
                  : 'Start building your network by adding users'
                }
              </p>
              {!searchQuery && platformFilter === 'all' && (
                <Button
                  onClick={() => setShowSearchModal(true)}
                >
                  Add Your First User
                </Button>
              )}
            </div>
          </AnimatedCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map((user, index) => (
              <AnimatedCard key={user.id} delay={200 + index * 100}>
                <UserCard
                  user={user}
                  onRemove={handleRemoveUser}
                  theme={theme}
                  platformIcons={platformIcons}
                />
              </AnimatedCard>
            ))}
          </div>
        )}

        {/* Search Modal */}
        <SearchModal
          isOpen={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          onAddUser={handleAddUser}
          theme={theme}
          platformIcons={platformIcons}
        />
      </div>
    )
  );
}