import React, { useState, useContext } from "react";
import { formSchema } from "../utils/validations";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/authContext";

export default function Form({ type }) {
  const navigate = useNavigate();
  const isLogin = type === "login";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: isLogin ? undefined : "User",
  });
  const [errors, setErrors] = useState({});
  const { login } = useContext(AuthContext); // Use the login method from AuthContext

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const schema = formSchema(type);
      schema.parse(formData);
  
      const response = await fetch(`https://react-mern-back-end.onrender.com/auth/${isLogin ? "login" : "signup"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isLogin ? { email: formData.email, password: formData.password } : formData),
      });
  
      const data = await response.json();
      if (data.success) {
        toast.success(isLogin ? 'Welcome 😃 again!' : "Successfully signed up!");

        if (data.token) {
          // Store token and username using the login method from context
          login(data.token, formData.name);

          // Fetch user data if necessary
          const decodedToken = JSON.parse(atob(data.token.split('.')[1])); // Decode JWT to get user ID
          const userId = decodedToken.id;

          // Fetch user details
          const userResponse = await fetch(`https://react-mern-back-end.onrender.com/users/${userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          });
          const userData = await userResponse.json();
  
          if (userData && userData.name) {
            login(data.token, userData.name); // Store username in context
          }
  
          navigate("/"); // Redirect after success
        }
      } else {
        setErrors({ general: data.error });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
      }
    }
  };
  

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8" id="form">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name field for sign-up */}
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  required={!isLogin}
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>
            </div>
          )}

          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
          </div>

          {/* Phone field for sign-up */}
          {!isLogin && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                Phone Number
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  required={!isLogin}
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
              </div>
            </div>
          )}

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="******"
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>
          </div>

          {/* Confirm Password field for sign-up */}
          {!isLogin && (
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-gray-900">
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="******"
                  required={!isLogin}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              {isLogin ? "Sign in" : "Sign up"}
            </button>
          </div>

          {/* Display success message */}
          {/* {successMessage && <p className="text-green-500 text-xs">{successMessage}</p>} */}

          {/* Display general errors if any */}
          {errors.general && <p className="text-red-500 text-xs">{errors.general}</p>}
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          {isLogin ? (
            <>
              Not a member yet?{" "}
              <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Create One
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Sign In
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
