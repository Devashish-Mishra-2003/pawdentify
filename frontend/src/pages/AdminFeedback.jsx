import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from "../components/LoadingSpinner";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AdminFeedback() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { t } = useTranslation();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const fetchFeedbacks = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/api/admin/feedbacks`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setFeedbacks(data);
        } else {
          setError(t('admin.feedback.fetchError'));
        }
      } catch (err) {
        setError(t('admin.feedback.networkError'));
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [user, isAdmin, getToken, t]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center" style={{ backgroundColor: 'var(--color-admin-page-bg)' }}>
        <div className="text-center">
          <h1 className="text-3xl mb-4" style={{ color: 'var(--color-admin-title)' }}>
            {t('admin.feedback.accessDenied')}
          </h1>
          <p style={{ color: 'var(--color-admin-text)' }}>
            {t('admin.feedback.noPermission')}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner message={t('common.loading')} />;
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center" style={{ backgroundColor: 'var(--color-admin-page-bg)' }}>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-admin-error-title)' }}>
            {t('admin.feedback.errorTitle')}
          </h1>
          <p style={{ color: 'var(--color-admin-error-text)' }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: 'var(--color-admin-page-bg)', paddingTop: '120px' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl mb-6" style={{ color: 'var(--color-admin-title)' }}>
          {t('admin.feedback.title')}
        </h1>

        <div className="rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--color-admin-table-bg)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: 'var(--color-admin-table-header-bg)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-admin-table-header-text)' }}>
                    {t('admin.feedback.table.userId')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-admin-table-header-text)' }}>
                    {t('admin.feedback.table.predictedBreed')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-admin-table-header-text)' }}>
                    {t('admin.feedback.table.voteType')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-admin-table-header-text)' }}>
                    {t('admin.feedback.table.message')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-admin-table-header-text)' }}>
                    {t('admin.feedback.table.timestamp')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ backgroundColor: 'var(--color-admin-table-bg)', borderColor: 'var(--color-admin-table-border)' }}>
                {feedbacks.map((feedback) => (
                  <tr key={feedback.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--color-admin-table-text)' }}>
                      {feedback.user_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--color-admin-table-text)' }}>
                      {feedback.predicted_breed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={feedback.vote_type === 'upvote' ? {
                          backgroundColor: 'var(--color-admin-upvote-bg)',
                          color: 'var(--color-admin-upvote-text)'
                        } : {
                          backgroundColor: 'var(--color-admin-downvote-bg)',
                          color: 'var(--color-admin-downvote-text)'
                        }}
                      >
                        {feedback.vote_type === 'upvote' ? '👍 ' : '👎 '}
                        {feedback.vote_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate" style={{ color: 'var(--color-admin-table-text)' }}>
                      {feedback.feedback_message || t('admin.feedback.table.noMessage')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--color-admin-table-text)' }}>
                      {new Date(feedback.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {feedbacks.length === 0 && (
            <div className="text-center py-8" style={{ color: 'var(--color-admin-empty-text)' }}>
              {t('admin.feedback.noFeedbacks')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
