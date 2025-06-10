import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Trash2, Lightbulb, Brain, Code2, ShieldQuestion } from 'lucide-react';
import { CodeChefIcon, CodeForcesIcon, LeetCodeIcon } from '../components/common/Icons';

export default function ProblemCard ({ 
  problem, 
  theme = 'light', 
  onDelete,
  index = 0 
}) {
  const [expandedSections, setExpandedSections] = useState({
    hint: false,
    intuition: false,
    solution: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getPlatformIcon = (platform) => {
    switch(platform?.toLowerCase()) {
      case 'codeforces':
        return <CodeForcesIcon />;
      case 'leetcode':
        return <LeetCodeIcon theme={theme} />;
      case 'codechef':
        return <CodeChefIcon />;
      case 'none':
      default:
        return <ShieldQuestion className='text-yellow-200'/>;
    }
  };

  const getPlatformColor = (platform) => {
    switch(platform?.toLowerCase()) {
      case 'codeforces':
        return theme === 'dark' ? 'text-red-400' : 'text-red-500';
      case 'leetcode':
        return theme === 'dark' ? 'text-orange-400' : 'text-orange-500';
      case 'codechef':
        return theme === 'dark' ? 'text-amber-400' : 'text-amber-500';
      case 'none':
      default:
        return theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    }
  };

  const sectionConfig = [
    {
      key: 'hint',
      icon: Lightbulb,
      title: 'Hint',
      content: problem.hint,
      color: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
    },
    {
      key: 'intuition',
      icon: Brain,
      title: 'Intuition',
      content: problem.intuition,
      color: theme === 'dark' ? 'text-purple-400' : 'text-purple-500'
    },
    {
      key: 'solution',
      icon: Code2,
      title: 'Solution',
      content: problem.solution,
      color: theme === 'dark' ? 'text-green-400' : 'text-green-500',
      isLink: true
    }
  ];

  return (
    <div 
      className={`group rounded-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:dark:border-blue-600 transform bg-white dark:bg-gray-800`}
      style={{ 
        animationDelay: `${index * 100}ms`
      }}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`flex items-center space-x-2 ${getPlatformColor(problem.platform)}`}>
                {getPlatformIcon(problem.platform)}
                <span className="font-medium capitalize">{problem.platform}</span>
              </div>
              <a
                href={problem.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-1 rounded-md transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-blue-400' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-blue-600'
                }`}
                title="Open problem"
              >
                <ExternalLink size={18} />
              </a>
            </div>
            
            <h3 className={`text-lg font-semibold mb-3 transition-colors duration-200 ${
              theme === 'dark' 
                ? 'text-white group-hover:text-blue-400' 
                : 'text-gray-900 group-hover:text-blue-600'
            }`}>
              {problem.name}
            </h3>
            
            <p className={`text-sm leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {problem.summary}
            </p>
          </div>
          
          <button
            onClick={() => onDelete(index)}
            className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
              theme === 'dark' 
                ? 'hover:bg-red-900/20 text-gray-400 hover:text-red-400' 
                : 'hover:bg-red-50 text-gray-400 hover:text-red-600'
            }`}
            title="Delete problem"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="px-6 pb-6 space-y-3">
        {sectionConfig.map(({ key, icon: Icon, title, content, color, isLink }) => (
          content && (
            <div key={key} className={`border rounded-lg overflow-hidden ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                onClick={() => toggleSection(key)}
                className={`w-full flex items-center justify-between p-4 text-left transition-colors duration-200 ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700/50 bg-gray-700/20' 
                    : 'hover:bg-gray-50 bg-gray-50/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={18} className={color} />
                  <span className="font-medium">{title}</span>
                </div>
                <div className="transition-transform duration-200">
                  {expandedSections[key] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedSections[key] 
                  ? 'max-h-96 opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}>
                <div className={`p-4 border-t ${
                  theme === 'dark' 
                    ? 'bg-gray-800/50 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  {isLink ? (
                    <a
                      href={content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center space-x-2 font-medium transition-colors duration-200 ${
                        theme === 'dark' 
                          ? 'text-blue-400 hover:text-blue-300' 
                          : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      <span>View Solution</span>
                      <ExternalLink size={14} />
                    </a>
                  ) : (
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

