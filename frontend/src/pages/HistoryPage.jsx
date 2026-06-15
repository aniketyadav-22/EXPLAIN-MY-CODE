import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { explainApi } from '../api/client';
import HistoryList from '../components/HistoryList';

export default function HistoryPage() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await explainApi.getHistory();
      setSnippets(response.data.snippets);
    } catch (err) {
      setError('Failed to load history. Please log in.');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Your History</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <HistoryList snippets={snippets} loading={loading} />
    </div>
  );
}
