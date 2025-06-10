import { useState, useEffect, useContext } from 'react';
import LeetcodeChallenge from '../components/dashboard/LeetcodeChallenge';
import CalendarHeatmap from '../components/dashboard/CalendarHeatmap';
import RatingPlot from '../components/dashboard/RatingPlot';
import UpcomingContests from '../components/dashboard/UpcomingContests';
import PieChart from '../components/dashboard/PieChart';
import { ThemeContext } from '../context/ThemeContext';
import { useDashboardData } from '../context/DashBoardContext';
import { AuthContext } from '../context/AuthContext';
import Buffer from '../components/common/Buffer';
import { CodeChefIcon, CodeForcesIcon, LeetCodeIcon } from '../components/common/Icons';

const lightColors = [
  'bg-indigo-500', 'bg-amber-400', 'bg-teal-400', 'bg-pink-400', 'bg-emerald-400',
  'bg-purple-400', 'bg-rose-400', 'bg-cyan-400', 'bg-blue-500', 'bg-orange-400',
  'bg-lime-500', 'bg-fuchsia-400', 'bg-sky-400', 'bg-red-400', 'bg-green-500',
  'bg-violet-400', 'bg-yellow-400', 'bg-slate-400', 'bg-blue-400', 'bg-orange-500'
];

const darkColors = [
  'bg-indigo-400', 'bg-amber-300', 'bg-teal-400', 'bg-pink-400', 'bg-emerald-300',
  'bg-purple-300', 'bg-rose-300', 'bg-cyan-300', 'bg-blue-300', 'bg-orange-300',
  'bg-lime-400', 'bg-fuchsia-300', 'bg-sky-300', 'bg-red-300', 'bg-green-400',
  'bg-violet-300', 'bg-yellow-300', 'bg-slate-300', 'bg-blue-200', 'bg-orange-400'
];


// Animation wrapper component
const AnimatedCard = ({ children, className = "" }) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    setHasAnimated(true);
  }, []);

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

const PlatformSelector = ({ platformIcons, platform, data, ratingData, isActive, onClick, theme }) => {
  const currentRating = ratingData[platform][ratingData[platform].length - 1]?.rating || 0;
  const ratingProgress = Math.min(100, (currentRating / 3000) * 100);

  return (
    <div
      className={`flex-1 min-w-0 rounded-xl p-4 cursor-pointer transition-transform duration-300 hover:scale-[1.02]
        ${isActive
          ? 'dark:bg-blue-900/30 dark:border-blue-50 bg-blue-50 border-blue-500'
          : 'dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-50 hover:bg-gray-100 border-transparent '
        }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div className='w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 border-1 border-blue-300 dark:border-blue-600 dark:bg-gray-700/5 bg-gray-100/5'>
            {platformIcons[platform] || platform.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold capitalize text-md truncate">{platform}</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} truncate`}>
              {data.solved} solved
            </p>
          </div>
        </div>
        {isActive && (
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0"></div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Rating
          </span>
          <span className="font-semibold text-sm">{currentRating}</span>
        </div>
        <div className={`h-1.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-200/50'}`}>
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
            style={{ width: `${ratingProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [activePlatform, setActivePlatform] = useState('codeforces');
  const [animationDone, setAnimationDone] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { theme } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);
  const { getFullData } = useDashboardData();

  const [handles, setHandles] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [ratingData, setRatingData] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [showAllLegend, setShowAllLegend] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);
  const [fadeOutPageLoader, setFadeOutPageLoader] = useState(!pageLoading);

  const userData = {
    name: currentUser.userName,
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const platformIcons = {
    codeforces: <CodeForcesIcon />,
    codechef: <CodeChefIcon />,
    leetcode: <LeetCodeIcon theme={theme} />
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await getFullData();

      setHandles(response?.handles);
      setPieChartData(response?.pieChartData);
      setRatingData(response?.ratingData);
      setHeatmapData(response?.heatmapData);

      console.log("Full data : ", response);
      setFadeOutPageLoader(true);
      const timer = setTimeout(() => {
        setPageLoading(false);
        setAnimationDone(true);
      }, 500);
      return timer;
    };

    if (!pageLoading) {
      return;
    }

    const timer = fetch();
    return () => clearTimeout(timer);
  }, [pageLoading]);

  const handlePlatformChange = (platform) => {
    setActivePlatform(platform);
    setDropdownOpen(false);
  };

  const getCategories = () => {
    return pieChartData[activePlatform]?.categories.sort((a, b) => b.count - a.count) || [];
  };

  const totalSolved = pieChartData ? Object.values(pieChartData).reduce((acc, platform) => acc + platform.solved, 0) : 0;

  return (
    pageLoading ? (
      <Buffer className='xl:pl-64' type='dots' text="Loading Dashboard..." fadeOut={fadeOutPageLoader} />
    ) : (
      <div className={`min-h-screen w-full xl:ml-64 p-6 transition-opacity duration-500 
  dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 
  dark:text-white 
  bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900 
  ${animationDone ? 'opacity-100' : 'opacity-0'}`}>

        {/* Header Section */}
        <AnimatedCard className="mb-2">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
            <div className="flex items-center space-x-4 mb-2 lg:mb-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-500">
                  {getGreeting()}, {userData.name.split(' ')[0]}
                </h1>
                <span className="text-2xl">👋</span>
              </div>
            </div>

            <div className={`px-4 py-2 rounded-lg ${theme === 'dark'
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
              }`}>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{totalSolved.toLocaleString()}</div>
                <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Problems Solved
                </div>
              </div>
            </div>
          </div>
        </AnimatedCard>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">

            {/* Platform Selector */}
            <div className={`rounded-xl p-6 ${theme === 'dark'
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200 shadow-sm'
              }`}>
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-lg">🌐</span>
                <h2 className="text-xl font-semibold">Platform Selection</h2>
              </div>

              {/* Mobile Dropdown */}
              <div className="block lg:hidden">
                <div className="relative">
                  <button
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${theme === 'dark'
                      ? 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                      }`}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{platformIcons[activePlatform]}</span>
                      <div className="text-left">
                        <h3 className="font-semibold capitalize">{activePlatform}</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {pieChartData[activePlatform].solved} problems
                        </p>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div
                        className="fixed inset-0"
                        onClick={() => setDropdownOpen(false)}
                      />

                      {/* Dropdown Menu */}
                      <div
                        className={`absolute w-full mt-2 rounded-xl shadow-xl border z-[1002] ${theme === 'dark'
                          ? 'bg-gray-800 border-gray-700'
                          : 'bg-white border-gray-200'
                          }`}
                      >
                        {Object.keys(pieChartData)
                          .filter(platform => platform !== activePlatform)
                          .map((platform) => (
                            <div
                              key={platform}
                              className={`p-4 border-b last:border-0 cursor-pointer transition-all duration-200 first:rounded-t-xl last:rounded-b-xl ${theme === 'dark'
                                ? 'border-gray-700 hover:bg-gray-700'
                                : 'border-gray-200 hover:bg-gray-50'
                                }`}
                              onClick={() => handlePlatformChange(platform)}
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-lg">{platformIcons[platform]}</span>
                                <div>
                                  <h3 className="font-semibold capitalize">{platform}</h3>
                                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {pieChartData[platform].solved} problems
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Desktop Platform Selectors */}
              <AnimatedCard>
                <div className="hidden lg:flex gap-3 p-2">
                  {Object.keys(pieChartData).map((platform) => (
                    <PlatformSelector
                      key={platform}
                      platformIcons={platformIcons}
                      platform={platform}
                      data={pieChartData[platform]}
                      ratingData={ratingData}
                      isActive={activePlatform === platform}
                      onClick={() => handlePlatformChange(platform)}
                      theme={theme}
                    />
                  ))}
                </div>
              </AnimatedCard>
            </div>

            {/* Pie Chart Section */}
            <AnimatedCard>
              <div className={`rounded-xl p-6 ${theme === 'dark'
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200 shadow-sm'
                }`}>
                <div className="flex items-center space-x-2 mb-6">
                  <span className="text-lg">📊</span>
                  <div>
                    <h2 className="text-xl font-semibold">Problem Categories</h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} capitalize`}>
                      {activePlatform} • {getCategories().length} categories
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative w-full h-64 mb-6">
                    <PieChart
                      key={activePlatform}
                      platform={activePlatform}
                      handle={handles[activePlatform]}
                      data={getCategories().map(({ tag, count }) => ({
                        tag,
                        count,
                        percentage: Math.max(1, Math.round(count / pieChartData[activePlatform].total * 100))
                      }))}
                      darkMode={theme === 'dark'}
                    />
                  </div>

                  {/* Legend */}
                  <div className="flex flex-col gap-3 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                      {getCategories().slice(0, showAllLegend ? undefined : 14).map(({ tag, count }, index) => {
                        const colorClass = theme === 'dark' ? darkColors[index % darkColors.length] : lightColors[index % lightColors.length];
                        const percentage = Math.max(1, Math.round((count / pieChartData[activePlatform].total) * 100));

                        return (
                          <div key={tag} className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 hover:scale-[1.02] ${theme === 'dark' ? 'bg-gray-700/40' : 'bg-gray-50/60'
                            }`}>
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${colorClass} shadow-sm`}></div>
                              <span className="font-medium capitalize text-sm">{tag}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-sm">{count}</div>
                              <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                {percentage}%
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Show More/Less Button */}
                    {getCategories().length > 14 && (
                      <div className="flex justify-center">
                        <button
                          onClick={() => setShowAllLegend(!showAllLegend)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${theme === 'dark'
                            ? 'bg-gray-700/60 text-gray-300 hover:bg-gray-700/80'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          {showAllLegend
                            ? 'Show Less'
                            : `Show ${getCategories().length - 14} More`
                          }
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedCard>

            {/* Rating Plot */}
            <AnimatedCard>
              <div className={`rounded-xl p-6 ${theme === 'dark'
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200 shadow-sm'
                }`}>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-lg">📈</span>
                  <div>
                    <h2 className="text-xl font-semibold">Rating Progress</h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} capitalize`}>
                      {activePlatform} • Current: {ratingData[activePlatform].length === 0 ? 0 : ratingData[activePlatform][ratingData[activePlatform].length - 1].rating}
                    </p>
                  </div>
                </div>
                <RatingPlot key={activePlatform}
                  handle={handles[activePlatform]}
                  platform={activePlatform}
                  data={ratingData} />
              </div>
            </AnimatedCard>

            {/* Heatmap */}
            <AnimatedCard>
              <div className={`border-1 rounded-xl p-6 ${theme === 'dark'
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200 shadow-sm'
                }`}>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-lg">🔥</span>
                  <div>
                    <h2 className="text-xl font-semibold">Activity Heatmap</h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} capitalize`}>
                      {activePlatform} • Last 6 months
                    </p>
                  </div>
                </div>
                <CalendarHeatmap
                  id={activePlatform}
                  platform={activePlatform}
                  handle={handles[activePlatform]}
                  data={heatmapData} />
              </div>
            </AnimatedCard>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Problem of the Day */}
            <AnimatedCard>
              <div className={`rounded-xl p-5 ${theme === 'dark'
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200 shadow-sm'
                }`}>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-lg">⭐</span>
                  <h2 className="text-lg font-semibold">Problem of the Day</h2>
                </div>
                <LeetcodeChallenge />
              </div>
            </AnimatedCard>

            {/* Upcoming Contests */}
            <AnimatedCard>
              <div className={`rounded-xl p-5 ${theme === 'dark'
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200 shadow-sm'
                }`}>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-lg">🏆</span>
                  <h2 className="text-lg font-semibold">Upcoming Contests</h2>
                </div>
                <UpcomingContests />
              </div>
            </AnimatedCard>

            {/* Platform Stats */}
            <AnimatedCard>
              <div className={`rounded-xl p-5 ${theme === 'dark'
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200 shadow-sm'
                }`}>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-lg">{platformIcons[activePlatform]}</span>
                  <h2 className="text-lg font-semibold capitalize">{activePlatform} Statistics</h2>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Current Rating', value: ratingData[activePlatform][ratingData[activePlatform].length - 1]?.rating || 0, icon: '📊' },
                    { label: 'Problems Solved', value: pieChartData[activePlatform]?.solved || 0, icon: '✅' },
                    { label: 'Categories Covered', value: getCategories().length, icon: '🏷️' },
                    {
                      label: 'Completion Rate',
                      value: `${Math.round((pieChartData[activePlatform]?.solved || 0 ) / (activePlatform === 'leetcode' ? 2500 : activePlatform === 'codeforces' ? 8000 : 3000) * 100)}%`,
                      icon: '🎯'
                    }
                  ].map((stat) => (
                    <div key={stat.label} className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 hover:scale-[1.02] ${theme === 'dark' ? 'bg-gray-700/40' : 'bg-gray-50/60'
                      }`}>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{stat.icon}</span>
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {stat.label}
                        </span>
                      </div>
                      <span className="font-semibold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>
    )
  );
}