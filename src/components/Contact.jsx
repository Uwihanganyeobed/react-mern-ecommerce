import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useAuth } from '../context/authContext';

const Contact = () => {
  const { user, isLoggedIn } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set the formData name field with the logged-in user's name if it exists
  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user.name
      }));
    }
  }, [isLoggedIn, user]);

  // Validation schema
  const validationSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
    message: z.string().min(10, 'Message must be at least 10 characters')
  });

  const validateForm = () => {
    try {
      validationSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors);
      }
      return false;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setTimeout(() => {
        toast.success('Message sent successfully!');
        setFormData({ name: '', phone: '', message: '' });
        setIsSubmitting(false);
      }, 1000);
    } else {
      toast.error('Please fix the errors before submitting.');
    }
  };

  return (
    <section className="py-24" id="contact">
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
                <div className="flex items-center mb-6">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="..." fill="#4F46E5"/>
                  </svg>
                  <h5 className="ml-5 text-base font-normal text-black leading-6">+250-788-123456</h5>
                </div>
                <div className="flex items-center mb-6">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="..." stroke="#4F46E5" strokeWidth="2"/>
                  </svg>
                  <h5 className="ml-5 text-base font-normal text-black leading-6">support@kfleshop.rw</h5>
                </div>
                <div className="flex items-center">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="..." fill="#4F46E5"/>
                  </svg>
                  <h5 className="ml-5 text-base font-normal text-black leading-6">Kigali, Rwanda</h5>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Section with Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
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

              {/* Phone Input */}
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

              {isSubmitting && (
                <div className="mb-4 p-3 rounded bg-indigo-100 text-indigo-800">
                  Submitting...
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-normal text-white bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-500 transition-colors disabled:bg-indigo-300"
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
