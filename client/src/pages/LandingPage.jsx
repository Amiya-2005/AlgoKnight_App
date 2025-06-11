import { useEffect, useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import { ThemeContext } from "../context/ThemeContext";

const LandingPage = () => {
  // State to track which sections have been animated
  const [animatedSections, setAnimatedSections] = useState({
    hero: false,
    features: false,
    testimonials: false,
    cta: false
  });

  const { theme } = useContext(ThemeContext);

  // Refs for each section
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);

  // Function to check if element is in viewport
  const isInViewport = (element) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.95 &&
      rect.bottom >= 0
    );
  };

  // Handle scroll events - only animate each section once
  useEffect(() => {
    const handleScroll = () => {
      // Only check sections that haven't been animated yet
      setAnimatedSections(prev => ({
        hero: prev.hero || isInViewport(heroRef.current),
        features: prev.features || isInViewport(featuresRef.current),
        testimonials: prev.testimonials || isInViewport(testimonialsRef.current),
        cta: prev.cta || isInViewport(ctaRef.current)
      }));
    };

    // Run once on mount to check initial viewport
    handleScroll();

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="py-12 md:py-20 px-10 xl:pl-74">
      {/* Hero Section */}
      <div
        ref={heroRef}
        className={`text-center mb-16 transition-all duration-1000 transform ${animatedSections.hero
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
          }`}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Level up your coding with <span className="text-blue-600 dark:text-blue-500">AlgoKnight</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          The ultimate platform for competitive programmers to track progress, manage contest schedules,
          and practice good problems to improve coding skills.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register">
            <Button variant="primary" size="lg" dark={theme === 'dark'}>Get Started</Button>
          </Link>
          <div onClick={() => document.getElementById('features').scrollIntoView({behavior : 'smooth' , block : 'start'})}>
            <Button variant="info" outline={true} size="lg" dark={theme === 'dark'} >Explore</Button>
          </div>
        </div>
      </div>

      {/* Enhanced Features Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Core Features
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Everything you need to track, learn, and excel in competitive programming
        </p>
      </div>

      {/* Feature Section */}
      <div
      id="features"
        ref={featuresRef}
        className={`grid md:grid-cols-3 gap-8 mb-16 transition-all duration-700 ${animatedSections.features ? 'opacity-100' : 'opacity-0'
          }`}
      >

        {/* Feature 1 - Problem Analytics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg ">
          <div className={`p-6 shadow-md transition-all duration-700 transform ${animatedSections.features ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`} style={{ transitionDelay: '0ms' }}>
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Problem Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Visualize your coding progress with category-wise pie charts and activity heatmaps for each platform. Knight your strengths and identify areas for improvement.
            </p>
          </div>
        </div>

        {/* Feature 2 - Network & Smartsheet */}
        <div className="bg-white dark:bg-gray-800 rounded-lg">
          <div className={`p-6 shadow-md transition-all duration-700 transform ${animatedSections.features ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`} style={{ transitionDelay: '150ms' }}>
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Network & Smartsheet</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Connect with fellow coders and get intelligent problem recommendations. Discover trending problems with highest submissions from your network for personalized practice.
            </p>
          </div>
        </div>

        {/* Feature 3 - Contest & POTD */}
        <div className="bg-white dark:bg-gray-800 rounded-lg">
          <div className={`p-6 shadow-md transition-all duration-700 transform ${animatedSections.features ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`} style={{ transitionDelay: '300ms' }}>
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Contest & POTD</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Never miss upcoming contests and daily coding challenges. Stay consistent with Problem of the Day notifications across major platforms.
            </p>
          </div>
        </div>

        {/* Feature 4 - Contest Upsolve */}
        <div className="bg-white dark:bg-gray-800 rounded-lg">
          <div className={`p-6 shadow-md transition-all duration-700 transform ${animatedSections.features ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`} style={{ transitionDelay: '450ms' }}>
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Contest Upsolve</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Review and practice problems from recent contests you've attended. Save your favorite contests for later review and continuous improvement.
            </p>
          </div>
        </div>

        {/* Feature 5 - Tricky Problems */}
        <div className="bg-white dark:bg-gray-800 rounded-lg">
          <div className={`p-6 shadow-md transition-all duration-700 transform ${animatedSections.features ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`} style={{ transitionDelay: '600ms' }}>
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Tricky Problems</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Save thought-provoking problems solved with unique techniques. Organize solutions with hint, intuition, and solution format for effective learning and review.
            </p>
          </div>
        </div>

        {/* Feature 6 - Saved Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg">
          <div className={`p-6 shadow-md transition-all duration-700 transform ${animatedSections.features ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`} style={{ transitionDelay: '750ms' }}>
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Saved Notes</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Build your personal library of algorithms and complex concepts. Save related practice problems for each concept to reinforce learning and enable quick recall.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div
        ref={testimonialsRef}
        className={`mb-16 transition-all duration-700 ${animatedSections.testimonials ? 'opacity-100' : 'opacity-0'
          } overflow-hidden`}
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          What Our Users Say
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Testimonial 1 - Fades in from right */}
          <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-700 transform ${animatedSections.testimonials
            ? 'translate-x-0 opacity-100'
            : 'translate-x-20 opacity-0'
            }`}>
            <div className="flex items-center mb-4">
              <div className="bg-indigo-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">John Doe</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Software Engineer</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 italic">
              "AlgoKnight helped me prepare for coding interviews systematically. I could track my progress and focus on my weak areas."
            </p>
          </div>

          {/* Testimonial 2 - Fades in from right with delay */}
          <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-700 transform ${animatedSections.testimonials
            ? 'translate-x-0 opacity-100'
            : 'translate-x-20 opacity-0'
            }`} style={{ transitionDelay: '150ms' }}>
            <div className="flex items-center mb-4">
              <div className="bg-indigo-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                JS
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Jane Smith</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Computer Science Student</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 italic">
              "The contest calendar and reminders are fantastic! I've never missed an important contest since I started using AlgoKnight."
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div
        ref={ctaRef}
        className={`bg-indigo-600 rounded-lg p-8 text-center transition-all duration-1000 transform ${animatedSections.cta
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95'
          }`}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Ready to Improve Your Coding Skills?
        </h2>
        <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
          Join thousands of developers who are tracking their progress and improving their skills with AlgoKnight.
        </p>
        <Link to="/register">
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition-all duration-300 transform hover:scale-105">
            Start Your Journey Today
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;