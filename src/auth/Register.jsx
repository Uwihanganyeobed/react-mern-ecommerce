import React, { useState } from "react";
import { formSchema } from "../utils/validations"; // Import the validation schema
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      formSchema.parse(formData);

      const response = await fetch(`http://localhost:5000/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Successfully signed up!");
        navigate("/login");
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
     <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"> Create a new account
     </h2>
   </div>

   <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
     <form onSubmit={handleSubmit} className="space-y-6">
       {/* Name field for sign-up */}
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
               autoComplete="name"
               value={formData.name}
               onChange={handleChange}
               className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
             />
             {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
           </div>
         </div>

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
               value={formData.phone}
               onChange={handleChange}
               className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
             />
             {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
           </div>
         </div>

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
             value={formData.password}
             onChange={handleChange}
             className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
           />
           {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
         </div>
       </div>

       {/* Confirm Password field for sign-up */}
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
               value={formData.confirmPassword}
               onChange={handleChange}
               className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
             />
             {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
           </div>
         </div>

       <div>
         <button
           type="submit"
           className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
         > Sign up
         </button>
       </div>

       {/* Display general errors if any */}
       {errors.general && <p className="text-red-500 text-xs">{errors.general}</p>}
     </form>

     <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
   </div>
 </div>
 );
}