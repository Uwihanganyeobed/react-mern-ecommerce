import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSubscriber } from "../context/subscriberContext";
import { useAuth } from "../context/authContext";
import { footerSocialWebsites } from "../utils/items";
import { FaFacebook, FaInstagram, FaLinkedin} from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { subscribe, subscriptionStatus } = useSubscriber();
  const { user, isLoggedIn } = useAuth();

  // Update email when user authentication changes
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    } else {
      setEmail("");
    }
  }, [user, isLoggedIn]);

  // Get social icon by name
  const getSocialIcon = (name) => {
    switch (name.toLowerCase()) {
      case "facebook":
        return <FaFacebook className="h-6 w-6" color="#1877F2" />;
      case "twitter":
        return <BsTwitterX  className="h-6 w-6" color="black" />;
      case "instagram":
        return <FaInstagram className="h-6 w-6" color="#E1306C" />;
      case "linkedin":
        return <FaLinkedin className="h-6 w-6" color="#0A66C2" />;
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const subscribeData = {
        email: email,
        name: user?.name || "",
        preferences: {
          newProducts: true,
          promotions: true,
          events: true,
          blogPosts: true,
        },
      };

      await subscribe(subscribeData);
      if (!isLoggedIn) {
        setEmail(""); // Only clear if not authenticated
      }
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="w-full bg-slate-100 py-10 border-t">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 py-10">
          {/* Column 1: Logo and Contact */}
          <div>
            <div className="flex items-center mb-6">
              <img
                src="/assets/logo.png"
                alt="KFLS Logo"
                className="w-10 h-10 mr-3"
              />
              <h2 className="text-2xl font-bold text-gray-900">KFLS</h2>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Trusted worldwide. Need help?
            </p>
            <Link
              to="/contact"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-full text-sm"
            >
              Contact us
            </Link>
          </div>

          {/* Column 2: KFLS Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">KFLS</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <Link to="/" className="hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-gray-900">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Products Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Products</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <Link to="/collections" className="hover:text-gray-900">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-gray-900">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/cshape" className="hover:text-gray-900">
                  Color & Shape
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <Link to="/" className="hover:text-gray-900">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-gray-900">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Subscribe Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Subscribe</h3>
            <p className="text-gray-500 text-sm mb-4">
              Get the latest updates.
            </p>
            {subscriptionStatus === "subscribed" ? (
              <div className="text-green-600 text-sm p-2 bg-green-50 rounded-lg">
                You're subscribed to our newsletter!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                {isLoggedIn ? (
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50 cursor-not-allowed"
                  />
                ) : (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 disabled:bg-gray-100"
                  />
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full border border-indigo-600 text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-600 hover:text-white transition disabled:opacity-50"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe →"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            ©KFLS 2025, All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {footerSocialWebsites.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
              >
                <span className="sr-only">{social.name}</span>
                {getSocialIcon(social.name)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
