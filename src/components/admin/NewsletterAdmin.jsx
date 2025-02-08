import React, { useState, useEffect } from 'react';
import { newsletter } from '../../services/api';
import { toast } from 'react-toastify';

const NewsletterAdmin = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newsletterForm, setNewsletterForm] = useState({
    subject: '',
    content: ''
  });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await newsletter.getAllSubscribers();
      setSubscribers(response.data.data);
    } catch (error) {
      toast.error('Error fetching subscribers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await newsletter.sendNewsletter(newsletterForm);
      toast.success('Newsletter sent successfully!');
      setNewsletterForm({ subject: '', content: '' });
    } catch (error) {
      toast.error('Failed to send newsletter');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Newsletter Management</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Send Newsletter</h3>
        <form onSubmit={handleSendNewsletter} className="space-y-4">
          <input
            type="text"
            value={newsletterForm.subject}
            onChange={(e) => setNewsletterForm(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Newsletter Subject"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            value={newsletterForm.content}
            onChange={(e) => setNewsletterForm(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Newsletter Content (HTML supported)"
            className="w-full p-2 border rounded h-40"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {isLoading ? 'Sending...' : 'Send Newsletter'}
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Subscribers ({subscribers.length})</h3>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscribed Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscribers.map((subscriber) => (
                <tr key={subscriber._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subscriber.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subscriber.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NewsletterAdmin; 