// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// export const cartService = {
//   // Get user's cart
//   getCart: async (userId, token) => {
//     try {
//       const response = await axios.get(`${API_URL}/cart/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Add/Update cart item
//   updateCart: async (userId, productData, token) => {
//     try {
//       const response = await axios.put(
//         `${API_URL}/cart/${userId}`,
//         productData,
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Remove item from cart
//   removeItem: async (userId, productId, token) => {
//     try {
//       const response = await axios.delete(
//         `${API_URL}/cart/${userId}/${productId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Clear entire cart
//   clearCart: async (userId, token) => {
//     try {
//       const response = await axios.delete(
//         `${API_URL}/cart/${userId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   }
// }; 