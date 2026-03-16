import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AdminFeedback() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { t } = useTranslation();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) { setLoading(false); return; }
    const fetchFeedbacks = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/api/admin/feedbacks`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) setFeedbacks(await response.json());
        else setError('Failed to fetch feedbacks');
      } catch (err) { setError('Network error'); }
      finally { setLoading(false); }
    };
    fetchFeedbacks();
  }, [user, isAdmin, getToken]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-[#F07E7E] mb-4">Access Denied</h1>
          <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Administrative Privileges Required</p>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="bg-blob blob-blue top-0 right-0 opacity-5"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 px-4">
           <span className="font-handwriting text-3xl text-[#30A7DB] mb-4 block">Quality control</span>
           <h1 className="text-5xl md:text-7xl text-black">Feedback Registry.</h1>
        </div>

        <div className="bento-card bg-white border-gray-100 border-2 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#111111] text-white">
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-[0.2em]">User Identity</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-[0.2em]">Predicted Breed</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-[0.2em]">Verdict</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-[0.2em]">Internal Message</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-[0.2em]">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {feedbacks.map((f, i) => (
                  <motion.tr 
                    key={f.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-8 py-6 font-semibold text-gray-500 text-sm truncate max-w-[150px]">{f.user_id}</td>
                    <td className="px-8 py-6 font-extrabold text-black">{f.predicted_breed}</td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${f.vote_type === 'upvote' ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                        {f.vote_type}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-gray-400 font-medium text-sm italic">{f.feedback_message || 'N/A'}</td>
                    <td className="px-8 py-6 text-gray-400 text-xs font-bold uppercase tracking-widest">
                       {new Date(f.timestamp).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {feedbacks.length === 0 && (
            <div className="text-center py-24">
              <h3 className="text-2xl font-extrabold text-gray-300 italic">No feedback entries found.</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
