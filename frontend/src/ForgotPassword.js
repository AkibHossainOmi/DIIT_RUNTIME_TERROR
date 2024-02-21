import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const history = useNavigate();
  const [email, setEmail] = useState('');
  const [resetStatus, setResetStatus] = useState(null);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8000/api/forgot-password?email=${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Password reset request sent successfully
        setResetStatus('Password reset instructions sent to your email.');
      } else {
        // Failed to send reset request
        setResetStatus('Failed to send reset instructions. Please check your email.');
      }
    } catch (error) {
      console.error('An error occurred during password reset:', error);
      // Handle unexpected errors, e.g., network issues
      setResetStatus('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
          Forgot Password
        </h1>
        <form className="mt-6" onSubmit={handleForgotPassword}>
          <div className="mb-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mt-6">
            <button
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
            >
              Reset Password
            </button>
          </div>
        </form>
        {resetStatus && <p className="mt-4 text-sm text-purple-600">{resetStatus}</p>}
        <p className="mt-8 text-xs font-light text-center text-gray-700">
          Remember your password?{' '}
          <a href="/login" className="font-medium text-purple-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
