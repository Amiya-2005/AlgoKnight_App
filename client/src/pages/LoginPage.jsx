import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { EyeIcon, EyeOffIcon, LogInIcon, Code, Award } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import Buffer from '../components/common/Buffer';


const LoginPage = () => {
  const { theme } = useContext(ThemeContext);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { login, OAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [pageLoading, setPageLoading] = useState(false);
  const [fadeOutPageLoader, setFadeOutPageLoader] = useState(false);


  // Trigger load animation
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, [theme]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const validate = () => {
    // Email validation
    if (!credentials.email) {
      toast.error('Email is required');
      return false;
    }
    else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      toast.error('Email address is invalid');
      return false;
    }

    // Password validation
    if (!credentials.password) {
      toast.error('Password is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setPageLoading(true);

    try {
      const response = await login(credentials);

      console.log("Response from api : ", response);

      if (response.success === true) {
        toast.success(response.message);
        navigate('/dashboard');
        return;
      }
      else {
        toast.error(response.message);
        if (response.message === 'Please signup first') {
          navigate('/register');
        }
      }
    } catch (error) {
      console.log('Sign In failed.');
    }
    finally {
      setPageLoading(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setPageLoading(true);
    try {
      const response = await OAuth();
      if (response.success === true) {
        toast.success(response.message);
        navigate('/dashboard');
      }
      else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error : ", error);
      if (error.code) toast.error('Google-Auth failed.');  //Firebase-special errors
    }
    setPageLoading(false);
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    pageLoading ? <Buffer className='xl:pl-64' type='dots' text="Please wait..." fadeOut={fadeOutPageLoader} />
      :
      <div className='w-full max-w-md flex justify-center'>
        <div className={`my-2 w-full max-w-[98%] transition-all duration-400 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="relative rounded-xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            {/* Decorative header accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

            {/* Login card content */}
            <div className="p-8">
              {/* Logo and heading */}
              <div className="flex flex-col items-center mb-8">
                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Code size={28} />
                </div>
                <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center">
                  Algo<span className="text-gray-800 dark:text-white">Knight</span>
                  <Award className="ml-1 text-amber-500" size={18} />
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Sign in to continue your competitive coding journey
                </p>
              </div>


              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className='w-full sm:w-3/4'>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="your.email@example.com"
                    value={credentials.email}
                    onChange={handleChange}
                    fullWidth={true}
                    className="transition-all duration-200 dark:placeholder-gray-500 placeholder-gray-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Password
                    </label>
                  </div>
                  <div className="flex justify-between relative w-full sm:w-3/4">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      value={credentials.password}
                      onChange={handleChange}
                      fullWidth={true}
                      className="w-full transition-all duration-200 dark:placeholder-gray-500 placeholder-gray-400"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      onClick={toggleShowPassword}
                      tabIndex="-1"
                    >
                      {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  variant='primary'
                  fullWidth={true}
                >

                  <span className="flex items-center">
                    <LogInIcon size={18} className="mr-2" />
                    Login
                  </span>
                </Button>
              </form>

              <div
                className="mt-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button className={"ring-1 ring-blue-300"} variant='primary' shadow={true} fullWidth={true} dark={theme === 'dark'} onClick={handleGoogleSubmit}>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </Button>
                </div>
              </div>

              <div
                className="mt-8 text-center"

              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors hover:underline">
                    Register
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LoginPage;