import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { explainApi } from '../api/client';
import HistoryList from '../components/HistoryList';

export default function HistoryPage() {
  const [snippets, setSnippets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    let result = snippets;
    if (langFilter !== 'all') {
      result = result.filter((s) => s.language === langFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((s) =>
        s.code_text.toLowerCase().includes(q) ||
        s.language.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [snippets, langFilter, search]);

  const fetchHistory = async () => {
    try {
      const response = await explainApi.getHistory();
      setSnippets(response.data.snippets);
    } catch (err) {
      setError('Please log in to view your history.');
      setTimeout(() => navigate('/login'), 1500);
    } finally {
      setLoading(false);
    }
  };

  const languages = [...new Set(snippets.map((s) => s.language))];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-4xl font-bold text-white mb-2">Your History</h1>
        <p className="text-gray-500">
          {snippets.length} {snippets.length === 1 ? 'snippet' : 'snippets'} explained
        </p>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      {/* Filters */}
      {!loading && snippets.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your snippets..."
                className="input-dark pl-11"
              />
            </div>
          </div>

          {/* Language Filter */}
          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className="select-dark w-full sm:w-48"
          >
            <option value="all">All Languages</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Results */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <HistoryList snippets={filtered} loading={loading} />
      </div>

      {/* No results from filter */}
      {!loading && snippets.length > 0 && filtered.length === 0 && (
        <div className="glass-card p-8 text-center animate-fade-in mt-4">
          <p className="text-gray-500">No snippets match your filter.</p>
        </div>
      )}
    </div>
  );
}
