import React, { createContext, useContext, useState, useEffect } from 'react';
import { user as userApi } from '../services/api';
import { useAuth } from './authContext';
import { toast } from 'react-toastify';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userApi.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await userApi.updateProfile(profileData);
      setProfile(response.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  // Address Management
  const fetchAddresses = async () => {
    try {
      const response = await userApi.getAddresses();
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const addAddress = async (addressData) => {
    try {
      const response = await userApi.addAddress(addressData);
      setAddresses([...addresses, response.data]);
      toast.success('Address added successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding address');
      throw error;
    }
  };

  const updateAddress = async (addressId, addressData) => {
    try {
      const response = await userApi.updateAddress(addressId, addressData);
      setAddresses(addresses.map(addr => 
        addr._id === addressId ? response.data : addr
      ));
      toast.success('Address updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating address');
      throw error;
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      await userApi.deleteAddress(addressId);
      setAddresses(addresses.filter(addr => addr._id !== addressId));
      toast.success('Address deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting address');
    }
  };

  // Wishlist Management
  const fetchWishlist = async () => {
    try {
      const response = await userApi.getWishlist();
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const response = await userApi.addToWishlist(productId);
      setWishlist(response.data);
      toast.success('Added to wishlist');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding to wishlist');
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await userApi.removeFromWishlist(productId);
      setWishlist(wishlist.filter(item => item._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error removing from wishlist');
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchProfile();
      fetchAddresses();
      fetchWishlist();
    }
  }, [authUser]);

  return (
    <UserContext.Provider value={{
      profile,
      addresses,
      wishlist,
      loading,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      addToWishlist,
      removeFromWishlist,
      fetchProfile,
      fetchAddresses,
      fetchWishlist
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 