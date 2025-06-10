import { useState, useEffect, useRef, useContext } from 'react';
import Button from '../components/common/Button';
import { ExternalLink } from 'lucide-react';
import { ProfileContext } from '../context/ProfileContext';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { CodeChefIcon, CodeForcesIcon, LeetCodeIcon } from '../components/common/Icons';
import { ThemeContext } from '../context/ThemeContext';

const ProfilePage = () => {

  const { profileData, setProfileData, updateProfile, updateHandles } = useContext(ProfileContext);
  const {theme} = useContext(ThemeContext);

  // Form states
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingHandles, setIsEditingHandles] = useState(false);

  const [personalInfo, setPersonalInfo] = useState(profileData.personal);
  const [cpHandles, setCpHandles] = useState(profileData.handles);
  const [quickStats, setQuickStats] = useState(profileData.quickStats);

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setIsEditingPersonal(false);

    const response = await updateProfile(personalInfo);
    setProfileData({...profileData, personal : personalInfo})

    if (response?.success) {
      toast.success(response.message);
    }
    //failed case handled in api.js
  };

  const handleHandlesSubmit = async (e) => {
    e.preventDefault();
    setIsEditingHandles(false);

    const response = await updateHandles(cpHandles);
    setProfileData({...profileData, handles : cpHandles})

    if (response?.success) {
      toast.success(response.message);
      setTimeout(() => toast.success("Data will be updated on dashboard after some time."), 2500)
    }
  };

  const [animationDone, setAnimationDone] = useState(false);

  const location = useLocation();
  const [sectionId, setSectionId] = useState(location.state?.sectionId);


  useEffect(() => {
    console.log("Location states : ", location.state);
    setSectionId(location.state?.sectionId)
  }, [location.state])

  useEffect(() => {
    if (sectionId) {
      const section = document.getElementById(sectionId);
      setTimeout(() => {
        section.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }, 100);
      setSectionId(null);
      console.log("to be Scrolled down")
    }
    else {
      window.scroll({ top: 0, behavior: 'smooth' })
      console.log("to be Scrolled up")
    }
  }, [sectionId])

  useEffect(() => {
    requestAnimationFrame(() => { // RAF is used when u want to run something after next browser re-paint (NOT RE-RENDER !)
      setAnimationDone(true);
    });
    
  }, [])


  const platforms = [
    { key: 'codeforces', name: 'Codeforces', color: 'bg-gray-100 dark:bg-gray-900', icon: <CodeForcesIcon /> },
    { key: 'codechef', name: 'CodeChef', color: 'bg-gray-100 dark:bg-gray-900', icon: <CodeChefIcon /> },
    { key: 'leetcode', name: 'LeetCode', color: 'bg-gray-100 dark:bg-gray-900', icon: <LeetCodeIcon theme={theme}/> }
  ];

  const handleHandleOpen = (handle, platform) => {
    if(!handle) return;    
    if (platform.key === 'codeforces') window.open(`https://codeforces.com/profile/${handle}`, '_blank');
    if (platform.key === 'codechef') window.open(`https://www.codechef.com/users/${handle}`, '_blank');
    if (platform.key === 'leetcode') window.open(`https://leetcode.com/u/${handle}`, '_blank');
  };

  return (
    <div className="min-h-screen p-6 md:p-10 w-full xl:ml-64 dark:bg-gradient-to-r dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      <div className="w-full mx-auto">

        {/* Header Section */}
        <div
          className={`text-center mb-12 transition-all duration-1000 transform ${animationDone
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {personalInfo.fullName[0]}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {personalInfo.fullName}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {personalInfo.email}
          </p>
          <div className="flex items-center justify-center mt-4 text-gray-500 dark:text-gray-400">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.95.524zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" clipRule="evenodd" />
            </svg>
            {personalInfo.university || '-'}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Personal Information Section */}
          <div
            className={`lg:col-span-2 transition-all duration-1000 transform ${animationDone
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-20'
              }`}
          >
            <div className='rounded-lg shadow-md bg-white dark:bg-gray-800 p-6'>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>

                {
                  !isEditingPersonal &&
                  <Button
                    onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Edit
                  </Button>
                }

              </div>

              {!isEditingPersonal ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Full Name</label>
                      <p className="text-gray-900 dark:text-white font-medium">{personalInfo.fullName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Username</label>
                      <p className="text-gray-900 dark:text-white">{personalInfo.userName}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">University</label>
                      <p className="text-gray-900 dark:text-white">{personalInfo.university}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Year of Study</label>
                      <p className="text-gray-900 dark:text-white">{personalInfo.yearOfStudy}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Bio</label>
                    <p className="text-gray-900 dark:text-white">{personalInfo.bio}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={personalInfo.fullName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Username</label>
                      <input
                        type="text"
                        value={personalInfo.userName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, userName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">University</label>
                      <input
                        type="text"
                        value={personalInfo.university}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, university: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Year of Study</label>
                      <select
                        value={personalInfo.yearOfStudy}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, yearOfStudy: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="None">None</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Working Professional">Working Professional</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Bio</label>
                    <textarea
                      value={personalInfo.bio}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={handlePersonalSubmit}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant='secondary'
                      onClick={() => setIsEditingPersonal(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Quick Stats Section */}
          <div
            className={`h-fit transition-all duration-1000 transform ${animationDone
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-20'
              }`}
            style={{ transitionDelay: '150ms' }}
          >
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Problems Solved</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{quickStats.totalProblemsSolved}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Contests Appeared</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">{quickStats.totalContestsAppeared}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Average Contest Rating</span>
                  <span className="font-bold text-green-600 dark:text-green-400">{quickStats.averageRating}</span>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* CP Handles Section */}
        <div
          id='handles'
          className={`mt-8  transition-all duration-1000 transform ${animationDone
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-20'
            }`}
        >
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">CP Handles</h2>

              {!isEditingHandles &&
                <Button
                  onClick={() => setIsEditingHandles(!isEditingHandles)}
                >
                  Edit
                </Button>
              }
            </div>

            {!isEditingHandles ? (
              <div className="grid md:grid-cols-3 gap-4">
                {platforms.map((platform, index) => (
                  <div
                    key={platform.key}
                    className={`border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md `}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`w-10 h-10 ${platform.color} rounded-full flex items-center justify-center mr-3`}>
                        {platform.icon}
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{platform.name}</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-mono text-lg">
                      {cpHandles[platform.key] || 'Not set'}
                    </p>
                    <div className='flex justify-center items-center gap-3 mt-3 pt-3 pb-1 border-t border-t-gray-500 text:gray-900 dark:text-gray-100 text-center cursor-pointer' onClick={() => handleHandleOpen(cpHandles[platform.key], platform)}>
                      <ExternalLink size={20} className='text-blue-700 dark:text-blue-400' /> Open handle
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div >
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {platforms.map((platform) => (
                    <div key={platform.key}>
                      <label className="block text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                        {platform.name} Handle
                      </label>
                      <input
                        type="text"
                        value={cpHandles[platform.key]}
                        onChange={(e) => setCpHandles({ ...cpHandles, [platform.key]: e.target.value })}
                        placeholder={`Your ${platform.name} username`}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleHandlesSubmit}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant='secondary'
                    onClick={() => setIsEditingHandles(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProfilePage;