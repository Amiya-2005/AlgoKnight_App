import { useEffect } from 'react';
import { useState } from 'react';
import { useContests } from '../../context/DashBoardContext';


const UpcomingContests = () => {
  const [filter, setFilter] = useState('all');
  const [contestsData, setContestsData] = useState(null);

  const { upcomingContests } = useContests();


  useEffect(() => {
    const fun = async () => {
      const contests = await upcomingContests();

      if (contests) {
        setContestsData(contests);
      }
    }

    fun();
  }, [])

  // Define platform styles
  const getPlatformStyles = (platform) => {
    const styles = {
      'codechef': {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-800 dark:text-green-200',
        border: 'border-green-200 dark:border-green-800'
      },
      'codeforces': {
        bg: 'bg-blue-100 dark:bg-blue-900',
        text: 'text-blue-800 dark:text-blue-200',
        border: 'border-blue-200 dark:border-blue-800'
      },
      'leetcode': {
        bg: 'bg-yellow-100 dark:bg-yellow-900',
        text: 'text-yellow-800 dark:text-yellow-200',
        border: 'border-yellow-200 dark:border-yellow-800'
      },
      'AtCoder': {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-800 dark:text-gray-200',
        border: 'border-gray-200 dark:border-gray-700'
      },
      'AlgoerRank': {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-800 dark:text-green-200',
        border: 'border-green-200 dark:border-green-800'
      },
      'AlgoerEarth': {
        bg: 'bg-purple-100 dark:bg-purple-900',
        text: 'text-purple-800 dark:text-purple-200',
        border: 'border-purple-200 dark:border-purple-800'
      },
      'Kick Start': {
        bg: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-800 dark:text-red-200',
        border: 'border-red-200 dark:border-red-800'
      },
      'TopCoder': {
        bg: 'bg-indigo-100 dark:bg-indigo-900',
        text: 'text-indigo-800 dark:text-indigo-200',
        border: 'border-indigo-200 dark:border-indigo-800'
      },
      'default': {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-800 dark:text-gray-200',
        border: 'border-gray-200 dark:border-gray-700'
      }
    };

    return styles[platform] || styles.default;
  };

  // Get list of unique platforms
  const platforms = contestsData
    ? [...new Set(contestsData.map(contest => contest.platform))]
    : [];

  // Filter contests by platform
  const filteredContests = filter === 'all'
    ? contestsData
    : contestsData.filter(contest => contest.platform === filter);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate time until contest
  const getTimeUntil = (dateString) => {
    const contestDate = new Date(dateString);
    const now = new Date();
    const diffTime = contestDate - now;

    if (diffTime < 0) return 'Started';

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else {
      return `${diffMinutes}m`;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Select Platform
        </h3>
        <div className="text-sm">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Platforms</option>
            {platforms.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredContests && filteredContests.length > 0 ? (
        <div className="space-y-3">
          {filteredContests.map((contest, index) => {
            contest.duration = contest.duration;

            const styles = getPlatformStyles(contest.platform);
            return (
              <a
                href={`${contest.url}`}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
                className="border rounded-md p-3 hover:bg-gray-100 hover:dark:bg-gray-700 dark:border-gray-500 flex flex-col sm:flex-row sm:items-center justify-between"
              >
                <div>
                  <div className="flex items-center mb-2">
                    <span className={`${styles.bg} ${styles.text} text-xs px-2 py-1 rounded mr-2`}>
                      {contest.platform}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {contest.duration ? `${contest.duration} minutes` : 'N/A'}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-800 dark:text-white mb-1 line-clamp-1">
                    {contest.name.length > 25 ? `${contest.name.substring(0, 22)}...` : contest.name}
                  </h4>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(contest.startTime)}
                  </div>
                </div>
                <div className={`${styles.border} rounded-full px-3 py-1 text-sm font-medium ${styles.text} mt-2 sm:mt-0 self-start sm:self-center`}>
                  {getTimeUntil(contest.startTime)}
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          {!contestsData ? 'Loading...' : contestsData.length > 0
            ? 'No contests found with selected filter'
            : 'No upcoming contests available'}
        </div>
      )}

    </div>
  );
};

export default UpcomingContests;