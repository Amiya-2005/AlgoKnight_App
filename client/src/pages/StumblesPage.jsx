import { useState, useEffect, useContext } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import StumbleCard from './StumbleCard';
import Buffer from '../components/common/Buffer';
import Button from '../components/common/Button';
import { StumbleContext } from '../context/StumbleContext';
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

// Add Problem Modal
const AddProblemModal = ({ isOpen, onClose, onAdd, theme }) => {
  const [formData, setFormData] = useState({
    name: '',
    summary: '',
    url: '',
    platform: 'leetcode',
    hint: '',
    intuition: '',
    solution: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProblem = {
      ...formData,
      status: formData.solution.trim().length > 0 ? 'solved' : 'unsolved',
    };
    onAdd(newProblem);
    setFormData({
      name: '',
      summary: '',
      url: '',
      platform: 'codeforces',
      hint: '',
      intuition: '',
      solution: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto thin-scrollbar rounded-lg p-6 border border-r-0 ${theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200 shadow-lg'
        }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Add New Problem</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-1 focus:ring-blue-500 outline-none`}
              placeholder="Problem name"
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Summary *</label>
            <textarea
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border resize-none ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-1 focus:ring-blue-500 outline-none`}
              placeholder="Brief description of the problem or subproblem..."
              maxLength={200}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-1 focus:ring-blue-500 outline-none`}
              >
                <option value="leetcode">LeetCode</option>
                <option value="codeforces">CodeForces</option>
                <option value="codechef">CodeChef</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Problem URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-1 focus:ring-blue-500 outline-none`}
                placeholder="https://..."
                maxLength={150}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Hint</label>
            <textarea
              value={formData.hint}
              onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
              rows={2}
              className={`w-full px-3 py-2 rounded-lg border resize-none ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-1 focus:ring-blue-500 outline-none`}
              placeholder="Helpful hint or approach direction..."
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Intuition</label>
            <textarea
              value={formData.intuition}
              onChange={(e) => setFormData({ ...formData, intuition: e.target.value })}
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border resize-none ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-1 focus:ring-blue-500 outline-none`}
              placeholder="Key insight or thought process behind the solution..."
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Solution Link</label>
            <input
              type="url"
              value={formData.solution}
              onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-1 focus:ring-blue-500 outline-none`}
              placeholder="Link to your solution code, GitHub, etc..."
              maxLength={150}
            />
          </div>

          <div className="flex justify-around pt-4">
            <Button
              variant='secondary'
              onClick={onClose}
              className='w-2/5'
            >
              Cancel
            </Button>
            <Button
              className="w-2/5"
            >
              Add Problem
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [fadeOutPageLoader, setFadeOutPageLoader] = useState(false);

  const { theme } = useContext(ThemeContext);

  const { getAllStumbles, addStumble, removeStumble } = useContext(StumbleContext);


  useEffect(() => {
    const fun = async () => {
      const problems = await getAllStumbles();
      setProblems(problems);
      setFilteredProblems(problems);

      setFadeOutPageLoader(true);
      setTimeout(() => {
        setPageLoading(false);
        setAnimationDone(true);
      }, 500);
    };

    fun();

  }, []);

  // Filter problems
  useEffect(() => {
    let filtered = problems.filter(problem => {
      const matchesSearch = problem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (problem.summary && problem.summary.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPlatform = filterPlatform === 'all' || problem.platform === filterPlatform;
      const matchesStatus = filterStatus === 'all' || problem.status === filterStatus;

      return matchesSearch && matchesPlatform && matchesStatus;
    });

    setFilteredProblems(filtered);
  }, [problems, searchTerm, filterPlatform, filterStatus]);

  const handleAddProblem = async (newProblem) => {
    const response = await addStumble(newProblem);
    if (response.success) {
      toast.success("Problem added successfully");
      setProblems(prev => [newProblem, ...prev]);
    }
    else {
      toast.error("Problem addition failed");
    }
  };

  const handleDeleteProblem = async (index) => {
    const response = await removeStumble(index);
    if (response.success) {
      toast.success("Problem removed successfully");
      setProblems(prev => prev.filter((_, ind) => ind !== index));
    }
    else {
      toast.error("Problem removal failed");
    }
  };

  const getStats = () => {
    const total = problems.length;
    const solved = problems.filter(c => c.status === 'solved').length;
    const unsolved = problems.filter(c => c.status === 'unsolved').length;

    return { total, solved, unsolved };
  };

  const stats = getStats();

  if (pageLoading) {
    return <Buffer className='xl:pl-64' type='dots' text="Loading Problems..." fadeOut={fadeOutPageLoader} />;
  }

  return (
    <div className={`min-h-screen w-full xl:ml-64 p-6 dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 dark:text-white bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900 ${animationDone ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>

      {/* Header Section */}
      <AnimatedCard className="mb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 mt-10 text-indigo-700 dark:text-white">
            Tricky Problems
          </h1>
          <p className='mb-4 text-lg max-w-2xl mx-auto'>Save and review the problems you encounter that demand out-of-the-box thinking and clever techniques to be cracked.</p>

          {/* Stats */}
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm md:text-[1rem] text-gray-600 dark:text-gray-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-600">{stats.solved}</div>
              <div className="text-sm md:text-[1rem] text-gray-600 dark:text-gray-400">Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-orange-600">{stats.unsolved}</div>
              <div className="text-sm md:text-[1rem] text-gray-600 dark:text-gray-400">Unsolved</div>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Search and Filters Section */}
      <AnimatedCard delay={100}>
        <div className={`rounded-lg p-4 mb-6 shadow-sm ${theme === 'dark'
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-200'
          }`}>
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-1 focus:ring-blue-500 outline-none ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row  justify-center items-center gap-3 text-sm md:text-base">
              <div className='flex gap-3 '>
                <select
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value)}
                  className={`px-3 py-2 rounded-lg border ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                    } focus:ring-1 focus:ring-blue-500 outline-none`}
                >
                  <option value="all">All Platforms</option>
                  <option value="leetcode">LeetCode</option>
                  <option value="codeforces">CodeForces</option>
                  <option value="codechef">CodeChef</option>
                  <option value="other">Other</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`px-3 py-2 rounded-lg border ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                    } focus:ring-1 focus:ring-blue-500 outline-none `}
                >
                  <option value="all">All Status</option>
                  <option value="solved">Solved</option>
                  <option value="unsolved">Unsolved</option>
                </select>
              </div>

              <Button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add Problem</span>
              </Button>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Problems Grid */}
      <AnimatedCard delay={200}>
        {filteredProblems.length === 0 ? (
          <div className={`rounded-lg p-12 text-center shadow-sm ${theme === 'dark'
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
            } `}>
            <h3 className="text-xl font-semibold mb-2">No problems saved</h3>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {problems.length === 0
                ? "Add your first problem to get started"
                : "Try adjusting your search or filters"
              }
            </p>
            {problems.length === 0 && (
              <Button
                onClick={() => setShowAddModal(true)}
              >
                Add Your First Problem
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProblems.map((problem, index) => (
              <AnimatedCard key={index} delay={index * 50}>
                <StumbleCard
                  problem={problem}
                  theme={theme}
                  onDelete={handleDeleteProblem}
                  index={index}
                  key={index}
                />
              </AnimatedCard>
            ))}
          </div>
        )}
      </AnimatedCard>

      {/* Add Problem Modal */}
      <AddProblemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProblem}
        theme={theme}
      />
    </div>
  );
}