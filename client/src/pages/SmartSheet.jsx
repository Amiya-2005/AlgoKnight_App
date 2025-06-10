import React, { useEffect, useState, useRef, useContext } from "react";
import { Search, Tag, X } from "lucide-react";
import Button from "../components/common/Button";
import { SmartSheetContext } from "../context/SmartSheetContext";
import Buffer from '../components/common/Buffer';


const SmartSheet = () => {
  // State to track which sections have been animated
  const [animatedSections, setAnimatedSections] = useState({
    header: false,
    filters: false,
    problems: false
  });

  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [showTags, setShowTags] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');


  const [pageLoading, setPageLoading] = useState(true);
  const [fadeOutPageLoader, setFadeOutPageLoader] = useState(!pageLoading);

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { getFullSheet } = useContext(SmartSheetContext);
  const [allProblems, setAllProblems] = useState();
  const [filteredProblems, setFilteredProblems] = useState();


  const difficultyFilterHandler = (problem) => {
    if (selectedDifficulty === 'all') return true;
    let diff = problem.task.difficulty;
    if (problem.task.platform === 'leetcode') return diff.toLowerCase() === selectedDifficulty;
    diff = parseInt(diff);
    console.log("Diff : ", diff);
    console.log(typeof (diff));
    return diff < 1400 && selectedDifficulty === 'easy' ||
      1400 <= diff && diff < 1800 && selectedDifficulty === 'medium' ||
      1800 <= diff && diff < 2100 && selectedDifficulty === 'hard' ||
      2100 <= diff && selectedDifficulty === 'insane'
  }

  // Filter problems based on selected filters and search query
  const pageAndFilterHandler = () => {
    const filtered = allProblems.filter(problem => {
      const difficultyMatch = difficultyFilterHandler(problem);
      const platformMatch = selectedPlatform === 'all' || problem.task.platform.toLowerCase() === selectedPlatform.toLowerCase();
      const searchMatch = searchQuery === '' ||
        problem.task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      return difficultyMatch && platformMatch && searchMatch;
    });

    setTotalPages(Math.ceil(filtered.length / limit));
    setFilteredProblems(filtered.slice((currentPage - 1) * limit, currentPage * limit));
  };


  useEffect(() => {
    const fun = async () => {
      const fullSheet = (await getFullSheet())
      console.log("Full sheet : ", fullSheet);
      setAllProblems(fullSheet);
    }
    if (allProblems) {
      pageAndFilterHandler();
      setFadeOutPageLoader(true);
      setTimeout(() => {
        setPageLoading(false);
      }, 200);
    }
    else fun();
  }, [allProblems])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
    if (allProblems) pageAndFilterHandler();
  }, [selectedDifficulty, selectedPlatform, searchQuery]);

  // Rerender on page change
  useEffect(() => {
    if (allProblems) pageAndFilterHandler();
  }, [currentPage])


  // Handle scroll events
  useEffect(() => {
    if (pageLoading) return;
    const handleScroll = () => {
      setAnimatedSections(prev => ({
        header: prev.header || isInViewport(headerRef.current),
        filters: prev.filters || isInViewport(filtersRef.current),
        problems: prev.problems || isInViewport(problemsRef.current)
      }));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pageLoading]);


  // Refs for sections
  const headerRef = useRef(null);
  const filtersRef = useRef(null);
  const problemsRef = useRef(null);

  // Function to check if element is in viewport
  const isInViewport = (element) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75 &&
      rect.bottom >= 0
    );
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Get platform color
  const getPlatformColor = (platform) => {
    switch (platform.toLowerCase()) {
      case 'leetcode': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'codeforces': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'atcoder': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const handleProblemClick = (problemUrl) => {
    window.open(problemUrl, '_blank');
  };

  return (
    pageLoading ? (
      <Buffer className='xl:pl-64' type='dots' text="Loading Smartsheet..." fadeOut={fadeOutPageLoader} />
    ) : (<div className="w-full py-12 md:py-20 px-10 xl:ml-64 dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 
        dark:text-white 
        bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900">
      {/* Header Section */}
      <div
        ref={headerRef}
        className={`text-center mb-12 transition-all duration-1000 transform ${animatedSections.header
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
          }`}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-500 mb-4">
          Smart <span className="text-gray-900 dark:text-white">Sheet</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Boost your practice with the set of recent problems having highest submissions across <span className="font-bold">your network</span> !
        </p>
      </div>

      {/* Filters Section */}
      <div
        ref={filtersRef}
        className={`mb-8 transition-all duration-700 ${animatedSections.filters ? 'opacity-100' : 'opacity-0'
          }`}
      >
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search problems, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-blue-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Filters and Tag Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty:</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-blue-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="all">All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="insane">Insane</option>
              </select>
            </div>

            {/* Platform Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Platform:</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-3 py-2 border border-blue-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Platforms</option>
                <option value="leetcode">LeetCode</option>
                <option value="codeforces">Codeforces</option>
              </select>
            </div>

            {/* Tag Toggle */}
            <button
              onClick={() => setShowTags(!showTags)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all duration-200 ${showTags
                ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-blue-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700' : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                }`}
            >
              {showTags ? <X className="h-4 w-4" /> : <Tag className="h-4 w-4" />}
              <span className="text-sm font-medium min-w-[67px]">{showTags ? 'Hide Tags' : 'Show Tags'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Problems Section */}
      <div
        ref={problemsRef}
        className={`transition-all duration-700 ${animatedSections.problems ? 'opacity-100' : 'opacity-0'
          }`}
      >
        {filteredProblems.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No problems found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or expand your network to see more problems.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 mb-8">
              {filteredProblems.map((problem, index) => (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-blue-300 dark:border-blue-700">
                  <div
                    key={problem.task._id}
                    className={`transition-all duration-700 transform cursor-pointer ${animatedSections.problems
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-20 opacity-0'
                      }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                    onClick={() => handleProblemClick(problem.task.url)}
                  >
                    <div className="w-full h-full transition-all duration-200 hover:bg-gray-100 hover:dark:bg-gray-900 rounded-lg p-4 sm:p-5">
                      <div className="flex flex-col gap-4">
                        {/* Main content row */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          {/* Problem Info */}
                          <div className="flex-1 flex flex-col min-w-0">
                            <div className="flex-1">
                              {/* Header Section - Title */}
                              <div className="mb-3">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors break-words">
                                  {problem.task.name}
                                </h3>
                              </div>

                              {/* Platform and Difficulty */}
                              <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.task.difficulty)}`}>
                                  {problem.task.difficulty}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlatformColor(problem.task.platform)}`}>
                                  {problem.task.platform}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions and Connection Count - Desktop */}
                          <div className="hidden sm:flex flex-col items-end gap-3 flex-shrink-0">
                            {/* Button and connection count row */}
                            <div className="flex flex-col lg:flex-row items-end lg:items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 px-3 py-2 rounded-lg text-lg font-bold">
                                  {problem.count}
                                </span>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">connections attempted</span>
                              </div>

                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleProblemClick(problem.task.url);
                                }}
                              >
                                Solve Now
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Actions - Only visible on small screens */}
                        <div className="flex sm:hidden items-center justify-between gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 px-2 py-1 rounded text-base font-bold">
                              {problem.count}
                            </span>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">connections</span>
                          </div>

                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProblemClick(problem.task.url);
                            }}
                            className="px-4 py-2"
                          >
                            Solve Now
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Total users solved - At bottom */}
                          <div className="text-sm text-gray-600 dark:text-gray-400 py-1.5 px-2">
                            <span className="font-medium">{problem.task.solvers.length}</span>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400"> users solved</span>
                          </div>
                          {/* Tags row - Positioned in the middle gap */}
                          {showTags && (
                            <div className="flex flex-wrap gap-2 justify-end items-center">
                              {problem.task.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs sm:text-sm whitespace-nowrap"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>


            {/* Stats Section */}
            <div className="mt-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-3 text-white">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-lg sm:text-2xl font-bold mb-1">{filteredProblems.length}</div>
                  <div className="text-indigo-100">Problems on this page</div>
                </div>

                <div>
                  <div className="text-lg sm:text-2xl font-bold mb-1">{new Set(filteredProblems.map(p => p.task.platform)).size}</div>
                  <div className="text-indigo-100">Platforms</div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold mb-1">
                    {currentPage} / {Math.max(totalPages, 1)}
                  </div>
                  <div className="text-indigo-100">Current Page</div>
                </div>
              </div>
            </div>

          </>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>

            {/* Wide screens */}
            <div className="hidden md:flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-md text-xs sm:text-sm font-medium transition-colors ${currentPage === pageNum
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Mobile screens */}
            <div className="flex md:hidden items-center gap-2">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 3) {
                  pageNum = i + 1;
                } else if (currentPage <= 2) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 1) {
                  pageNum = totalPages - 2 + i;
                } else {
                  pageNum = currentPage - 1 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-md text-xs sm:text-sm font-medium transition-colors ${currentPage === pageNum
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

      </div>


    </div>)
  );
};

export default SmartSheet;