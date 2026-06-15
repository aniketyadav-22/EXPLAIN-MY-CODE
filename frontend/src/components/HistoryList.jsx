import { useNavigate } from 'react-router-dom';

export default function HistoryList({ snippets, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-center text-gray-600">Loading history...</div>;
  }

  if (!snippets || snippets.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">No code snippets explained yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {snippets.map((snippet) => (
        <div
          key={snippet.id}
          className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate(`/snippet/${snippet.id}`)}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-mono text-sm text-gray-800 line-clamp-2">
                {snippet.code_text}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Language: <span className="font-medium">{snippet.language}</span>
              </p>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
              {new Date(snippet.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
