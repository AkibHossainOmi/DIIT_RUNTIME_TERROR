import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setLoggedIn } from "./Status";

export default function Registration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const history = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Reset validation errors when the user modifies the input
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const getUserByEmail = async (email) => {
    try {
      const response = await fetch(`http://localhost:8000/api/credentials`);
      const result = await response.json();
      const userCredentials = result.userCredentials;

      // Find the user with the given email
      const user = userCredentials.find((user) => user.email === email);

      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const validateForm = () => {
    let isValid = true;
    const { name, email, password, password_confirmation } = formData;

    // Validate name
    if (!name.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name can't be empty",
      }));
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email address",
      }));
      isValid = false;
    }

    // Validate password length
    if (password.length < 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 8 characters long",
      }));
      isValid = false;
    }

    if (!password.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Passwords can't be empty",
      }));
      isValid = false;
    }

    // Validate password confirmation
    if (password !== password_confirmation) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password_confirmation: "Passwords do not match",
      }));
      isValid = false;
    }

    if (!password_confirmation.trim() && password === password_confirmation) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password_confirmation: "Passwords can't be empty",
      }));
      isValid = false;
    }
    if (!password_confirmation.trim() && password !== password_confirmation) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password_confirmation: "Passwords do not match",
      }));
      isValid = false;
    }

    return isValid;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Stop registration if there are validation errors
      return;
    }

    const { email } = formData;

    // Check if email is already registered
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is already registered",
      }));
      return;
    }

    // Continue with registration logic if email is not registered
    try {
      const response = await fetch("http://localhost:8000/api/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registration successful, redirect to the dashboard
        const result = await response.json();
        console.log(result);
        setLoggedIn();
        // Redirect to the dashboard
        history('/dashboard');
        window.location.reload();
      } else {
        // Registration failed, handle error
        const result = await response.json();
        console.error(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
        <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
          Register
        </h1>
        <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-md sm:rounded-lg">
          <form onSubmit={handleRegistration}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  className={`block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                    errors.password_confirmation ? "border-red-500" : ""
                  }`}
                />
                {errors.password_confirmation && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password_confirmation}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end mt-4">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-900 border border-transparent rounded-md active:bg-gray-900"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
                         