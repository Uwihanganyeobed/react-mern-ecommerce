import React, { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { contactSchema } from '../utils/validations';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('');

  const validateForm = () => {
    try {
      // Validate the entire form data against the schema
      contactSchema.parse(formData);
      // Clear any existing errors if validation passes
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to a more manageable format
        const errorMap = error.flatten().fieldErrors;
        const formattedErrors = Object.fromEntries(
          Object.entries(errorMap).map(([key, value]) => [key, value?.[0] || ''])
        );
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const response = await axios.post('https://react-mern-back-end.onrender.com/feedback', formData);
        
        if (response.status === 201) {
          toast.success(response.data.message);
          setSubmitStatus('');  // Clear the status since we're using toast
          // Reset form after successful submission
          setFormData({
            name: '',
            phone: '',
            email: '',
            message: ''
          });
        } else {
          toast.error(response.data.error || 'Failed to send message. Please try again.');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Failed to send message. Please try again.';
        toast.error(errorMessage);
        console.error('Submission error:', error);
      }
    }
  };

  return (
    <section className="py-24" id='contact'>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-10">
          
          {/* Left Section with Image and Contact Info */}
          <div className="relative h-full">
            <img
              src="/assets/logo.png"
              alt="Contact KFLS"
              className="w-full h-full lg:rounded-l-2xl rounded-2xl object-cover bg-indigo-700"
            />
            <h1 className="absolute top-11 left-11 text-4xl font-bold text-white font-manrope">
              Contact Us
            </h1>
            <div className="absolute bottom-0 w-full p-5 lg:p-11">
              <div className="bg-white p-6 rounded-lg">
                
                {/* Contact Info Links */}
                <div className="flex items-center mb-6">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.3092 18.3098C22.0157 18.198 21.8689 18.1421 21.7145 18.1287C21.56 18.1154 21.4058 18.1453 21.0975 18.205L17.8126 18.8416C17.4392 18.9139 17.2525 18.9501 17.0616 18.9206C16.8707 18.891 16.7141 18.8058 16.4008 18.6353C13.8644 17.2551 12.1853 15.6617 11.1192 13.3695C10.9964 13.1055 10.935 12.9735 10.9133 12.8017C10.8917 12.6298 10.9218 12.4684 10.982 12.1456L11.6196 8.72559C11.6759 8.42342 11.7041 8.27233 11.6908 8.12115C11.6775 7.96998 11.6234 7.82612 11.5153 7.5384L10.6314 5.18758C10.37 4.49217 10.2392 4.14447 9.95437 3.94723C9.6695 3.75 9.29804 3.75 8.5551 3.75H5.85778C4.74506 3.75 3.83461 4.51057 3.65278 5.61002C3.32152 7.54304 4.01669 10.0365 6.02943 12.7237C8.04217 15.4109 10.3963 17.5677 13.0829 19.1941C16.0444 20.9624 18.9274 21.75 21.3012 21.75C22.4648 21.75 23.4 20.8744 23.5609 19.7213L23.75 18.4139C23.8266 17.8533 23.5171 17.3286 22.9961 17.1116L22.3092 18.3098Z" fill="#4F46E5"/>
                  </svg>
                  <h5 className="ml-5 text-base font-normal text-black leading-6">
                    +250-788-123456
                  </h5>
                </div>

                <div className="flex items-center mb-6">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 2.5L2.5 9.375L15 16.25L27.5 9.375L15 2.5Z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.5 20.625L15 27.5L27.5 20.625" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.5 15L15 21.875L27.5 15" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h5 className="ml-5 text-base font-normal text-black leading-6">
                    support@kfleshop.rw
                  </h5>
                </div>

                <div className="flex items-center">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 2.5C9.4775 2.5 4.99999 6.9775 4.99999 12.5C4.99999 19.375 15 27.5 15 27.5C15 27.5 25 19.375 25 12.5C25 6.9775 20.5225 2.5 15 2.5ZM15 16.25C12.93 16.25 11.25 14.57 11.25 12.5C11.25 10.43 12.93 8.75 15 8.75C17.07 8.75 18.75 10.43 18.75 12.5C18.75 14.57 17.07 16.25 15 16.25Z" fill="#4F46E5"/>
                  </svg>
                  <h5 className="ml-5 text-base font-normal text-black leading-6">
                    Kigali, Rwanda
                  </h5>
                </div>

              </div>
            </div>
          </div>
          
          {/* Right Section with Contact Form */}
          <div className="bg-gray-50 p-5 lg:p-11 lg:rounded-r-2xl rounded-2xl">
            <h2 className="text-4xl font-semibold font-manrope text-indigo-600 leading-10 mb-11">
              Send Us A Message
            </h2>
            
            <form onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full h-12 pl-4 text-lg font-normal text-gray-600 placeholder-gray-400 shadow-sm bg-transparent border rounded-full focus:outline-none ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Your Name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Phone Number Input */}
              <div className="mb-4">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full h-12 pl-4 text-lg font-normal text-gray-600 placeholder-gray-400 shadow-sm bg-transparent border rounded-full focus:outline-none ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Your Phone Number (e.g., +250788123456)"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* Email Input */}
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full h-12 pl-4 text-lg font-normal text-gray-600 placeholder-gray-400 shadow-sm bg-transparent border rounded-full focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Your Email Address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Message Textarea */}
              <div className="mb-4">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full h-auto pl-4 pt-4 text-lg font-normal text-gray-600 placeholder-gray-400 shadow-sm bg-transparent border rounded-xl focus:outline-none ${errors.message ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Your Message"
                  rows={6}
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              {/* Submit Status Message */}
              {submitStatus && (
                <div className={`mb-4 p-3 rounded ${submitStatus.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {submitStatus}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-12 text-base font-normal text-white bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-500 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;