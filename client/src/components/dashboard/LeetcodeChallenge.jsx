import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import Button from '../common/Button';
import { useChallenge } from '../../context/DashBoardContext';
import { LeetCodeIcon } from '../common/Icons';
import { ThemeContext } from '../../context/ThemeContext';

const LeetcodeChallenge = () => {

  const {theme} = useContext(ThemeContext);

  const {fetchDaily} = useChallenge();
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    const fun = async () => {
      const daily = await fetchDaily();
      setChallenge(daily);
    }
    fun();
  }, [])


  const getDifficultyColor = (difficulty) => {   // Function to determine difficulty color  
    if (!difficulty) return 'text-gray-500';

    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  // Function to render tag badges
  const renderTags = (tags) => {
    if (!tags || tags.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
          >
            {tag.name}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="text-xs text-gray-500 dark:text-gray-400 px-1 py-1">
            +{tags.length - 3} more
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-md bg-transparent flex items-center justify-center mr-3">
            <LeetCodeIcon theme={theme}/>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          LeetCode Daily
        </h3>
      </div>

      {challenge ? (
        <div className="space-y-4">
          <div className={`p-4 border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-800 dark:text-white">
                {challenge.questionTitle || 'Loading challenge...'}
              </h4>
              <span className={`${getDifficultyColor(challenge.difficulty)} text-sm font-medium`}>
                {challenge.difficulty || 'N/A'}
              </span>
            </div>


            {renderTags(challenge.topicTags)}

            <div className="flex justify-between items-center mt-4 text-sm">

              <Button variant='secondary' size='sm' className='bg-orange-600 hover:bg-orange-800'>
                <a
                  href={`${challenge.questionLink}description/?envType=daily-question&envId=${challenge.date}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Solve Now
                </a>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      )}
    </div>
  );
};

export default LeetcodeChallenge;