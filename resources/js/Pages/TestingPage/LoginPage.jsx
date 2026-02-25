import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempted with:', { email, password });
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header */}
          <div>
            <div className="flex justify-center">
              <div className="h-12 w-12 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">C</span>
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extralight tracking-tight text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500 font-light">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition duration-150 ease-in-out sm:text-sm"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition duration-150 ease-in-out sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-black hover:text-gray-600 transition duration-150 ease-in-out">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-150 ease-in-out"
              >
                Sign in
              </button>
            </div>

            {/* Sign up link */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <a href="#" className="font-medium text-black hover:text-gray-600 transition duration-150 ease-in-out">
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Minimal Design Element */}
      <div className="hidden lg:block lg:w-1/2 bg-gray-50">
        <div className="h-full flex flex-col items-center justify-center p-12">
          {/* Abstract minimal design */}
          <div className="relative">
            <div className="w-64 h-64 bg-black rounded-full opacity-5 absolute -top-32 -left-32"></div>
            <div className="w-96 h-96 border-2 border-gray-200 rounded-lg rotate-45 transform origin-center"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl font-thin text-gray-200 mb-4">✦</div>
                <h3 className="text-2xl font-light text-gray-400">Secure Access</h3>
                <p className="text-sm text-gray-300 mt-2">Enterprise-grade security</p>
              </div>
            </div>
          </div>
          
          {/* Testimonial or brand message */}
          <div className="mt-16 text-center max-w-sm">
            <p className="text-gray-400 text-sm italic">
              "The most minimalist and secure platform for our corporate needs"
            </p>
            <div className="mt-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full mx-auto"></div>
              <p className="text-sm font-medium text-gray-600 mt-2">Sarah Johnson</p>
              <p className="text-xs text-gray-400">CEO, TechCorp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;