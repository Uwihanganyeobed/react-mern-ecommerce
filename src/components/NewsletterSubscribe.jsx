import React from 'react'

export default function NewsletterSubscribe() {
  return (
    <div>NewsletterSubscribe</div>
  )
}

// import React, { useState } from 'react';
// import { useAuth } from '../context/authContext';
// import { toast } from 'react-toastify';
// import { motion } from 'framer-motion';

// const NewsletterSubscribe = () => {
//   const { user } = useAuth();
//   const [showPreferences, setShowPreferences] = useState(false);
//   const [preferences, setPreferences] = useState({
//     frequency: 'weekly',
//     interests: [],
//     subscriptionType: 'all'
//   });

//   const handleSubscribe = async () => {
//     try {
//       const response = await fetch('/api/subscribers/subscribe', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${user?.token}`
//         },
//         body: JSON.stringify(preferences)
//       });

//       const data = await response.json();
//       if (data.success) {
//         toast.success('Successfully subscribed to newsletter!');
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error('Error subscribing to newsletter');
//     }
//   };

//   return (
//     <motion.div 
//       className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-6 max-w-md"
//       initial={{ y: 100, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       exit={{ y: 100, opacity: 0 }}
//     >
//       <h3 className="text-xl font-semibold mb-4">
//         Stay Updated with {process.env.REACT_APP_SITE_NAME}
//       </h3>
      
//       {!showPreferences ? (
//         <div className="space-y-4">
//           <p className="text-gray-600">
//             Get exclusive offers, new product alerts, and personalized updates!
//           </p>
//           <button
//             onClick={() => setShowPreferences(true)}
//             className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             {user ? 'Subscribe Now' : 'Sign Up for Newsletter'}
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Email Frequency</label>
//             <select
//               value={preferences.frequency}
//               onChange={(e) => setPreferences({...preferences, frequency: e.target.value})}
//               className="w-full border rounded-lg p-2"
//             >
//               <option value="daily">Daily Updates</option>
//               <option value="weekly">Weekly Digest</option>
//               <option value="monthly">Monthly Newsletter</option>
//             </select>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Interests</label>
//             <div className="flex flex-wrap gap-2">
//               {['electronics', 'fashion', 'home', 'sports', 'books'].map(interest => (
//                 <label key={interest} className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     checked={preferences.interests.includes(interest)}
//                     onChange={(e) => {
//                       const newInterests = e.target.checked
//                         ? [...preferences.interests, interest]
//                         : preferences.interests.filter(i => i !== interest);
//                       setPreferences({...preferences, interests: newInterests});
//                     }}
//                     className="rounded text-indigo-600"
//                   />
//                   <span className="capitalize">{interest}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <button
//             onClick={handleSubscribe}
//             className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             Confirm Subscription
//           </button>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default NewsletterSubscribe; 