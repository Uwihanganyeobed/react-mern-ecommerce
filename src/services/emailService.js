import axios from 'axios';

export const sendOrderConfirmationEmail = async (orderDetails, userEmail) => {
  try {
    const response = await axios.post('https://react-mern-back-end.onrender.com/email', {
      to: userEmail,
      subject: 'Order Confirmation',
      orderDetails: orderDetails
    });
    return response.data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}; 